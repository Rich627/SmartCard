import Foundation
import WidgetKit
import CryptoKit

@MainActor
class WidgetDataManager {
    static let shared = WidgetDataManager()

    private static let appGroupID = "group.com.smartcard.app"
    private static let widgetDataKey = "widget_encrypted_data"
    private static let symmetricKeyKeychainKey = "widgetEncryptionKey"

    private let defaults: UserDefaults? = {
        let suite = UserDefaults(suiteName: appGroupID)
        if suite == nil {
            assertionFailure("Failed to create UserDefaults suite '\(appGroupID)' — check App Group entitlements")
        }
        return suite
    }()

    private init() {}

    // MARK: - Symmetric Key Management

    /// Get or create the symmetric key for widget data encryption (stored in shared Keychain).
    private func getOrCreateSymmetricKey() -> SymmetricKey {
        // Try loading from shared Keychain
        if let keyData: Data = try? KeychainHelper.shared.load(
            forKey: Self.symmetricKeyKeychainKey,
            accessGroup: Self.appGroupID
        ) {
            return SymmetricKey(data: keyData)
        }

        // Generate and save a new key
        let key = SymmetricKey(size: .bits256)
        let keyData = key.withUnsafeBytes { Data($0) }
        try? KeychainHelper.shared.save(
            keyData,
            forKey: Self.symmetricKeyKeychainKey,
            accessGroup: Self.appGroupID
        )
        return key
    }

    // MARK: - Encryption / Decryption

    private func encryptData(_ data: Data) -> Data? {
        let key = getOrCreateSymmetricKey()
        do {
            let sealedBox = try AES.GCM.seal(data, using: key)
            return sealedBox.combined
        } catch {
            return nil
        }
    }

    private func decryptData(_ data: Data) -> Data? {
        let key = getOrCreateSymmetricKey()
        do {
            let sealedBox = try AES.GCM.SealedBox(combined: data)
            return try AES.GCM.open(sealedBox, using: key)
        } catch {
            return nil
        }
    }

    // MARK: - Widget Data Model (for encrypted blob)

    struct WidgetPayload: Codable {
        let topCategory: String
        let topCategoryIcon: String
        let bestCard: String
        let bestCardColor: String
        let rewardRate: String
        let rotatingCategories: [String]
        let rotatingCard: String?
        let spendingThisMonth: Double
        let rewardsThisMonth: Double
    }

    // MARK: - Write Encrypted Widget Data

    func updateWidgetData(
        cardViewModel: CardViewModel,
        spendingViewModel: SpendingViewModel
    ) {
        // Find best card for common category (Dining as default)
        let diningRecs = RecommendationEngine.shared.getRecommendations(
            for: .dining,
            amount: 100,
            userCards: cardViewModel.userCards,
            allCards: cardViewModel.allCards
        )

        var payload: WidgetPayload

        if let topRec = diningRecs.first {
            // Get rotating categories
            let currentQ = Date().currentQuarter
            let currentY = RotatingCategory.currentYear()

            var rotatingCategories: [String] = []
            var rotatingCard: String?

            for userCard in cardViewModel.userCards {
                guard let card = cardViewModel.getCard(for: userCard),
                      let rotating = card.rotatingCategories,
                      let currentRotating = rotating.first(where: { $0.quarter == currentQ && $0.year == currentY }) else {
                    continue
                }

                rotatingCategories = currentRotating.categories.map { $0.rawValue }
                rotatingCard = userCard.nickname ?? card.name
                break
            }

            // This month stats
            let thisMonthSpendings = spendingViewModel.spendingsThisMonth()
            let totalSpent = thisMonthSpendings.reduce(0) { $0 + $1.amount }
            let totalRewards = thisMonthSpendings.reduce(0) { $0 + $1.rewardEarned }

            payload = WidgetPayload(
                topCategory: "Dining",
                topCategoryIcon: "fork.knife",
                bestCard: topRec.userCard.nickname ?? topRec.card.name,
                bestCardColor: topRec.card.imageColor,
                rewardRate: topRec.displayReward,
                rotatingCategories: rotatingCategories,
                rotatingCard: rotatingCard,
                spendingThisMonth: totalSpent,
                rewardsThisMonth: totalRewards
            )
        } else {
            let thisMonthSpendings = spendingViewModel.spendingsThisMonth()
            let totalSpent = thisMonthSpendings.reduce(0) { $0 + $1.amount }
            let totalRewards = thisMonthSpendings.reduce(0) { $0 + $1.rewardEarned }

            payload = WidgetPayload(
                topCategory: "Dining",
                topCategoryIcon: "fork.knife",
                bestCard: "Add Cards",
                bestCardColor: "#808080",
                rewardRate: "-",
                rotatingCategories: [],
                rotatingCard: nil,
                spendingThisMonth: totalSpent,
                rewardsThisMonth: totalRewards
            )
        }

        // Encrypt and store
        if let jsonData = try? JSONEncoder().encode(payload),
           let encrypted = encryptData(jsonData) {
            defaults?.set(encrypted, forKey: Self.widgetDataKey)
        }

        // Refresh widgets
        WidgetCenter.shared.reloadAllTimelines()
    }

    // MARK: - Read Encrypted Widget Data (for Widget extension)

    static func loadWidgetPayload() -> WidgetPayload? {
        let defaults = UserDefaults(suiteName: appGroupID)
        guard let encrypted = defaults?.data(forKey: widgetDataKey) else {
            return nil
        }

        // Decrypt using shared Keychain key
        let manager = WidgetDataManager.shared
        guard let decrypted = manager.decryptData(encrypted) else {
            return nil
        }

        return try? JSONDecoder().decode(WidgetPayload.self, from: decrypted)
    }
}
