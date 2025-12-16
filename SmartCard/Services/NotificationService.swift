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

    // MARK: - Rotating Category Reminders

    func scheduleQuarterlyActivationReminder(cardName: String, categories: [String], quarter: Int) {
        let content = UNMutableNotificationContent()
        content.title = "Activate Q\(quarter) Categories"
        content.body = "\(cardName): \(categories.joined(separator: ", ")) - Don't forget to activate!"
        content.sound = .default

        // Schedule for first day of quarter at 9 AM
        var dateComponents = DateComponents()
        dateComponents.month = (quarter - 1) * 3 + 1  // Q1=1, Q2=4, Q3=7, Q4=10
        dateComponents.day = 1
        dateComponents.hour = 9

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(
            identifier: "rotating-\(cardName)-Q\(quarter)",
            content: content,
            trigger: trigger
        )

        UNUserNotificationCenter.current().add(request)
    }

    func scheduleActivationReminder(for card: CreditCard, userCard: UserCard) {
        guard let rotating = card.rotatingCategories else { return }

        let currentQ = RotatingCategory.currentQuarter()
        let currentY = RotatingCategory.currentYear()

        guard let currentRotating = rotating.first(where: { $0.quarter == currentQ && $0.year == currentY }),
              currentRotating.activationRequired else {
            return
        }

        let quarterId = "\(currentY)-Q\(currentQ)"
        let isActivated = userCard.activatedQuarters?.contains(quarterId) ?? false

        if !isActivated {
            // Send immediate reminder
            let content = UNMutableNotificationContent()
            content.title = "Activate Your 5% Categories"
            content.body = "\(card.name): \(currentRotating.categories.map { $0.rawValue }.joined(separator: ", "))"
            content.sound = .default

            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
            let request = UNNotificationRequest(
                identifier: "activate-now-\(card.id)",
                content: content,
                trigger: trigger
            )

            UNUserNotificationCenter.current().add(request)
        }
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
