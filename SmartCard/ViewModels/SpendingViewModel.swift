import Foundation
import SwiftUI

@MainActor
class SpendingViewModel: ObservableObject {
    @Published var spendings: [Spending] = []
    @Published var isLoading = false

    init() {
        loadSpendings()
    }

    // MARK: - Persistence

    private func loadSpendings() {
        if let data = UserDefaults.standard.data(forKey: "spendings"),
           let loaded = try? JSONDecoder().decode([Spending].self, from: data) {
            spendings = loaded
        } else {
            spendings = MockData.sampleSpendings
            saveSpendings()
        }
    }

    private func saveSpendings() {
        if let data = try? JSONEncoder().encode(spendings) {
            UserDefaults.standard.set(data, forKey: "spendings")
        }
    }

    // MARK: - Data Management

    func resetToSampleData() {
        spendings = MockData.sampleSpendings
        saveSpendings()
    }

    func clearAllData() {
        spendings = []
        UserDefaults.standard.removeObject(forKey: "spendings")
    }

    // MARK: - Spending Management

    func addSpending(
        amount: Double,
        merchant: String,
        category: SpendingCategory,
        cardUsed: String,
        date: Date = Date(),
        note: String? = nil,
        cardViewModel: CardViewModel
    ) {
        // Calculate reward earned
        guard let userCard = cardViewModel.getUserCard(byCardId: cardUsed),
              let card = cardViewModel.getCard(byId: cardUsed) else {
            return
        }

        let effectiveMultiplier = card.getReward(
            for: category,
            selectedCategories: userCard.selectedCategories,
            activatedQuarters: userCard.activatedQuarters
        )

        let rewardEarned = calculateReward(
            amount: amount,
            multiplier: effectiveMultiplier,
            card: card
        )

        // Find optimal card
        let recommendations = RecommendationEngine.shared.getRecommendations(
            for: category,
            amount: amount,
            userCards: cardViewModel.userCards,
            allCards: cardViewModel.allCards
        )

        let optimalCard = recommendations.first
        let missedReward: Double? = {
            if let optimal = optimalCard, optimal.card.id != cardUsed {
                return optimal.estimatedReward - rewardEarned
            }
            return nil
        }()

        let spending = Spending(
            amount: amount,
            merchant: merchant,
            category: category,
            cardUsed: cardUsed,
            date: date,
            note: note,
            rewardEarned: rewardEarned,
            optimalCardId: optimalCard?.card.id != cardUsed ? optimalCard?.card.id : nil,
            missedReward: missedReward
        )

        spendings.insert(spending, at: 0)
        saveSpendings()
    }

    func deleteSpending(_ spending: Spending) {
        spendings.removeAll { $0.id == spending.id }
        saveSpendings()
    }

    private func calculateReward(amount: Double, multiplier: Double, card: CreditCard) -> Double {
        if card.baseIsPercentage || card.rewardType == .cashback {
            return amount * (multiplier / 100)
        } else {
            // Points - estimate at 1 cpp
            return amount * multiplier * 0.01
        }
    }

    // MARK: - Analytics

    var totalSpending: Double {
        spendings.reduce(0) { $0 + $1.amount }
    }

    var totalRewardsEarned: Double {
        spendings.reduce(0) { $0 + $1.rewardEarned }
    }

    var totalMissedRewards: Double {
        spendings.compactMap { $0.missedReward }.reduce(0, +)
    }

    var spendingsByCategory: [(SpendingCategory, Double)] {
        let grouped = Dictionary(grouping: spendings, by: { $0.category })
        return grouped.map { ($0.key, $0.value.reduce(0) { $0 + $1.amount }) }
            .sorted { $0.1 > $1.1 }
    }

    var spendingsByCard: [(String, Double)] {
        let grouped = Dictionary(grouping: spendings, by: { $0.cardUsed })
        return grouped.map { ($0.key, $0.value.reduce(0) { $0 + $1.amount }) }
            .sorted { $0.1 > $1.1 }
    }

    func spendingsThisMonth() -> [Spending] {
        let calendar = Calendar.current
        let now = Date()
        let startOfMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: now))!

        return spendings.filter { $0.date >= startOfMonth }
    }

    func spendingsThisQuarter() -> [Spending] {
        let calendar = Calendar.current
        let now = Date()
        let quarter = (calendar.component(.month, from: now) - 1) / 3 + 1
        let startMonth = (quarter - 1) * 3 + 1

        var components = calendar.dateComponents([.year], from: now)
        components.month = startMonth
        components.day = 1
        let startOfQuarter = calendar.date(from: components)!

        return spendings.filter { $0.date >= startOfQuarter }
    }
}
