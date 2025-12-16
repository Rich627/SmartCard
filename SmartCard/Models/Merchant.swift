import Foundation

struct Merchant: Identifiable, Codable, Equatable {
    let id: String
    let name: String
    let category: SpendingCategory
    let alternativeCategories: [SpendingCategory]?
    let keywords: [String]?       // for search matching

    init(name: String, category: SpendingCategory, alternativeCategories: [SpendingCategory]? = nil, keywords: [String]? = nil) {
        self.id = UUID().uuidString
        self.name = name
        self.category = category
        self.alternativeCategories = alternativeCategories
        self.keywords = keywords
    }
}

// Common merchant database
struct MerchantDatabase {
    static let merchants: [Merchant] = [
        // Grocery
        Merchant(name: "Walmart", category: .grocery, alternativeCategories: [.other], keywords: ["walmart", "wal-mart"]),
        Merchant(name: "Target", category: .grocery, alternativeCategories: [.other], keywords: ["target"]),
        Merchant(name: "Costco", category: .wholesale, keywords: ["costco"]),
        Merchant(name: "Sam's Club", category: .wholesale, keywords: ["sams", "sam's"]),
        Merchant(name: "BJ's Wholesale", category: .wholesale, keywords: ["bj's", "bjs"]),
        Merchant(name: "Kroger", category: .grocery, keywords: ["kroger"]),
        Merchant(name: "Whole Foods", category: .grocery, keywords: ["whole foods", "wholefoods"]),
        Merchant(name: "Trader Joe's", category: .grocery, keywords: ["trader joe", "trader joes"]),
        Merchant(name: "Safeway", category: .grocery, keywords: ["safeway"]),
        Merchant(name: "Publix", category: .grocery, keywords: ["publix"]),
        Merchant(name: "Albertsons", category: .grocery, keywords: ["albertsons"]),
        Merchant(name: "Aldi", category: .grocery, keywords: ["aldi"]),
        Merchant(name: "H-E-B", category: .grocery, keywords: ["heb", "h-e-b"]),
        Merchant(name: "Wegmans", category: .grocery, keywords: ["wegmans"]),
        Merchant(name: "Food Lion", category: .grocery, keywords: ["food lion"]),
        Merchant(name: "Sprouts", category: .grocery, keywords: ["sprouts"]),
        Merchant(name: "Vons", category: .grocery, keywords: ["vons"]),
        Merchant(name: "Harris Teeter", category: .grocery, keywords: ["harris teeter"]),
        Merchant(name: "Giant", category: .grocery, keywords: ["giant"]),
        Merchant(name: "Stop & Shop", category: .grocery, keywords: ["stop & shop", "stop and shop"]),
        Merchant(name: "Meijer", category: .grocery, keywords: ["meijer"]),
        Merchant(name: "Instacart", category: .grocery, keywords: ["instacart"]),

        // Gas
        Merchant(name: "Shell", category: .gas, keywords: ["shell"]),
        Merchant(name: "Chevron", category: .gas, keywords: ["chevron"]),
        Merchant(name: "ExxonMobil", category: .gas, keywords: ["exxon", "mobil"]),
        Merchant(name: "BP", category: .gas, keywords: ["bp"]),
        Merchant(name: "Costco Gas", category: .gas, keywords: ["costco gas"]),
        Merchant(name: "76", category: .gas, keywords: ["76 gas"]),
        Merchant(name: "Arco", category: .gas, keywords: ["arco"]),
        Merchant(name: "Sunoco", category: .gas, keywords: ["sunoco"]),
        Merchant(name: "Marathon", category: .gas, keywords: ["marathon"]),
        Merchant(name: "Wawa", category: .gas, keywords: ["wawa"]),
        Merchant(name: "Sheetz", category: .gas, keywords: ["sheetz"]),
        Merchant(name: "QuikTrip", category: .gas, keywords: ["quiktrip", "qt"]),
        Merchant(name: "Circle K", category: .gas, keywords: ["circle k"]),
        Merchant(name: "7-Eleven", category: .gas, keywords: ["7-eleven", "7 eleven"]),
        Merchant(name: "GetGo", category: .gas, keywords: ["getgo"]),
        Merchant(name: "Speedway", category: .gas, keywords: ["speedway"]),
        Merchant(name: "ChargePoint", category: .gas, keywords: ["chargepoint", "ev charging"]),
        Merchant(name: "Tesla Supercharger", category: .gas, keywords: ["tesla", "supercharger"]),
        Merchant(name: "Electrify America", category: .gas, keywords: ["electrify america"]),

        // Dining - Fast Food
        Merchant(name: "Starbucks", category: .dining, keywords: ["starbucks"]),
        Merchant(name: "McDonald's", category: .dining, keywords: ["mcdonalds", "mcdonald's"]),
        Merchant(name: "Chipotle", category: .dining, keywords: ["chipotle"]),
        Merchant(name: "Chick-fil-A", category: .dining, keywords: ["chick-fil-a", "chickfila"]),
        Merchant(name: "Wendy's", category: .dining, keywords: ["wendys", "wendy's"]),
        Merchant(name: "Burger King", category: .dining, keywords: ["burger king"]),
        Merchant(name: "Taco Bell", category: .dining, keywords: ["taco bell"]),
        Merchant(name: "Subway", category: .dining, keywords: ["subway"]),
        Merchant(name: "Panda Express", category: .dining, keywords: ["panda express"]),
        Merchant(name: "Five Guys", category: .dining, keywords: ["five guys"]),
        Merchant(name: "In-N-Out", category: .dining, keywords: ["in-n-out", "in n out"]),
        Merchant(name: "Shake Shack", category: .dining, keywords: ["shake shack"]),
        Merchant(name: "Popeyes", category: .dining, keywords: ["popeyes"]),
        Merchant(name: "KFC", category: .dining, keywords: ["kfc", "kentucky fried"]),
        Merchant(name: "Dunkin'", category: .dining, keywords: ["dunkin", "dunkin donuts"]),
        Merchant(name: "Panera Bread", category: .dining, keywords: ["panera"]),
        Merchant(name: "Domino's", category: .dining, keywords: ["dominos", "domino's"]),
        Merchant(name: "Pizza Hut", category: .dining, keywords: ["pizza hut"]),
        Merchant(name: "Papa John's", category: .dining, keywords: ["papa johns", "papa john's"]),
        Merchant(name: "Sonic", category: .dining, keywords: ["sonic"]),
        Merchant(name: "Arby's", category: .dining, keywords: ["arbys", "arby's"]),
        Merchant(name: "Jack in the Box", category: .dining, keywords: ["jack in the box"]),
        Merchant(name: "Whataburger", category: .dining, keywords: ["whataburger"]),
        Merchant(name: "Wingstop", category: .dining, keywords: ["wingstop"]),
        Merchant(name: "Buffalo Wild Wings", category: .dining, keywords: ["buffalo wild wings", "bww"]),

        // Dining - Casual/Sit-down
        Merchant(name: "Applebee's", category: .dining, keywords: ["applebees", "applebee's"]),
        Merchant(name: "Chili's", category: .dining, keywords: ["chilis", "chili's"]),
        Merchant(name: "Olive Garden", category: .dining, keywords: ["olive garden"]),
        Merchant(name: "Red Lobster", category: .dining, keywords: ["red lobster"]),
        Merchant(name: "Outback Steakhouse", category: .dining, keywords: ["outback"]),
        Merchant(name: "Texas Roadhouse", category: .dining, keywords: ["texas roadhouse"]),
        Merchant(name: "Cheesecake Factory", category: .dining, keywords: ["cheesecake factory"]),
        Merchant(name: "TGI Friday's", category: .dining, keywords: ["tgi fridays", "fridays"]),
        Merchant(name: "IHOP", category: .dining, keywords: ["ihop"]),
        Merchant(name: "Denny's", category: .dining, keywords: ["dennys", "denny's"]),
        Merchant(name: "Cracker Barrel", category: .dining, keywords: ["cracker barrel"]),
        Merchant(name: "P.F. Chang's", category: .dining, keywords: ["pf changs", "p.f. chang's"]),

        // Dining - Delivery
        Merchant(name: "DoorDash", category: .dining, keywords: ["doordash"]),
        Merchant(name: "Uber Eats", category: .dining, keywords: ["uber eats", "ubereats"]),
        Merchant(name: "Grubhub", category: .dining, keywords: ["grubhub"]),
        Merchant(name: "Postmates", category: .dining, keywords: ["postmates"]),
        Merchant(name: "Instacart", category: .grocery, keywords: ["instacart"]),
        Merchant(name: "Seamless", category: .dining, keywords: ["seamless"]),
        Merchant(name: "Caviar", category: .dining, keywords: ["caviar"]),

        // Streaming
        Merchant(name: "Netflix", category: .streaming, keywords: ["netflix"]),
        Merchant(name: "Spotify", category: .streaming, keywords: ["spotify"]),
        Merchant(name: "Disney+", category: .streaming, keywords: ["disney+", "disney plus"]),
        Merchant(name: "HBO Max", category: .streaming, keywords: ["hbo", "max"]),
        Merchant(name: "YouTube Premium", category: .streaming, keywords: ["youtube"]),
        Merchant(name: "Apple TV+", category: .streaming, keywords: ["apple tv"]),
        Merchant(name: "Amazon Prime Video", category: .streaming, keywords: ["prime video"]),
        Merchant(name: "Hulu", category: .streaming, keywords: ["hulu"]),
        Merchant(name: "Peacock", category: .streaming, keywords: ["peacock"]),
        Merchant(name: "Paramount+", category: .streaming, keywords: ["paramount+"]),
        Merchant(name: "Apple Music", category: .streaming, keywords: ["apple music"]),
        Merchant(name: "Amazon Music", category: .streaming, keywords: ["amazon music"]),
        Merchant(name: "SiriusXM", category: .streaming, keywords: ["siriusxm", "sirius"]),
        Merchant(name: "Audible", category: .streaming, keywords: ["audible"]),
        Merchant(name: "Kindle Unlimited", category: .streaming, keywords: ["kindle unlimited"]),

        // Online Shopping
        Merchant(name: "Amazon", category: .amazon, alternativeCategories: [.onlineShopping], keywords: ["amazon"]),
        Merchant(name: "eBay", category: .onlineShopping, keywords: ["ebay"]),
        Merchant(name: "Etsy", category: .onlineShopping, keywords: ["etsy"]),
        Merchant(name: "Wayfair", category: .onlineShopping, keywords: ["wayfair"]),
        Merchant(name: "Newegg", category: .onlineShopping, keywords: ["newegg"]),
        Merchant(name: "Best Buy", category: .onlineShopping, keywords: ["best buy", "bestbuy"]),
        Merchant(name: "Apple Store", category: .onlineShopping, keywords: ["apple store", "apple.com"]),
        Merchant(name: "Nike", category: .onlineShopping, keywords: ["nike"]),
        Merchant(name: "Adidas", category: .onlineShopping, keywords: ["adidas"]),
        Merchant(name: "Zappos", category: .onlineShopping, keywords: ["zappos"]),
        Merchant(name: "Nordstrom", category: .onlineShopping, keywords: ["nordstrom"]),
        Merchant(name: "Macy's", category: .onlineShopping, keywords: ["macys", "macy's"]),
        Merchant(name: "Walmart.com", category: .onlineShopping, keywords: ["walmart.com"]),
        Merchant(name: "Target.com", category: .onlineShopping, keywords: ["target.com"]),
        Merchant(name: "SHEIN", category: .onlineShopping, keywords: ["shein"]),
        Merchant(name: "Temu", category: .onlineShopping, keywords: ["temu"]),
        Merchant(name: "AliExpress", category: .onlineShopping, keywords: ["aliexpress"]),

        // Travel - Airlines
        Merchant(name: "United Airlines", category: .travel, keywords: ["united"]),
        Merchant(name: "Delta", category: .travel, keywords: ["delta"]),
        Merchant(name: "American Airlines", category: .travel, keywords: ["american airlines", "aa"]),
        Merchant(name: "Southwest", category: .travel, keywords: ["southwest"]),
        Merchant(name: "JetBlue", category: .travel, keywords: ["jetblue"]),
        Merchant(name: "Alaska Airlines", category: .travel, keywords: ["alaska airlines"]),
        Merchant(name: "Spirit Airlines", category: .travel, keywords: ["spirit"]),
        Merchant(name: "Frontier Airlines", category: .travel, keywords: ["frontier"]),
        Merchant(name: "Hawaiian Airlines", category: .travel, keywords: ["hawaiian airlines"]),

        // Travel - Hotels
        Merchant(name: "Airbnb", category: .travel, keywords: ["airbnb"]),
        Merchant(name: "Marriott", category: .travel, keywords: ["marriott"]),
        Merchant(name: "Hilton", category: .travel, keywords: ["hilton"]),
        Merchant(name: "Hyatt", category: .travel, keywords: ["hyatt"]),
        Merchant(name: "IHG", category: .travel, keywords: ["ihg", "holiday inn"]),
        Merchant(name: "Best Western", category: .travel, keywords: ["best western"]),
        Merchant(name: "Wyndham", category: .travel, keywords: ["wyndham"]),
        Merchant(name: "VRBO", category: .travel, keywords: ["vrbo"]),
        Merchant(name: "Booking.com", category: .travel, keywords: ["booking.com", "booking"]),
        Merchant(name: "Expedia", category: .travel, keywords: ["expedia"]),
        Merchant(name: "Hotels.com", category: .travel, keywords: ["hotels.com"]),
        Merchant(name: "Priceline", category: .travel, keywords: ["priceline"]),
        Merchant(name: "Kayak", category: .travel, keywords: ["kayak"]),

        // Travel - Car Rental
        Merchant(name: "Enterprise", category: .travel, keywords: ["enterprise"]),
        Merchant(name: "Hertz", category: .travel, keywords: ["hertz"]),
        Merchant(name: "Avis", category: .travel, keywords: ["avis"]),
        Merchant(name: "Budget", category: .travel, keywords: ["budget"]),
        Merchant(name: "National", category: .travel, keywords: ["national car"]),
        Merchant(name: "Turo", category: .travel, keywords: ["turo"]),

        // Transit
        Merchant(name: "Uber", category: .transit, keywords: ["uber"]),
        Merchant(name: "Lyft", category: .transit, keywords: ["lyft"]),
        Merchant(name: "Metro", category: .transit, keywords: ["metro", "subway"]),
        Merchant(name: "BART", category: .transit, keywords: ["bart"]),
        Merchant(name: "MTA", category: .transit, keywords: ["mta"]),
        Merchant(name: "Amtrak", category: .transit, keywords: ["amtrak"]),
        Merchant(name: "Lime", category: .transit, keywords: ["lime scooter"]),
        Merchant(name: "Bird", category: .transit, keywords: ["bird scooter"]),

        // Drugstore
        Merchant(name: "CVS", category: .drugstore, keywords: ["cvs"]),
        Merchant(name: "Walgreens", category: .drugstore, keywords: ["walgreens"]),
        Merchant(name: "Rite Aid", category: .drugstore, keywords: ["rite aid"]),
        Merchant(name: "Duane Reade", category: .drugstore, keywords: ["duane reade"]),

        // Home Improvement
        Merchant(name: "Home Depot", category: .homeImprovement, keywords: ["home depot"]),
        Merchant(name: "Lowe's", category: .homeImprovement, keywords: ["lowes", "lowe's"]),
        Merchant(name: "Menards", category: .homeImprovement, keywords: ["menards"]),
        Merchant(name: "Ace Hardware", category: .homeImprovement, keywords: ["ace hardware"]),
        Merchant(name: "True Value", category: .homeImprovement, keywords: ["true value"]),

        // Entertainment
        Merchant(name: "AMC Theatres", category: .entertainment, keywords: ["amc"]),
        Merchant(name: "Regal Cinemas", category: .entertainment, keywords: ["regal"]),
        Merchant(name: "Cinemark", category: .entertainment, keywords: ["cinemark"]),
        Merchant(name: "Dave & Buster's", category: .entertainment, keywords: ["dave and busters", "dave & buster"]),
        Merchant(name: "Topgolf", category: .entertainment, keywords: ["topgolf"]),
        Merchant(name: "Six Flags", category: .entertainment, keywords: ["six flags"]),
        Merchant(name: "Universal Studios", category: .entertainment, keywords: ["universal studios"]),
        Merchant(name: "Disneyland", category: .entertainment, keywords: ["disneyland", "disney world"]),
        Merchant(name: "SeaWorld", category: .entertainment, keywords: ["seaworld"]),
        Merchant(name: "Ticketmaster", category: .entertainment, keywords: ["ticketmaster"]),
        Merchant(name: "StubHub", category: .entertainment, keywords: ["stubhub"]),
        Merchant(name: "Eventbrite", category: .entertainment, keywords: ["eventbrite"]),

        // PayPal
        Merchant(name: "PayPal", category: .paypal, keywords: ["paypal"]),
        Merchant(name: "Venmo", category: .paypal, keywords: ["venmo"]),

        // Utilities
        Merchant(name: "AT&T", category: .utilities, keywords: ["at&t", "att"]),
        Merchant(name: "Verizon", category: .utilities, keywords: ["verizon"]),
        Merchant(name: "T-Mobile", category: .utilities, keywords: ["t-mobile", "tmobile"]),
        Merchant(name: "Comcast", category: .utilities, keywords: ["comcast", "xfinity"]),
        Merchant(name: "Spectrum", category: .utilities, keywords: ["spectrum"]),
        Merchant(name: "Cox", category: .utilities, keywords: ["cox"]),

        // Fitness
        Merchant(name: "Planet Fitness", category: .other, keywords: ["planet fitness"]),
        Merchant(name: "LA Fitness", category: .other, keywords: ["la fitness"]),
        Merchant(name: "Equinox", category: .other, keywords: ["equinox"]),
        Merchant(name: "24 Hour Fitness", category: .other, keywords: ["24 hour fitness"]),
        Merchant(name: "Orangetheory", category: .other, keywords: ["orangetheory"]),
        Merchant(name: "CrossFit", category: .other, keywords: ["crossfit"]),
        Merchant(name: "Peloton", category: .other, keywords: ["peloton"]),

        // Pet Stores
        Merchant(name: "PetSmart", category: .other, keywords: ["petsmart"]),
        Merchant(name: "Petco", category: .other, keywords: ["petco"]),
        Merchant(name: "Chewy", category: .onlineShopping, keywords: ["chewy"]),
    ]

