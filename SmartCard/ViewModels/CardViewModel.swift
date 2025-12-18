import Foundation
import SwiftUI

@MainActor
class CardViewModel: ObservableObject {
    @Published var allCards: [CreditCard] = []
    @Published var userCards: [UserCard] = []
    @Published var isLoading = false

    init() {
        loadUserCards()
        Task {
            await loadCardsFromFirebase()
        }
    }

    // MARK: - Firebase

    func loadCardsFromFirebase() async {
        isLoading = true
        defer { isLoading = false }

        do {
            let cards = try await FirebaseService.shared.fetchAllCards()
            if cards.isEmpty {
                // Fallback to MockData if Firebase is empty
                allCards = MockData.creditCards
                print("Firebase empty, using MockData (\(allCards.count) cards)")
            } else {
                allCards = cards
                print("Loaded \(cards.count) cards from Firebase")
            }
        } catch {
            // Fallback to MockData on error
            allCards = MockData.creditCards
            print("Firebase error: \(error), using MockData")
        }
    }

    // MARK: - Persistence (UserDefaults)

    private func loadUserCards() {
        if let data = UserDefaults.standard.data(forKey: "userCards"),
           let cards = try? JSONDecoder().decode([UserCard].self, from: data) {
            userCards = cards
        } else {
            // Start with empty wallet for new users
            userCards = []
        }
    }

    private func saveUserCards() {
        if let data = try? JSONEncoder().encode(userCards) {
            UserDefaults.standard.set(data, forKey: "userCards")
        }
    }

    func clearAllData() {
        userCards = []
        UserDefaults.standard.removeObject(forKey: "userCards")
    }

    // MARK: - Card Management

    func addCard(_ card: CreditCard, nickname: String? = nil, creditLimit: Double? = nil) {
        // Check if card already exists
        guard !userCards.contains(where: { $0.cardId == card.id }) else { return }

        let newUserCard = UserCard(card: card, nickname: nickname, creditLimit: creditLimit)
        userCards.append(newUserCard)
        saveUserCards()
    }

    func removeCard(_ userCard: UserCard) {
        userCards.removeAll { $0.id == userCard.id }
        saveUserCards()
    }

    func updateNickname(for userCard: UserCard, nickname: String?) {
        if let index = userCards.firstIndex(where: { $0.id == userCard.id }) {
            userCards[index].nickname = nickname
            saveUserCards()
        }
    }

    func updateSelectedCategories(for userCard: UserCard, categories: [SpendingCategory]) {
        if let index = userCards.firstIndex(where: { $0.id == userCard.id }) {
            userCards[index].selectedCategories = categories
            saveUserCards()
        }
    }

    func updateCreditLimit(for userCard: UserCard, limit: Double?) {
        if let index = userCards.firstIndex(where: { $0.id == userCard.id }) {
            userCards[index].creditLimit = limit
            saveUserCards()
        }
    }

    func updateBalance(for userCard: UserCard, balance: Double?) {
        if let index = userCards.firstIndex(where: { $0.id == userCard.id }) {
            userCards[index].currentBalance = balance
            saveUserCards()
        }
    }

    // Calculate total credit utilization across all cards
    var totalCreditUtilization: Double? {
        let cardsWithLimits = userCards.filter { $0.creditLimit != nil && $0.currentBalance != nil }
        guard !cardsWithLimits.isEmpty else { return nil }

        let totalLimit = cardsWithLimits.compactMap { $0.creditLimit }.reduce(0, +)
        let totalBalance = cardsWithLimits.compactMap { $0.currentBalance }.reduce(0, +)

        guard totalLimit > 0 else { return nil }
        return (totalBalance / totalLimit) * 100
    }

    // MARK: - Helpers

    func getCard(for userCard: UserCard) -> CreditCard? {
        allCards.first { $0.id == userCard.cardId }
    }

    func getCard(byId id: String) -> CreditCard? {
        allCards.first { $0.id == id }
    }

    func getUserCard(byCardId cardId: String) -> UserCard? {
        userCards.first { $0.cardId == cardId }
    }

    var availableCardsToAdd: [CreditCard] {
        allCards.filter { card in
            !userCards.contains { $0.cardId == card.id }
        }
    }
}
