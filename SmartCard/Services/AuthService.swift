import Foundation
import FirebaseAuth
import AuthenticationServices

@MainActor
class AuthService: ObservableObject {
    @Published var user: User?
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var errorMessage: String?

    private var authStateHandler: AuthStateDidChangeListenerHandle?

    init() {
        addAuthStateListener()
    }

    deinit {
        if let handler = authStateHandler {
            Auth.auth().removeStateDidChangeListener(handler)
        }
    }

    private func addAuthStateListener() {
        authStateHandler = Auth.auth().addStateDidChangeListener { [weak self] _, user in
            Task { @MainActor in
                self?.user = user
                self?.isAuthenticated = user != nil
            }
        }
    }

    // MARK: - Email/Password Auth

    func signUp(email: String, password: String) async throws {
        isLoading = true
        errorMessage = nil

        do {
            let result = try await Auth.auth().createUser(withEmail: email, password: password)
            user = result.user
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
            throw error
        }

        isLoading = false
    }

    func signIn(email: String, password: String) async throws {
        isLoading = true
        errorMessage = nil

        do {
            let result = try await Auth.auth().signIn(withEmail: email, password: password)
            user = result.user
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
            throw error
        }

        isLoading = false
    }

    func signOut() throws {
        try Auth.auth().signOut()
        user = nil
        isAuthenticated = false
    }

    func resetPassword(email: String) async throws {
        try await Auth.auth().sendPasswordReset(withEmail: email)
    }

    // MARK: - Apple Sign In

    func signInWithApple(credential: ASAuthorizationAppleIDCredential, nonce: String) async throws {
        isLoading = true
        errorMessage = nil

        guard let appleIDToken = credential.identityToken,
              let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
            throw AuthError.invalidCredential
        }

        let firebaseCredential = OAuthProvider.appleCredential(
            withIDToken: idTokenString,
            rawNonce: nonce,
            fullName: credential.fullName
        )

        do {
            let result = try await Auth.auth().signIn(with: firebaseCredential)
            user = result.user
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
            throw error
        }

        isLoading = false
    }

    // MARK: - Anonymous Auth (for testing without account)

    func signInAnonymously() async throws {
        isLoading = true

        do {
            let result = try await Auth.auth().signInAnonymously()
            user = result.user
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
            throw error
        }

        isLoading = false
    }

    var currentUserId: String? {
        user?.uid
    }
}

enum AuthError: LocalizedError {
    case invalidCredential
    case userNotFound

    var errorDescription: String? {
        switch self {
        case .invalidCredential:
            return "Invalid credential"
        case .userNotFound:
            return "User not found"
        }
    }
}

// MARK: - Apple Sign In Helpers

func randomNonceString(length: Int = 32) -> String {
    precondition(length > 0)
    var randomBytes = [UInt8](repeating: 0, count: length)
    let errorCode = SecRandomCopyBytes(kSecRandomDefault, randomBytes.count, &randomBytes)
    if errorCode != errSecSuccess {
        fatalError("Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)")
    }

    let charset: [Character] = Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
    let nonce = randomBytes.map { byte in
        charset[Int(byte) % charset.count]
    }
    return String(nonce)
}

import CryptoKit

func sha256(_ input: String) -> String {
    let inputData = Data(input.utf8)
    let hashedData = SHA256.hash(data: inputData)
    let hashString = hashedData.compactMap {
        String(format: "%02x", $0)
    }.joined()
    return hashString
}