    static func findMerchant(query: String) -> Merchant? {
        let lowercased = query.lowercased()

        // Exact match first
        if let exact = merchants.first(where: { $0.name.lowercased() == lowercased }) {
            return exact
        }

        // Keyword match
        for merchant in merchants {
            if let keywords = merchant.keywords {
                for keyword in keywords {
                    if lowercased.contains(keyword) {
                        return merchant
                    }
                }
            }
        }

        // Partial name match
        if let partial = merchants.first(where: { $0.name.lowercased().contains(lowercased) || lowercased.contains($0.name.lowercased()) }) {
            return partial
        }

        return nil
    }

    static func suggestCategory(for query: String) -> SpendingCategory? {
        findMerchant(query: query)?.category
    }

    // Get matching merchants for autocomplete
    static func searchMerchants(query: String) -> [Merchant] {
        guard !query.isEmpty else { return [] }
        let lowercased = query.lowercased()

        return merchants.filter { merchant in
            // Match name
            if merchant.name.lowercased().contains(lowercased) {
                return true
            }
            // Match keywords
            if let keywords = merchant.keywords {
                for keyword in keywords {
                    if keyword.contains(lowercased) || lowercased.contains(keyword) {
                        return true
                    }
                }
            }
            return false
        }
    }
}

// MARK: - Lazy Initialized Keyword Index for Fast Lookups

