// ----- SET A: Fear vs Opportunity - 6 Rounds, 6 Asset Classes -----
const ROUNDS_DATA = [
    { 
        year: "2008", 
        label: "Global financial crisis",
        newsSignal: [
            "Emergency policy support is discussed",
            "Investors rush toward defensive assets",
            "Confidence in major institutions weakens"
        ],
        returns: { 
            "US EQ": -37.0, 
            "Europe EQ": -45.0, 
            "China EQ": -65.4, 
            "Global Bonds": 5.2, 
            "Gold": 5.5, 
            "Cash": 1.4 
        },
        bestPerformance: "Gold",
        worstPerformance: "China EQ",
        bestNews: "Demand rises for stores of value and high-quality defensive assets.",
        worstNews: "Highly cyclical and leveraged equity markets face severe pressure as liquidity disappears.",
        bestPerformanceNews: "Gold strengthens as investors seek protection from systemic stress and currency uncertainty.",
        worstPerformanceNews: "Chinese equities suffer the deepest losses as global demand collapses and risk capital retreats."
    },

    { 
        year: "2017", 
        label: "Growth optimism",
        newsSignal: [
            "Global economic data improves",
            "Equity valuations continue climbing",
            "Some investors warn of complacency"
        ],
        returns: { 
            "US EQ": 21.8, 
            "Europe EQ": 25.0, 
            "China EQ": 54.1, 
            "Global Bonds": 7.4, 
            "Gold": 13.7, 
            "Cash": 0.8 
        },
        bestPerformance: "China EQ",
        worstPerformance: "Cash",
        bestNews: "Improving trade and domestic consumption support Chinese markets.",
        worstNews: "Cash may lag significantly if synchronised growth sustains risk appetite.",
        bestPerformanceNews: "Chinese equities rally as technology, consumer growth and global trade attract capital.",
        worstPerformanceNews: "Cash returns remain low while equities benefit from broad earnings growth."
    },

    { 
        year: "2020", 
        label: "Pandemic shock",
        newsSignal: [
            "A global health crisis disrupts production and travel",
            "Governments prepare extraordinary support",
            "Markets struggle to assess long-term impact"
        ],
        returns: { 
            "US EQ": 18.4, 
            "Europe EQ": 5.0, 
            "China EQ": 29.5, 
            "Global Bonds": 9.2, 
            "Gold": 24.6, 
            "Cash": 0.6 
        },
        bestPerformance: "China EQ",
        worstPerformance: "Cash",
        bestNews: "Digital demand and strong policy support may benefit Chinese growth markets.",
        worstNews: "Cash preserves capital but could lag if stimulus drives a rapid recovery.",
        bestPerformanceNews: "Chinese equities outperform as earlier reopening and digital activity support growth.",
        worstPerformanceNews: "Cash earns little as emergency rate cuts reduce yields and markets rebound."
    },

    { 
        year: "2012", 
        label: "Stabilisation",
        newsSignal: [
            "Central banks hint at additional support",
            "Investors cautiously re-enter risk assets",
            "Economic stability remains debated"
        ],
        returns: { 
            "US EQ": 16.0, 
            "Europe EQ": 19.0, 
            "China EQ": 14.3, 
            "Global Bonds": 4.2, 
            "Gold": 7.1, 
            "Cash": 0.1 
        },
        bestPerformance: "Europe EQ",
        worstPerformance: "Cash",
        bestNews: "Improving policy confidence and depressed valuations support European equities.",
        worstNews: "Very low cash yields create a high opportunity cost if risk assets recover.",
        bestPerformanceNews: "Europe equities rebound as policy action reduces systemic fears and valuations recover.",
        worstPerformanceNews: "Cash earns almost nothing while investors cautiously return to risk assets."
    },

    { 
        year: "2022", 
        label: "Inflation and tightening",
        newsSignal: [
            "Inflation repeatedly surprises policy makers",
            "Bond markets reprice interest-rate expectations",
            "Growth assets face valuation pressure"
        ],
        returns: { 
            "US EQ": -18.1, 
            "Europe EQ": -15.0, 
            "China EQ": -21.8, 
            "Global Bonds": -16.2, 
            "Gold": 0.4, 
            "Cash": 2.1 
        },
        bestPerformance: "Cash",
        worstPerformance: "China EQ",
        bestNews: "Higher short-term yields make cash a credible defensive allocation.",
        worstNews: "Chinese equities remain exposed to property stress and weaker growth.",
        bestPerformanceNews: "Cash becomes the best relative performer as rates rise and both stocks and bonds decline.",
        worstPerformanceNews: "Chinese equities fall amid property stress, restrictive conditions and weak momentum."
    },

    { 
        year: "2024", 
        label: "Momentum vs diversification",
        newsSignal: [
            "Innovation optimism expands further",
            "Markets question whether leadership is too concentrated",
            "Policy easing expectations rise"
        ],
        returns: { 
            "US EQ": 24.2, 
            "Europe EQ": 9.0, 
            "China EQ": 16.4, 
            "Global Bonds": 2.8, 
            "Gold": 27.4, 
            "Cash": 5.1 
        },
        bestPerformance: "Gold",
        worstPerformance: "Global Bonds",
        bestNews: "Gold may benefit from central-bank buying, geopolitical uncertainty and lower-rate expectations.",
        worstNews: "Global bonds could remain restrained if inflation proves sticky.",
        bestPerformanceNews: "Gold outperforms as official-sector purchases and geopolitical risk support demand.",
        worstPerformanceNews: "Global bonds produce modest returns as rate volatility and delayed easing limit gains."
    }
];
