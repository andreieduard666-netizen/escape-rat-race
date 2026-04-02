// Assets - 15 different investment options
export const ASSETS = {
  // Beginner (FinIQ 0-15)
  savings: {
    id: 'savings', name: 'Savings Account', icon: '🏦',
    cost: 1000, monthlyIncome: { min: 3, max: 8 }, finIQRequired: 0,
    description: 'Low return but safe. Start here.', category: 'cash', volatility: 0.01
  },
  cd: {
    id: 'cd', name: 'Certificate of Deposit', icon: '📄',
    cost: 2000, monthlyIncome: { min: 8, max: 15 }, finIQRequired: 5,
    description: 'Locked savings with better rates.', category: 'cash', volatility: 0.01
  },
  bond: {
    id: 'bond', name: 'Government Bond', icon: '📜',
    cost: 3000, monthlyIncome: { min: 15, max: 30 }, finIQRequired: 10,
    description: 'Safe and steady. Low but guaranteed.', category: 'cash', volatility: 0.02
  },
  
  // Intermediate (FinIQ 15-30)
  onlineCourse: {
    id: 'onlineCourse', name: 'Online Course', icon: '💻',
    cost: 500, monthlyIncome: { min: 50, max: 200 }, finIQRequired: 10,
    description: 'Create once, sell forever.', category: 'digital', volatility: 0.2
  },
  reit: {
    id: 'reit', name: 'REIT', icon: '🏢',
    cost: 5000, monthlyIncome: { min: 30, max: 100 }, finIQRequired: 20,
    description: 'Real estate without buying property.', category: 'realestate', volatility: 0.12
  },
  indexFund: {
    id: 'indexFund', name: 'Index Fund', icon: '📊',
    cost: 2000, monthlyIncome: { min: 20, max: 80 }, finIQRequired: 15,
    description: 'Diversified stocks. Good long-term.', category: 'stocks', volatility: 0.15
  },
  dividendStocks: {
    id: 'dividendStocks', name: 'Dividend Stocks', icon: '💰',
    cost: 4000, monthlyIncome: { min: 25, max: 90 }, finIQRequired: 20,
    description: 'Stocks that pay you quarterly.', category: 'stocks', volatility: 0.15
  },
  onlineBusiness: {
    id: 'onlineBusiness', name: 'Online Business', icon: '🌐',
    cost: 3000, monthlyIncome: { min: 100, max: 400 }, finIQRequired: 20,
    description: 'Digital products, affiliate marketing.', category: 'business', volatility: 0.2
  },
  
  // Advanced (FinIQ 25-45)
  stocks: {
    id: 'stocks', name: 'Stock Portfolio', icon: '📈',
    cost: 5000, monthlyIncome: { min: 50, max: 300 }, finIQRequired: 25,
    description: 'Higher risk, higher reward.', category: 'stocks', volatility: 0.3
  },
  crypto: {
    id: 'crypto', name: 'Crypto Holdings', icon: '₿',
    cost: 1000, monthlyIncome: { min: -200, max: 500 }, finIQRequired: 30,
    description: 'Very volatile. Could moon or crash.', category: 'crypto', volatility: 0.6
  },
  vendingMachine: {
    id: 'vendingMachine', name: 'Vending Machines', icon: '🥤',
    cost: 5000, monthlyIncome: { min: 80, max: 250 }, finIQRequired: 25,
    description: 'Passive income from snacks.', category: 'business', volatility: 0.15
  },
  atmBusiness: {
    id: 'atmBusiness', name: 'ATM Business', icon: '🏧',
    cost: 8000, monthlyIncome: { min: 100, max: 350 }, finIQRequired: 30,
    description: 'Own ATMs, collect fees.', category: 'business', volatility: 0.15
  },
  
  // Expert (FinIQ 40+)
  rentalProperty: {
    id: 'rentalProperty', name: 'Rental Property', icon: '🏠',
    cost: 50000, monthlyIncome: { min: 400, max: 1000 }, finIQRequired: 40,
    description: 'Real estate. Big investment, steady income.', category: 'realestate', volatility: 0.1
  },
  laundromat: {
    id: 'laundromat', name: 'Laundromat', icon: '🧺',
    cost: 30000, monthlyIncome: { min: 300, max: 800 }, finIQRequired: 35,
    description: 'Semi-passive coin laundry business.', category: 'business', volatility: 0.12
  },
  storageUnits: {
    id: 'storageUnits', name: 'Storage Units', icon: '📦',
    cost: 25000, monthlyIncome: { min: 250, max: 600 }, finIQRequired: 35,
    description: 'People store stuff, you collect rent.', category: 'realestate', volatility: 0.1
  },
  franchise: {
    id: 'franchise', name: 'Franchise', icon: '🍔',
    cost: 100000, monthlyIncome: { min: 1500, max: 4000 }, finIQRequired: 60,
    description: 'Own a proven business model.', category: 'business', volatility: 0.15
  },
  appBusiness: {
    id: 'appBusiness', name: 'Mobile App', icon: '📱',
    cost: 10000, monthlyIncome: { min: 200, max: 1500 }, finIQRequired: 40,
    description: 'Build an app, earn from ads/premium.', category: 'digital', volatility: 0.3
  }
};

// Liabilities
export const LIABILITIES = {
  creditCard: {
    id: 'creditCard', name: 'Credit Card Debt', icon: '💳',
    balance: 3000, monthlyPayment: 150, interestRate: 0.18,
    description: 'High interest. Pay this off first!'
  },
  studentLoan: {
    id: 'studentLoan', name: 'Student Loan', icon: '🎓',
    balance: 20000, monthlyPayment: 300, interestRate: 0.05,
    description: 'Investment in yourself... hopefully.'
  },
  carLoan: {
    id: 'carLoan', name: 'Car Loan', icon: '🚗',
    balance: 15000, monthlyPayment: 400, interestRate: 0.07,
    description: 'Depreciating asset. A liability in disguise.'
  },
  personalLoan: {
    id: 'personalLoan', name: 'Personal Loan', icon: '💰',
    balance: 5000, monthlyPayment: 250, interestRate: 0.12,
    description: 'Emergency borrowing. Avoid if possible.'
  },
  mortgage: {
    id: 'mortgage', name: 'Mortgage', icon: '🏡',
    balance: 200000, monthlyPayment: 1200, interestRate: 0.04,
    description: 'Your home. Builds equity slowly.'
  }
};

// Lifestyle expenses
export const LIFESTYLES = {
  basic: { id: 'basic', name: 'Basic Living', monthlyExpenses: 1500, description: 'Roommate, rice & beans.' },
  comfortable: { id: 'comfortable', name: 'Comfortable', monthlyExpenses: 2500, description: 'Own apartment, decent food.' },
  premium: { id: 'premium', name: 'Premium', monthlyExpenses: 4000, description: 'Nice place, good food, fun.' },
  luxury: { id: 'luxury', name: 'Luxury', monthlyExpenses: 7000, description: 'Penthouse, fine dining.' }
};