private class MerchantIndex {
    static let shared = MerchantIndex()

    // Keyword to merchant mapping for O(1) lookup
    private(set) lazy var keywordIndex: [String: Merchant] = {
        var index: [String: Merchant] = [:]
        for merchant in MerchantDatabase.merchants {
            // Index by lowercase name
            index[merchant.name.lowercased()] = merchant

            // Index by keywords
            if let keywords = merchant.keywords {
                for keyword in keywords {
                    index[keyword.lowercased()] = merchant
                }
            }
        }
        return index
    }()

    // Prefix tree for fast prefix matching (simple implementation)
    private(set) lazy var merchantsByFirstLetter: [Character: [Merchant]] = {
        var byLetter: [Character: [Merchant]] = [:]
        for merchant in MerchantDatabase.merchants {
            let firstChar = merchant.name.lowercased().first ?? "a"
            if byLetter[firstChar] == nil {
                byLetter[firstChar] = []
            }
            byLetter[firstChar]?.append(merchant)
        }
        return byLetter
    }()

    /// Fast keyword lookup
    func findByKeyword(_ keyword: String) -> Merchant? {
        keywordIndex[keyword.lowercased()]
    }

    /// Get merchants starting with a specific character for faster filtering
    func merchantsStartingWith(_ char: Character) -> [Merchant] {
        merchantsByFirstLetter[char] ?? []
    }
}

// MARK: - Fast Lookup Extension

extension MerchantDatabase {
    /// Optimized lookup using pre-built index
    static func fastFindMerchant(query: String) -> Merchant? {
        let lowercased = query.lowercased()

        // Try exact keyword match first (O(1))
        if let merchant = MerchantIndex.shared.findByKeyword(lowercased) {
            return merchant
        }

        // Fall back to partial matching
        return findMerchant(query: query)
    }

    /// Optimized category suggestion using index
    static func fastSuggestCategory(for query: String) -> SpendingCategory? {
        fastFindMerchant(query: query)?.category
    }
}
