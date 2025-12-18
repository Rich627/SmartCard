import SwiftUI

struct CardListView: View {
    @EnvironmentObject var cardViewModel: CardViewModel
    @State private var showingAddCard = false
    @State private var selectedCard: UserCard?

    var body: some View {
        NavigationStack {
            List {
                ForEach(cardViewModel.userCards) { userCard in
                    if let card = cardViewModel.getCard(for: userCard) {
                        CardRow(userCard: userCard, card: card)
                            .onTapGesture {
                                selectedCard = userCard
                            }
                    }
                }
                .onDelete(perform: deleteCards)
            }
            .navigationTitle("My Cards")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingAddCard = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddCard) {
                AddCardView()
            }
            .sheet(item: $selectedCard) { userCard in
                if let card = cardViewModel.getCard(for: userCard) {
                    CardDetailView(userCard: userCard, card: card)
                }
            }
            .overlay {
                if cardViewModel.userCards.isEmpty {
                    ContentUnavailableView {
                        Label("No Cards", systemImage: "creditcard")
                    } description: {
                        Text("Add your credit cards to get started")
                    } actions: {
                        Button("Add Card") {
                            showingAddCard = true
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            }
        }
    }

    private func deleteCards(at offsets: IndexSet) {
        for index in offsets {
            cardViewModel.removeCard(cardViewModel.userCards[index])
        }
    }
}

struct CardRow: View {
    let userCard: UserCard
    let card: CreditCard

    var body: some View {
        HStack(spacing: 16) {
            // Card visual
            CardImageView(
                imageURL: card.imageURL,
                fallbackColor: card.imageColor,
                width: 60,
                height: 40,
                cornerRadius: 8
            )

            VStack(alignment: .leading, spacing: 4) {
                Text(userCard.nickname ?? card.name)
                    .font(.headline)
                Text(card.issuer)
                    .font(.caption)
                    .foregroundStyle(.secondary)

                // Show key benefits
                HStack(spacing: 8) {
                    if !card.categoryRewards.isEmpty {
                        let topReward = card.categoryRewards.max(by: { $0.multiplier < $1.multiplier })
                        if let reward = topReward {
                            Text("\(reward.displayMultiplier) \(reward.category.displayName)")
                                .font(.caption2)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.green.opacity(0.2))
                                .clipShape(Capsule())
                        }
                    }

                    if card.rotatingCategories != nil {
                        Text("Rotating")
                            .font(.caption2)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.orange.opacity(0.2))
                            .clipShape(Capsule())
                    }

                    if card.selectableConfig != nil {
                        Text("Selectable")
                            .font(.caption2)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.blue.opacity(0.2))
                            .clipShape(Capsule())
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 8)
    }
}

struct AddCardView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var cardViewModel: CardViewModel
    @State private var searchText = ""
    @State private var nickname = ""
    @State private var creditLimitText = ""
    @State private var selectedCard: CreditCard?

    var filteredCards: [CreditCard] {
        let available = cardViewModel.availableCardsToAdd
        if searchText.isEmpty {
            return available
        }
        return available.filter {
            $0.name.localizedCaseInsensitiveContains(searchText) ||
            $0.issuer.localizedCaseInsensitiveContains(searchText)
        }
    }

    var creditLimit: Double? {
        Double(creditLimitText)
    }

    var body: some View {
        NavigationStack {
            VStack {
                if selectedCard == nil {
                    // Card selection
                    List(filteredCards) { card in
                        Button {
                            selectedCard = card
                        } label: {
                            CardSelectionRow(card: card)
                        }
                        .buttonStyle(.plain)
                    }
                    .searchable(text: $searchText, prompt: "Search cards")
                } else if let card = selectedCard {
                    // Card settings input
                    Form {
                        Section {
                            CardSelectionRow(card: card)
                        }

                        Section("Nickname (Optional)") {
                            TextField("e.g., Travel Card", text: $nickname)
                        }

                        Section {
                            HStack {
                                Text("$")
                                TextField("Credit Limit", text: $creditLimitText)
                                    .keyboardType(.numberPad)
                            }
                        } header: {
                            Text("Credit Limit (Optional)")
                        } footer: {
                            Text("Enter your credit limit to track utilization on the dashboard")
                        }

                        Section {
                            Button("Add Card") {
                                cardViewModel.addCard(
                                    card,
                                    nickname: nickname.isEmpty ? nil : nickname,
                                    creditLimit: creditLimit
                                )
                                dismiss()
                            }
                            .frame(maxWidth: .infinity)
                        }
                    }
                }
            }
            .navigationTitle(selectedCard == nil ? "Add Card" : "Card Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    if selectedCard != nil {
                        Button("Back") {
                            selectedCard = nil
                            nickname = ""
                            creditLimitText = ""
                        }
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}

struct CardSelectionRow: View {
    let card: CreditCard

    var body: some View {
        HStack(spacing: 12) {
            CardImageView(
                imageURL: card.imageURL,
                fallbackColor: card.imageColor,
                width: 50,
                height: 32,
                cornerRadius: 6
            )

            VStack(alignment: .leading, spacing: 2) {
                Text(card.name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                Text("\(card.issuer) | \(card.annualFee == 0 ? "No AF" : "$\(Int(card.annualFee)) AF")")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Text(card.displayBaseReward)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}

struct CardDetailView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var cardViewModel: CardViewModel
    let userCard: UserCard
    let card: CreditCard
    @State private var nickname: String = ""
    @State private var creditLimitText: String = ""
    @State private var currentBalanceText: String = ""
    @State private var selectedCategories: Set<SpendingCategory> = []

    var body: some View {
        NavigationStack {
            Form {
                // Card Info
                Section {
                    HStack {
                        CardImageView(
                            imageURL: card.imageURL,
                            fallbackColor: card.imageColor,
                            width: 100,
                            height: 64,
                            cornerRadius: 12
                        )

                        VStack(alignment: .leading) {
                            Text(card.name)
                                .font(.headline)
                            Text("$\(Int(card.annualFee)) annual fee")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                // Nickname
                Section("Nickname") {
                    TextField("Nickname", text: $nickname)
                }

                // Credit Limit & Balance
                Section {
                    HStack {
                        Text("Credit Limit")
                        Spacer()
                        Text("$")
                        TextField("0", text: $creditLimitText)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 100)
                    }

                    HStack {
                        Text("Current Balance")
                        Spacer()
                        Text("$")
                        TextField("0", text: $currentBalanceText)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 100)
                    }

                    if let limit = Double(creditLimitText), let balance = Double(currentBalanceText), limit > 0 {
                        let utilization = (balance / limit) * 100
                        HStack {
                            Text("Utilization")
                            Spacer()
                            Text(String(format: "%.0f%%", utilization))
                                .foregroundStyle(utilization > 30 ? (utilization > 50 ? .red : .orange) : .green)
                                .fontWeight(.semibold)
                        }
                    }
                } header: {
                    Text("Credit Utilization")
                } footer: {
                    Text("Keep utilization under 30% for best credit score impact")
                }

                // Rewards
                Section("Reward Structure") {
                    HStack {
                        Text("Base Reward")
                        Spacer()
                        Text(card.displayBaseReward)
                            .foregroundStyle(.secondary)
                    }

                    ForEach(card.categoryRewards) { reward in
                        HStack {
                            Label(reward.category.displayName, systemImage: reward.category.icon)
                            Spacer()
                            VStack(alignment: .trailing) {
                                Text(reward.displayMultiplier)
                                    .foregroundStyle(.green)
                                if let cap = reward.cap {
                                    Text("Cap: $\(Int(cap))/\(reward.capPeriod?.displayName ?? "")")
                                        .font(.caption2)
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                    }
                }

                // Rotating Categories
                if let rotating = card.rotatingCategories {
                    Section("Rotating Categories") {
                        ForEach(rotating) { rot in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text("Q\(rot.quarter) \(rot.year)")
                                        .fontWeight(.medium)
                                    Spacer()
                                    Text(rot.displayMultiplier)
                                        .foregroundStyle(.green)
                                }
                                Text(rot.categories.map { $0.displayName }.joined(separator: ", "))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }

                // Selectable Categories
                if let config = card.selectableConfig {
                    Section("Select Your Category (\(config.maxSelections) max)") {
                        ForEach(config.availableCategories, id: \.self) { category in
                            HStack {
                                Label(category.displayName, systemImage: category.icon)

                                Spacer()

                                if selectedCategories.contains(category) {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundStyle(.green)
                                }
                            }
                            .contentShape(Rectangle())
                            .onTapGesture {
                                if selectedCategories.contains(category) {
                                    selectedCategories.remove(category)
                                } else if selectedCategories.count < config.maxSelections {
                                    selectedCategories.insert(category)
                                }
                            }
                        }

                        HStack {
                            Text("Selected category reward")
                            Spacer()
                            Text("\(Int(config.multiplier))\(config.isPercentage ? "%" : "x")")
                                .foregroundStyle(.green)
                        }

                        if let cap = config.cap {
                            HStack {
                                Text("Spending cap")
                                Spacer()
                                Text("$\(Int(cap))/\(config.capPeriod?.displayName ?? "")")
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                // Delete
                Section {
                    Button(role: .destructive) {
                        cardViewModel.removeCard(userCard)
                        dismiss()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Remove Card")
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Card Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        if nickname != (userCard.nickname ?? "") {
                            cardViewModel.updateNickname(for: userCard, nickname: nickname.isEmpty ? nil : nickname)
                        }
                        if !selectedCategories.isEmpty {
                            cardViewModel.updateSelectedCategories(for: userCard, categories: Array(selectedCategories))
                        }
                        // Save credit limit and balance
                        let newLimit = Double(creditLimitText)
                        let newBalance = Double(currentBalanceText)
                        cardViewModel.updateCreditLimit(for: userCard, limit: newLimit)
                        cardViewModel.updateBalance(for: userCard, balance: newBalance)
                        dismiss()
                    }
                }
            }
            .onAppear {
                nickname = userCard.nickname ?? ""
                if let limit = userCard.creditLimit {
                    creditLimitText = String(Int(limit))
                }
                if let balance = userCard.currentBalance {
                    currentBalanceText = String(format: "%.2f", balance)
                }
                if let selected = userCard.selectedCategories {
                    selectedCategories = Set(selected)
                }
            }
        }
    }
}

#Preview {
    CardListView()
        .environmentObject(CardViewModel())
        .environmentObject(SpendingViewModel())
}
