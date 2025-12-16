import Foundation
import WidgetKit

@MainActor
class WidgetDataManager {
    static let shared = WidgetDataManager()
    private let defaults = UserDefaults(suiteName: "group.com.smartcard.app")

    private init() {}

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

        if let topRec = diningRecs.first {
            defaults?.set("Dining", forKey: "widget_topCategory")
            defaults?.set("fork.knife", forKey: "widget_topCategoryIcon")
            defaults?.set(topRec.userCard.nickname ?? topRec.card.name, forKey: "widget_bestCard")
            defaults?.set(topRec.card.imageColor, forKey: "widget_bestCardColor")
            defaults?.set(topRec.displayReward, forKey: "widget_rewardRate")
        } else {
            defaults?.set("Dining", forKey: "widget_topCategory")
            defaults?.set("fork.knife", forKey: "widget_topCategoryIcon")
            defaults?.set("Add Cards", forKey: "widget_bestCard")
            defaults?.set("#808080", forKey: "widget_bestCardColor")
            defaults?.set("-", forKey: "widget_rewardRate")
        }

        // Get rotating categories
        let currentQ = currentQuarter()
        let currentY = currentYear()

        var rotatingCategories: [String] = []
        var rotatingCard: String? = nil

        for userCard in cardViewModel.userCards {
            guard let card = cardViewModel.getCard(for: userCard),
                  let rotating = card.rotatingCategories,
                  let currentRotating = rotating.first(where: { $0.quarter == currentQ && $0.year == currentY }) else {
                continue
            }

            rotatingCategories = currentRotating.categories.map { $0.rawValue }
            rotatingCard = userCard.nickname ?? card.name
            break // Just get the first rotating card
        }

        defaults?.set(rotatingCategories, forKey: "widget_rotatingCategories")
        defaults?.set(rotatingCard, forKey: "widget_rotatingCard")

        // This month stats
        let thisMonthSpendings = spendingViewModel.spendingsThisMonth()
        let totalSpent = thisMonthSpendings.reduce(0) { $0 + $1.amount }
        let totalRewards = thisMonthSpendings.reduce(0) { $0 + $1.rewardEarned }

        defaults?.set(totalSpent, forKey: "widget_spendingThisMonth")
        defaults?.set(totalRewards, forKey: "widget_rewardsThisMonth")

        // Refresh widgets
        WidgetCenter.shared.reloadAllTimelines()
    }

    private func currentQuarter() -> Int {
        let month = Calendar.current.component(.month, from: Date())
        return ((month - 1) / 3) + 1
    }

    private func currentYear() -> Int {
        Calendar.current.component(.year, from: Date())
    }
}
