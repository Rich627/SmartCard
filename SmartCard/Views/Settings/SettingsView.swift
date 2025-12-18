import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var cardViewModel: CardViewModel
    @EnvironmentObject var spendingViewModel: SpendingViewModel
    @AppStorage("notificationsEnabled") private var notificationsEnabled = true
    @AppStorage("rotatingReminders") private var rotatingReminders = true
    @AppStorage("spendingCapAlerts") private var spendingCapAlerts = true
    @State private var showingPrivacyPolicy = false
    @State private var showingTermsOfService = false
    @State private var showingLinkBank = false
    @State private var showingClearDataAlert = false

    var body: some View {
        NavigationStack {
            List {
                // Bank Connection
                Section("Bank Connection") {
                    Button {
                        showingLinkBank = true
                    } label: {
                        HStack {
                            Label("Link Bank Account", systemImage: "building.columns")
                            Spacer()
                            Text("\(PlaidService.shared.linkedAccounts.count) linked")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundStyle(.secondary)
                    }

                    HStack {
                        Text("Cards in Database")
                        Spacer()
                        Text("\(cardViewModel.allCards.count)")
                            .foregroundStyle(.secondary)
                    }
                }

                Section("Notifications") {
                    Toggle("Enable Notifications", isOn: $notificationsEnabled)
                        .onChange(of: notificationsEnabled) { _, newValue in
                            if newValue {
                                NotificationService.shared.requestAuthorization { _ in }
                            }
                        }

                    Toggle("Rotating Category Reminders", isOn: $rotatingReminders)
                        .disabled(!notificationsEnabled)

                    Toggle("Spending Cap Alerts", isOn: $spendingCapAlerts)
                        .disabled(!notificationsEnabled)
                }

                Section("Your Data") {
                    HStack {
                        Text("Cards in Wallet")
                        Spacer()
                        Text("\(cardViewModel.userCards.count)")
                            .foregroundStyle(.secondary)
                    }

                    HStack {
                        Text("Spending Records")
                        Spacer()
                        Text("\(spendingViewModel.spendings.count)")
                            .foregroundStyle(.secondary)
                    }

                    HStack {
                        Text("Total Rewards Earned")
                        Spacer()
                        Text(formatCurrency(spendingViewModel.totalRewardsEarned))
                            .foregroundStyle(.green)
                    }
                }

                Section("Data Management") {
                    Button(role: .destructive) {
                        showingClearDataAlert = true
                    } label: {
                        Text("Clear All Data")
                    }
                }

                Section("Support") {
                    Link(destination: URL(string: "https://apps.apple.com")!) {
                        HStack {
                            Label("Rate on App Store", systemImage: "star")
                            Spacer()
                            Image(systemName: "arrow.up.right")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }

                    Button {
                        showingPrivacyPolicy = true
                    } label: {
                        Label("Privacy Policy", systemImage: "hand.raised")
                    }

                    Button {
                        showingTermsOfService = true
                    } label: {
                        Label("Terms of Service", systemImage: "doc.text")
                    }

                    Link(destination: URL(string: "mailto:support@smartcardapp.com")!) {
                        HStack {
                            Label("Contact Support", systemImage: "envelope")
                            Spacer()
                            Image(systemName: "arrow.up.right")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section {
                    VStack(spacing: 8) {
                        Text("SmartCard")
                            .font(.headline)
                        Text("Maximize your credit card rewards")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .listRowBackground(Color.clear)
                }
            }
            .navigationTitle("Settings")
            .sheet(isPresented: $showingPrivacyPolicy) {
                PrivacyPolicyView()
            }
            .sheet(isPresented: $showingTermsOfService) {
                TermsOfServiceView()
            }
            .sheet(isPresented: $showingLinkBank) {
                LinkBankView()
            }
            .alert("Clear All Data", isPresented: $showingClearDataAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Clear", role: .destructive) {
                    cardViewModel.clearAllData()
                    spendingViewModel.clearAllData()
                }
            } message: {
                Text("This will delete all your cards, spending records, and preferences. This action cannot be undone.")
            }
        }
    }

    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "USD"
        return formatter.string(from: NSNumber(value: value)) ?? "$0"
    }
}

#Preview {
    SettingsView()
        .environmentObject(CardViewModel())
        .environmentObject(SpendingViewModel())
}
