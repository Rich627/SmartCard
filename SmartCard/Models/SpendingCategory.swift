import Foundation

enum SpendingCategory: String, CaseIterable, Codable, Identifiable {
    case dining = "Dining"
    case grocery = "Grocery"
    case gas = "Gas"
    case travel = "Travel"
    case streaming = "Streaming"
    case drugstore = "Drugstore"
    case homeImprovement = "Home Improvement"
    case entertainment = "Entertainment"
    case onlineShopping = "Online Shopping"
    case transit = "Transit"
    case utilities = "Utilities"
    case wholesale = "Wholesale Clubs"
    case paypal = "PayPal"
    case amazon = "Amazon"
    case fitness = "Fitness"
    case phone = "Phone/Internet"
    case internet = "Internet/Cable"
    case shipping = "Shipping"
    case advertising = "Advertising"
    case officeSupplies = "Office Supplies"
    case evCharging = "EV Charging"
    case apple = "Apple"
    case wholeFoods = "Whole Foods"
    case target = "Target"
    case walmart = "Walmart"
    case other = "Other"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .dining: return "fork.knife"
        case .grocery: return "cart.fill"
        case .gas: return "fuelpump.fill"
        case .travel: return "airplane"
        case .streaming: return "play.tv.fill"
        case .drugstore: return "pills.fill"
        case .homeImprovement: return "hammer.fill"
        case .entertainment: return "film.fill"
        case .onlineShopping: return "bag.fill"
        case .transit: return "bus.fill"
        case .utilities: return "bolt.fill"
        case .wholesale: return "building.2.fill"
        case .paypal: return "creditcard.fill"
        case .amazon: return "shippingbox.fill"
        case .fitness: return "figure.run"
        case .phone: return "iphone"
        case .internet: return "wifi"
        case .shipping: return "shippingbox"
        case .advertising: return "megaphone.fill"
        case .officeSupplies: return "pencil.and.ruler.fill"
        case .evCharging: return "bolt.car.fill"
        case .apple: return "apple.logo"
        case .wholeFoods: return "leaf.fill"
        case .target: return "target"
        case .walmart: return "cart.fill"
        case .other: return "ellipsis.circle.fill"
        }
    }
}

enum CapPeriod: String, Codable {
    case monthly = "Monthly"
    case quarterly = "Quarterly"
    case yearly = "Yearly"

    /// Returns the start date of the current period
    var startDate: Date {
        let calendar = Calendar.current
        let now = Date()

        switch self {
        case .monthly:
            return calendar.date(from: calendar.dateComponents([.year, .month], from: now)) ?? now
        case .quarterly:
            let month = calendar.component(.month, from: now)
            let quarterStartMonth = ((month - 1) / 3) * 3 + 1
            var components = calendar.dateComponents([.year], from: now)
            components.month = quarterStartMonth
            components.day = 1
            return calendar.date(from: components) ?? now
        case .yearly:
            return calendar.date(from: calendar.dateComponents([.year], from: now)) ?? now
        }
    }
}
