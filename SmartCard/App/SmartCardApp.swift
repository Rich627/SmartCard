import SwiftUI
import WidgetKit
import FirebaseCore

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}

@main
struct SmartCardApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    @StateObject private var cardViewModel = CardViewModel()
    @StateObject private var spendingViewModel = SpendingViewModel()
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            if hasCompletedOnboarding {
                MainTabView()
                    .environmentObject(cardViewModel)
                    .environmentObject(spendingViewModel)
                    .onChange(of: scenePhase) { _, newPhase in
                        if newPhase == .background {
                            updateWidgetData()
                        }
                    }
                    .onAppear {
                        updateWidgetData()
                    }
            } else {
                OnboardingView(hasCompletedOnboarding: $hasCompletedOnboarding)
                    .environmentObject(cardViewModel)
                    .environmentObject(spendingViewModel)
            }

            // Uncomment when Firebase Auth is configured:
            // if authService.isAuthenticated {
            //     MainTabView()
            //         .environmentObject(authService)
            //         .environmentObject(cardViewModel)
            //         .environmentObject(spendingViewModel)
            // } else {
            //     AuthView()
            //         .environmentObject(authService)
            // }
        }
    }

    private func updateWidgetData() {
        WidgetDataManager.shared.updateWidgetData(
            cardViewModel: cardViewModel,
            spendingViewModel: spendingViewModel
        )
    }
}
