import Foundation
import LinkKit

class PlaidService: ObservableObject {
    static let shared = PlaidService()

    @Published var isLinking = false
    @Published var linkedAccounts: [PlaidAccount] = []
    @Published var error: String?

    // Firebase Cloud Functions URL
    private let cloudFunctionsBaseURL = "https://us-central1-smartcard-c6e92.cloudfunctions.net"

    private init() {
        loadLinkedAccounts()
    }

    // MARK: - Link Token

    /// Get a link token from your backend (Firebase Cloud Functions)
    func getLinkToken() async throws -> String {
        let url = URL(string: "\(cloudFunctionsBaseURL)/createLinkToken")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // You might want to include user ID for personalized linking
        let body: [String: Any] = [
            "client_user_id": UUID().uuidString
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw PlaidError.linkTokenFailed
        }

        let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        guard let linkToken = json?["link_token"] as? String else {
            throw PlaidError.invalidResponse
        }

        return linkToken
    }

    // MARK: - Exchange Public Token

    /// Exchange public token for access token (happens on backend)
    func exchangePublicToken(_ publicToken: String, institutionName: String) async throws {
        let url = URL(string: "\(cloudFunctionsBaseURL)/exchangePublicToken")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "public_token": publicToken,
            "institution_name": institutionName
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw PlaidError.exchangeFailed
        }

        // Parse the response to get account info
        if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
           let accountsData = json["accounts"] as? [[String: Any]] {

            let accounts = accountsData.compactMap { accountDict -> PlaidAccount? in
                guard let id = accountDict["account_id"] as? String,
                      let name = accountDict["name"] as? String else {
                    return nil
                }
                return PlaidAccount(
                    id: id,
                    name: name,
                    institutionName: institutionName,
                    mask: accountDict["mask"] as? String,
                    type: accountDict["type"] as? String ?? "credit"
                )
            }

            await MainActor.run {
                self.linkedAccounts.append(contentsOf: accounts)
                self.saveLinkedAccounts()
            }
        }
    }

    // MARK: - Fetch Transactions

    /// Fetch transactions from Plaid (through backend)
    func fetchTransactions(accountId: String, startDate: Date, endDate: Date) async throws -> [PlaidTransaction] {
        let url = URL(string: "\(cloudFunctionsBaseURL)/getTransactions")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let dateFormatter = ISO8601DateFormatter()
        let body: [String: Any] = [
            "account_id": accountId,
            "start_date": dateFormatter.string(from: startDate),
            "end_date": dateFormatter.string(from: endDate)
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        let response = try decoder.decode(TransactionsResponse.self, from: data)
        return response.transactions
    }

    // MARK: - Persistence

    private func loadLinkedAccounts() {
        if let data = UserDefaults.standard.data(forKey: "plaidLinkedAccounts"),
           let accounts = try? JSONDecoder().decode([PlaidAccount].self, from: data) {
            linkedAccounts = accounts
        }
    }

    private func saveLinkedAccounts() {
        if let data = try? JSONEncoder().encode(linkedAccounts) {
            UserDefaults.standard.set(data, forKey: "plaidLinkedAccounts")
        }
    }

    func unlinkAccount(_ account: PlaidAccount) {
        linkedAccounts.removeAll { $0.id == account.id }
        saveLinkedAccounts()
        // TODO: Call backend to revoke access token
    }
}

// MARK: - Models

struct PlaidAccount: Identifiable, Codable {
    let id: String
    let name: String
    let institutionName: String
    let mask: String?
    let type: String

    var displayName: String {
        if let mask = mask {
            return "\(name) ••••\(mask)"
        }
        return name
    }
}

struct PlaidTransaction: Identifiable, Codable {
    let id: String
    let accountId: String
    let amount: Double
    let date: Date
    let name: String
    let merchantName: String?
    let category: [String]?
    let pending: Bool

    enum CodingKeys: String, CodingKey {
        case id = "transaction_id"
        case accountId = "account_id"
        case amount, date, name
        case merchantName = "merchant_name"
        case category, pending
    }
}

struct TransactionsResponse: Codable {
    let transactions: [PlaidTransaction]
}

enum PlaidError: Error, LocalizedError {
    case linkTokenFailed
    case exchangeFailed
    case invalidResponse
    case notLinked

    var errorDescription: String? {
        switch self {
        case .linkTokenFailed:
            return "Failed to create link token"
        case .exchangeFailed:
            return "Failed to exchange token"
        case .invalidResponse:
            return "Invalid response from server"
        case .notLinked:
            return "No bank account linked"
        }
    }
}
