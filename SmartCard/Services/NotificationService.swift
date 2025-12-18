import Foundation
import UserNotifications

class NotificationService {
    static let shared = NotificationService()

    private init() {}

    // MARK: - Permission

    func requestPermission() async -> Bool {
        do {
            let granted = try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .badge, .sound])
            return granted
        } catch {
            print("Notification permission error: \(error)")
            return false
        }
    }

    func requestAuthorization(completion: @escaping (Bool) -> Void) {
        Task {
            let granted = await requestPermission()
            await MainActor.run {
                completion(granted)
            }
        }
    }

    func checkPermission() async -> UNAuthorizationStatus {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        return settings.authorizationStatus
    }

    // MARK: - Spending Cap Reminders

    func scheduleSpendingCapAlert(cardName: String, category: String, currentSpend: Double, cap: Double) {
        let percentage = (currentSpend / cap) * 100

        // Alert at 80% and 100%
        guard percentage >= 80 else { return }

        let content = UNMutableNotificationContent()

        if percentage >= 100 {
            content.title = "Spending Cap Reached!"
            content.body = "\(cardName) \(category): You've reached your $\(Int(cap)) cap. Rewards now at base rate."
        } else {
            content.title = "Approaching Spending Cap"
            content.body = "\(cardName) \(category): \(Int(percentage))% of $\(Int(cap)) cap used."
        }

        content.sound = .default

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(
            identifier: "cap-\(cardName)-\(category)-\(Int(percentage))",
            content: content,
            trigger: trigger
        )

        UNUserNotificationCenter.current().add(request)
    }

    // MARK: - Clear Notifications

    func clearAllNotifications() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
    }

    func clearNotification(identifier: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [identifier])
    }
}
