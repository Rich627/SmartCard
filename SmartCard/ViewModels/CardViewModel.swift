import Foundation
import SwiftUI

@MainActor
class CardViewModel: ObservableObject {
    @Published var allCards: [CreditCard] = MockData.creditCards
    @Published var userCards: [UserCard] = []
    @Published var isLoading = false

    init() {
        loadUserCards()
    }

    // MARK: - Persistence (UserDefaults for now, Firebase later)

    private func loadUserCards() {
        if let data = UserDefaults.standard.data(forKey: "userCards"),
           let cards = try? JSONDecoder().decode([UserCard].self, from: data) {
            userCards = cards
        } else {
            // Load sample data for first launch
            userCards = MockData.sampleUserCards
            saveUserCards()
        }
    }

    private func saveUserCards() {
        if let data = try? JSONEncoder().encode(userCards) {
            UserDefaults.standard.set(data, forKey: "userCards")
        }
    }

    // MARK: - Data Management

    func resetToSampleData() {
        userCards = MockData.sampleUserCards
        saveUserCards()
    }

    func clearAllData() {
        userCards = []
        UserDefaults.standard.removeObject(forKey: "userCards")
    }

    // MARK: - Card Management

    func addCard(_ card: CreditCard, nickname: String? = nil, creditLimit: Double? = nil) {
        // Check if card already exists
        guard !userCards.contains(where: { $0.cardId == card.id }) else { return }

        var newUserCard = UserCard(card: card, nickname: nickname, creditLimit: creditLimit)

        // Set default activated quarters for rotating cards
        if card.rotatingCategories != nil {
            let currentQ = RotatingCategory.currentQuarter()
            let currentY = RotatingCategory.currentYear()
            newUserCard.activatedQuarters = ["\(currentY)-Q\(currentQ)"]
        }

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

    func activateQuarter(for userCard: UserCard, quarter: Int, year: Int) {
        if let index = userCards.firstIndex(where: { $0.id == userCard.id }) {
            let quarterId = "\(year)-Q\(quarter)"
            if userCards[index].activatedQuarters == nil {
                userCards[index].activatedQuarters = [quarterId]
            } else if !userCards[index].activatedQuarters!.contains(quarterId) {
                userCards[index].activatedQuarters!.append(quarterId)
            }
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

    // Cards with rotating categories that need activation
    var cardsNeedingActivation: [(UserCard, CreditCard, RotatingCategory)] {
        let currentQ = RotatingCategory.currentQuarter()
        let currentY = RotatingCategory.currentYear()
        let quarterId = "\(currentY)-Q\(currentQ)"

        var result: [(UserCard, CreditCard, RotatingCategory)] = []

        for userCard in userCards {
            guard let card = getCard(for: userCard),
                  let rotating = card.rotatingCategories,
                  let currentRotating = rotating.first(where: { $0.quarter == currentQ && $0.year == currentY }),
                  currentRotating.activationRequired else {
                continue
            }

            let isActivated = userCard.activatedQuarters?.contains(quarterId) ?? false
            if !isActivated {
                result.append((userCard, card, currentRotating))
            }
        }

        return result
    }
}
