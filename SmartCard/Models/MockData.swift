import Foundation

struct MockData {
    // Popular US Credit Cards with accurate reward structures
    static let creditCards: [CreditCard] = [
        // Chase Sapphire Preferred
        CreditCard(
            id: "chase-sapphire-preferred",
            name: "Chase Sapphire Preferred",
            issuer: "Chase",
            network: .visa,
            annualFee: 95,
            rewardType: .points,
            baseReward: 1,
            baseIsPercentage: false,
            categoryRewards: [
                CategoryReward(category: .dining, multiplier: 3, isPercentage: false, cap: nil, capPeriod: nil),
                CategoryReward(category: .streaming, multiplier: 3, isPercentage: false, cap: nil, capPeriod: nil),
                CategoryReward(category: .onlineShopping, multiplier: 3, isPercentage: false, cap: nil, capPeriod: nil),
                CategoryReward(category: .travel, multiplier: 5, isPercentage: false, cap: nil, capPeriod: nil),
            ],
            rotatingCategories: nil,
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 60000,
                bonusType: .points,
                spendRequirement: 4000,
                timeframeDays: 90,
                description: "60,000 points after $4,000 in 3 months"
            ),
            imageColor: "#1A1F71",
            lastUpdated: Date()
        ),

        // Chase Freedom Flex (Rotating Categories)
        CreditCard(
            id: "chase-freedom-flex",
            name: "Chase Freedom Flex",
            issuer: "Chase",
            network: .mastercard,
            annualFee: 0,
            rewardType: .points,
            baseReward: 1,
            baseIsPercentage: false,
            categoryRewards: [
                CategoryReward(category: .dining, multiplier: 3, isPercentage: false, cap: nil, capPeriod: nil),
                CategoryReward(category: .drugstore, multiplier: 3, isPercentage: false, cap: nil, capPeriod: nil),
                CategoryReward(category: .travel, multiplier: 5, isPercentage: false, cap: nil, capPeriod: nil),
            ],
            rotatingCategories: [
                // 2025 Q1 - Grocery
                RotatingCategory(quarter: 1, year: 2025, categories: [.grocery], multiplier: 5, isPercentage: false, cap: 1500, activationRequired: true),
                // 2025 Q2 - Gas & Home Improvement
                RotatingCategory(quarter: 2, year: 2025, categories: [.gas, .homeImprovement], multiplier: 5, isPercentage: false, cap: 1500, activationRequired: true),
                // 2025 Q3 - Dining & Drugstore
                RotatingCategory(quarter: 3, year: 2025, categories: [.dining, .drugstore], multiplier: 5, isPercentage: false, cap: 1500, activationRequired: true),
                // 2025 Q4 - Walmart, PayPal, Amazon
                RotatingCategory(quarter: 4, year: 2025, categories: [.amazon, .paypal, .wholesale], multiplier: 5, isPercentage: false, cap: 1500, activationRequired: true),
            ],
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 20000,
                bonusType: .points,
                spendRequirement: 500,
                timeframeDays: 90,
                description: "20,000 points after $500 in 3 months"
            ),
            imageColor: "#0066B2",
            lastUpdated: Date()
        ),

        // Amex Gold
        CreditCard(
            id: "amex-gold",
            name: "American Express Gold",
            issuer: "American Express",
            network: .amex,
            annualFee: 250,
            rewardType: .points,
            baseReward: 1,
            baseIsPercentage: false,
            categoryRewards: [
                CategoryReward(category: .dining, multiplier: 4, isPercentage: false, cap: nil, capPeriod: nil),
                CategoryReward(category: .grocery, multiplier: 4, isPercentage: false, cap: 25000, capPeriod: .yearly),
            ],
            rotatingCategories: nil,
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 60000,
                bonusType: .points,
                spendRequirement: 6000,
                timeframeDays: 180,
                description: "60,000 points after $6,000 in 6 months"
            ),
            imageColor: "#B4975A",
            lastUpdated: Date()
        ),

        // Amex Blue Cash Preferred
        CreditCard(
            id: "amex-blue-cash-preferred",
            name: "Blue Cash Preferred",
            issuer: "American Express",
            network: .amex,
            annualFee: 95,
            rewardType: .cashback,
            baseReward: 1,
            baseIsPercentage: true,
            categoryRewards: [
                CategoryReward(category: .grocery, multiplier: 6, isPercentage: true, cap: 6000, capPeriod: .yearly),
                CategoryReward(category: .streaming, multiplier: 6, isPercentage: true, cap: nil, capPeriod: nil),
                CategoryReward(category: .transit, multiplier: 3, isPercentage: true, cap: nil, capPeriod: nil),
                CategoryReward(category: .gas, multiplier: 3, isPercentage: true, cap: nil, capPeriod: nil),
            ],
            rotatingCategories: nil,
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 350,
                bonusType: .cashback,
                spendRequirement: 3000,
                timeframeDays: 180,
                description: "$350 back after $3,000 in 6 months"
            ),
            imageColor: "#006FCF",
            lastUpdated: Date()
        ),

        // Citi Double Cash
        CreditCard(
            id: "citi-double-cash",
            name: "Citi Double Cash",
            issuer: "Citi",
            network: .mastercard,
            annualFee: 0,
            rewardType: .cashback,
            baseReward: 2,
            baseIsPercentage: true,
            categoryRewards: [],
            rotatingCategories: nil,
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 200,
                bonusType: .cashback,
                spendRequirement: 1500,
                timeframeDays: 180,
                description: "$200 back after $1,500 in 6 months"
            ),
            imageColor: "#003B70",
            lastUpdated: Date()
        ),

        // Capital One Savor
        CreditCard(
            id: "capital-one-savor",
            name: "Capital One Savor",
            issuer: "Capital One",
            network: .mastercard,
            annualFee: 95,
            rewardType: .cashback,
            baseReward: 1,
            baseIsPercentage: true,
            categoryRewards: [
                CategoryReward(category: .dining, multiplier: 4, isPercentage: true, cap: nil, capPeriod: nil),
                CategoryReward(category: .entertainment, multiplier: 4, isPercentage: true, cap: nil, capPeriod: nil),
                CategoryReward(category: .streaming, multiplier: 4, isPercentage: true, cap: nil, capPeriod: nil),
                CategoryReward(category: .grocery, multiplier: 3, isPercentage: true, cap: nil, capPeriod: nil),
            ],
            rotatingCategories: nil,
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 300,
                bonusType: .cashback,
                spendRequirement: 3000,
                timeframeDays: 90,
                description: "$300 back after $3,000 in 3 months"
            ),
            imageColor: "#D03027",
            lastUpdated: Date()
        ),

        // Discover it (Rotating Categories)
        CreditCard(
            id: "discover-it",
            name: "Discover it Cash Back",
            issuer: "Discover",
            network: .discover,
            annualFee: 0,
            rewardType: .cashback,
            baseReward: 1,
            baseIsPercentage: true,
            categoryRewards: [],
            rotatingCategories: [
                // 2025 Q1 - Grocery & Walgreens
                RotatingCategory(quarter: 1, year: 2025, categories: [.grocery, .drugstore], multiplier: 5, isPercentage: true, cap: 1500, activationRequired: true),
                // 2025 Q2 - Gas & Home Improvement
                RotatingCategory(quarter: 2, year: 2025, categories: [.gas, .homeImprovement], multiplier: 5, isPercentage: true, cap: 1500, activationRequired: true),
                // 2025 Q3 - Restaurants & PayPal
                RotatingCategory(quarter: 3, year: 2025, categories: [.dining, .paypal], multiplier: 5, isPercentage: true, cap: 1500, activationRequired: true),
                // 2025 Q4 - Amazon, Target, Walmart
                RotatingCategory(quarter: 4, year: 2025, categories: [.amazon, .onlineShopping], multiplier: 5, isPercentage: true, cap: 1500, activationRequired: true),
            ],
            selectableConfig: nil,
            signUpBonus: nil, // Discover offers Cashback Match instead
            imageColor: "#FF6600",
            lastUpdated: Date()
        ),

        // Bank of America Customized Cash (Selectable Category)
        CreditCard(
            id: "boa-customized-cash",
            name: "Bank of America Customized Cash",
            issuer: "Bank of America",
            network: .visa,
            annualFee: 0,
            rewardType: .cashback,
            baseReward: 1,
            baseIsPercentage: true,
            categoryRewards: [
                CategoryReward(category: .grocery, multiplier: 2, isPercentage: true, cap: nil, capPeriod: nil),
                CategoryReward(category: .wholesale, multiplier: 2, isPercentage: true, cap: nil, capPeriod: nil),
            ],
            rotatingCategories: nil,
            selectableConfig: SelectableConfig(
                maxSelections: 1,
                availableCategories: [.gas, .onlineShopping, .dining, .travel, .drugstore, .homeImprovement],
                multiplier: 3,
                isPercentage: true,
                cap: 2500,
                capPeriod: .quarterly
            ),
            signUpBonus: SignUpBonus(
                bonusAmount: 200,
                bonusType: .cashback,
                spendRequirement: 1000,
                timeframeDays: 90,
                description: "$200 back after $1,000 in 90 days"
            ),
            imageColor: "#E31837",
            lastUpdated: Date()
        ),

        // US Bank Cash+  (Selectable Categories)
        CreditCard(
            id: "us-bank-cash-plus",
            name: "US Bank Cash+",
            issuer: "US Bank",
            network: .visa,
            annualFee: 0,
            rewardType: .cashback,
            baseReward: 1,
            baseIsPercentage: true,
            categoryRewards: [],
            rotatingCategories: nil,
            selectableConfig: SelectableConfig(
                maxSelections: 2,
                availableCategories: [.gas, .grocery, .dining, .utilities, .streaming, .transit, .homeImprovement],
                multiplier: 5,
                isPercentage: true,
                cap: 2000,
                capPeriod: .quarterly
            ),
            signUpBonus: SignUpBonus(
                bonusAmount: 200,
                bonusType: .cashback,
                spendRequirement: 1000,
                timeframeDays: 120,
                description: "$200 back after $1,000 in 120 days"
            ),
            imageColor: "#0C2340",
            lastUpdated: Date()
        ),

        // Wells Fargo Active Cash
        CreditCard(
            id: "wells-fargo-active-cash",
            name: "Wells Fargo Active Cash",
            issuer: "Wells Fargo",
            network: .visa,
            annualFee: 0,
            rewardType: .cashback,
            baseReward: 2,
            baseIsPercentage: true,
            categoryRewards: [],
            rotatingCategories: nil,
            selectableConfig: nil,
            signUpBonus: SignUpBonus(
                bonusAmount: 200,
                bonusType: .cashback,
                spendRequirement: 500,
                timeframeDays: 90,
                description: "$200 back after $500 in 3 months"
            ),
            imageColor: "#D71E28",
            lastUpdated: Date()
        ),
    ]

    // Sample user wallet
    static let sampleUserCards: [UserCard] = [
        UserCard(card: creditCards[0], nickname: "Travel Card"),  // CSP
        UserCard(card: creditCards[1], nickname: nil),            // Freedom Flex
        UserCard(card: creditCards[2], nickname: "Dining Card"),  // Amex Gold
        UserCard(card: creditCards[4], nickname: "Everyday"),     // Double Cash
    ]

    // Sample spending records
    static let sampleSpendings: [Spending] = [
        Spending(amount: 45.32, merchant: "Whole Foods", category: .grocery, cardUsed: "amex-gold", date: Date().addingTimeInterval(-86400), rewardEarned: 1.81),
        Spending(amount: 28.50, merchant: "Chipotle", category: .dining, cardUsed: "amex-gold", date: Date().addingTimeInterval(-172800), rewardEarned: 1.14),
        Spending(amount: 52.00, merchant: "Shell", category: .gas, cardUsed: "chase-freedom-flex", date: Date().addingTimeInterval(-259200), rewardEarned: 2.60),
        Spending(amount: 15.99, merchant: "Netflix", category: .streaming, cardUsed: "chase-sapphire-preferred", date: Date().addingTimeInterval(-345600), rewardEarned: 0.48),
    ]

    static func getCard(byId id: String) -> CreditCard? {
        creditCards.first { $0.id == id }
    }
}
