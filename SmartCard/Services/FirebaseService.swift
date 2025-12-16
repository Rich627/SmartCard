import Foundation
import FirebaseFirestore

class FirebaseService {
    static let shared = FirebaseService()
    private let db = Firestore.firestore()

    private init() {}

    // MARK: - Credit Cards (Public Collection)

    func fetchAllCards() async throws -> [CreditCard] {
        let snapshot = try await db.collection("cards").getDocuments()
        return snapshot.documents.compactMap { doc in
            try? doc.data(as: CreditCard.self)
        }
    }

    func fetchCard(id: String) async throws -> CreditCard? {
        let doc = try await db.collection("cards").document(id).getDocument()
        return try? doc.data(as: CreditCard.self)
    }

    // Used by crawler to update card data
    func updateCard(_ card: CreditCard) async throws {
        try db.collection("cards").document(card.id).setData(from: card)
    }

    // MARK: - Merchants (Public Collection)

    func fetchMerchants() async throws -> [Merchant] {
        let snapshot = try await db.collection("merchants").getDocuments()
        return snapshot.documents.compactMap { doc in
            try? doc.data(as: Merchant.self)
        }
    }

    // MARK: - User Wallet

    func fetchUserCards(userId: String) async throws -> [UserCard] {
        let snapshot = try await db.collection("users").document(userId)
            .collection("wallet").getDocuments()
        return snapshot.documents.compactMap { doc in
            try? doc.data(as: UserCard.self)
        }
    }

    func addUserCard(userId: String, userCard: UserCard) async throws {
        try db.collection("users").document(userId)
            .collection("wallet").document(userCard.id)
            .setData(from: userCard)
    }

    func updateUserCard(userId: String, userCard: UserCard) async throws {
        try db.collection("users").document(userId)
            .collection("wallet").document(userCard.id)
            .setData(from: userCard, merge: true)
    }

    func deleteUserCard(userId: String, userCardId: String) async throws {
        try await db.collection("users").document(userId)
            .collection("wallet").document(userCardId)
            .delete()
    }

    // MARK: - Spending Records

    func fetchSpendings(userId: String) async throws -> [Spending] {
        let snapshot = try await db.collection("users").document(userId)
            .collection("spending")
            .order(by: "date", descending: true)
            .limit(to: 500)
            .getDocuments()
        return snapshot.documents.compactMap { doc in
            try? doc.data(as: Spending.self)
        }
    }

    func addSpending(userId: String, spending: Spending) async throws {
        try db.collection("users").document(userId)
            .collection("spending").document(spending.id)
            .setData(from: spending)
    }

    func deleteSpending(userId: String, spendingId: String) async throws {
        try await db.collection("users").document(userId)
            .collection("spending").document(spendingId)
            .delete()
    }

    // MARK: - User Preferences

    func fetchUserPreferences(userId: String) async throws -> UserPreferences? {
        let doc = try await db.collection("users").document(userId)
            .collection("settings").document("preferences")
            .getDocument()
        return try? doc.data(as: UserPreferences.self)
    }

    func updateUserPreferences(userId: String, preferences: UserPreferences) async throws {
        try db.collection("users").document(userId)
            .collection("settings").document("preferences")
            .setData(from: preferences)
    }

    // MARK: - Real-time Listeners

    func listenToCards(completion: @escaping ([CreditCard]) -> Void) -> ListenerRegistration {
        return db.collection("cards").addSnapshotListener { snapshot, error in
            guard let documents = snapshot?.documents else { return }
            let cards = documents.compactMap { doc in
                try? doc.data(as: CreditCard.self)
            }
            completion(cards)
        }
    }

    func listenToUserCards(userId: String, completion: @escaping ([UserCard]) -> Void) -> ListenerRegistration {
        return db.collection("users").document(userId)
            .collection("wallet")
            .addSnapshotListener { snapshot, error in
                guard let documents = snapshot?.documents else { return }
                let cards = documents.compactMap { doc in
                    try? doc.data(as: UserCard.self)
                }
                completion(cards)
            }
    }

    func listenToSpendings(userId: String, completion: @escaping ([Spending]) -> Void) -> ListenerRegistration {
        return db.collection("users").document(userId)
            .collection("spending")
            .order(by: "date", descending: true)
            .limit(to: 100)
            .addSnapshotListener { snapshot, error in
                guard let documents = snapshot?.documents else { return }
                let spendings = documents.compactMap { doc in
                    try? doc.data(as: Spending.self)
                }
                completion(spendings)
            }
    }
}

// MARK: - User Preferences Model

struct UserPreferences: Codable {
    var notificationsEnabled: Bool = true
    var rotatingReminders: Bool = true
    var spendingCapAlerts: Bool = true
    var defaultCurrency: String = "USD"
}
