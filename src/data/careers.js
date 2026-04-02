// Jobs - 18 different career paths
export const CAREERS = {
  // Entry Level (FinIQ 0-10)
  cashier: {
    id: 'cashier', name: 'Cashier', icon: '🏪',
    income: 2000, energyCost: 15, stressGain: 10, finIQRequired: 0,
    description: 'Basic retail. Everyone starts somewhere.'
  },
  waiter: {
    id: 'waiter', name: 'Waiter', icon: '🍽️',
    income: 2200, energyCost: 16, stressGain: 12, finIQRequired: 0,
    description: 'Tips can boost your income!'
  },
  delivery: {
    id: 'delivery', name: 'Delivery Driver', icon: '🚗',
    income: 2500, energyCost: 18, stressGain: 12, finIQRequired: 0,
    description: 'Flexible hours, decent pay.'
  },
  warehouse: {
    id: 'warehouse', name: 'Warehouse Worker', icon: '📦',
    income: 2400, energyCost: 20, stressGain: 14, finIQRequired: 0,
    description: 'Physical work, steady paycheck.'
  },
  security: {
    id: 'security', name: 'Security Guard', icon: '🛡️',
    income: 2600, energyCost: 14, stressGain: 8, finIQRequired: 5,
    description: 'Easy work, just stand around.'
  },
  
  // Mid Level (FinIQ 15-30)
  office: {
    id: 'office', name: 'Office Worker', icon: '👔',
    income: 3500, energyCost: 20, stressGain: 15, finIQRequired: 10,
    description: 'The classic 9-5. Stable income.'
  },
  sales: {
    id: 'sales', name: 'Sales Rep', icon: '🤝',
    income: 4000, energyCost: 20, stressGain: 15, finIQRequired: 15,
    description: 'Commission-based. Variable income.'
  },
  teacher: {
    id: 'teacher', name: 'Teacher', icon: '📚',
    income: 3800, energyCost: 22, stressGain: 18, finIQRequired: 15,
    description: 'Shape young minds. Summer off!'
  },
  nurse: {
    id: 'nurse', name: 'Nurse', icon: '🏥',
    income: 4500, energyCost: 24, stressGain: 20, finIQRequired: 20,
    description: 'High demand, long shifts.'
  },
  electrician: {
    id: 'electrician', name: 'Electrician', icon: '⚡',
    income: 5000, energyCost: 20, stressGain: 15, finIQRequired: 20,
    description: 'Skilled trade. Always in demand.'
  },
  programmer: {
    id: 'programmer', name: 'Programmer', icon: '💻',
    income: 5500, energyCost: 22, stressGain: 18, finIQRequired: 25,
    description: 'Code for cash. Remote work possible.'
  },
  manager: {
    id: 'manager', name: 'Manager', icon: '📊',
    income: 6000, energyCost: 25, stressGain: 20, finIQRequired: 30,
    description: 'Lead teams, earn more, stress more.'
  },
  accountant: {
    id: 'accountant', name: 'Accountant', icon: '🧮',
    income: 5200, energyCost: 20, stressGain: 15, finIQRequired: 25,
    description: 'Handle money. Irony, right?'
  },
  
  // High Level (FinIQ 35+)
  engineer: {
    id: 'engineer', name: 'Engineer', icon: '⚙️',
    income: 7500, energyCost: 24, stressGain: 18, finIQRequired: 35,
    description: 'Solve problems, get paid well.'
  },
  lawyer: {
    id: 'lawyer', name: 'Lawyer', icon: '⚖️',
    income: 8500, energyCost: 28, stressGain: 25, finIQRequired: 40,
    description: 'Billable hours. High stress, high pay.'
  },
  doctor: {
    id: 'doctor', name: 'Doctor', icon: '🩺',
    income: 10000, energyCost: 30, stressGain: 28, finIQRequired: 45,
    description: 'Years of school, great pay.'
  },
  director: {
    id: 'director', name: 'Director', icon: '🎬',
    income: 9000, energyCost: 28, stressGain: 25, finIQRequired: 50,
    description: 'Executive level. Big decisions.'
  },
  consultant: {
    id: 'consultant', name: 'Consultant', icon: '🎯',
    income: 8000, energyCost: 24, stressGain: 20, finIQRequired: 45,
    description: 'Expert advice for premium pay.'
  },
  ceo: {
    id: 'ceo', name: 'CEO', icon: '👑',
    income: 15000, energyCost: 30, stressGain: 30, finIQRequired: 70,
    description: 'The top. Massive responsibility.'
  }
};

// Side Hustles - 12 different options
export const SIDE_HUSTLES = {
  dogWalking: {
    id: 'dogWalking', name: 'Dog Walking', icon: '🐕',
    baseIncome: 200, maxIncome: 600, energyCost: 10, stressGain: 3,
    finIQRequired: 0, risk: 0.03,
    description: 'Get paid to exercise with dogs!'
  },
  tutoring: {
    id: 'tutoring', name: 'Tutoring', icon: '📝',
    baseIncome: 300, maxIncome: 800, energyCost: 12, stressGain: 5,
    finIQRequired: 0, risk: 0.05,
    description: 'Teach what you know. Low risk.'
  },
  uberDriver: {
    id: 'uberDriver', name: 'Uber Driver', icon: '🚙',
    baseIncome: 400, maxIncome: 1200, energyCost: 16, stressGain: 8,
    finIQRequired: 0, risk: 0.1,
    description: 'Drive when you want. Flexible.'
  },
  handyman: {
    id: 'handyman', name: 'Handyman', icon: '🔧',
    baseIncome: 400, maxIncome: 1500, energyCost: 16, stressGain: 8,
    finIQRequired: 5, risk: 0.1,
    description: 'Fix things, make money.'
  },
  freelancing: {
    id: 'freelancing', name: 'Freelancing', icon: '✍️',
    baseIncome: 500, maxIncome: 2000, energyCost: 20, stressGain: 10,
    finIQRequired: 10, risk: 0.2,
    description: 'Use your skills for extra cash.'
  },
  photography: {
    id: 'photography', name: 'Photography', icon: '📸',
    baseIncome: 300, maxIncome: 1500, energyCost: 14, stressGain: 8,
    finIQRequired: 10, risk: 0.15,
    description: 'Capture moments, capture cash.'
  },
  reselling: {
    id: 'reselling', name: 'Reselling', icon: '🏷️',
    baseIncome: 200, maxIncome: 3000, energyCost: 15, stressGain: 10,
    finIQRequired: 15, risk: 0.3,
    description: 'Buy low, sell high. Variable returns.'
  },
  contentCreator: {
    id: 'contentCreator', name: 'Content Creator', icon: '🎬',
    baseIncome: 100, maxIncome: 5000, energyCost: 18, stressGain: 12,
    finIQRequired: 20, risk: 0.4,
    description: 'Build an audience, monetize later.'
  },
  dropshipping: {
    id: 'dropshipping', name: 'Dropshipping', icon: '📦',
    baseIncome: 200, maxIncome: 4000, energyCost: 18, stressGain: 14,
    finIQRequired: 20, risk: 0.35,
    description: 'Sell products without inventory.'
  },
  airbnbHost: {
    id: 'airbnbHost', name: 'Airbnb Host', icon: '🏠',
    baseIncome: 600, maxIncome: 2500, energyCost: 12, stressGain: 8,
    finIQRequired: 25, risk: 0.15,
    description: 'Rent out a room or your place.'
  },
  consulting: {
    id: 'consulting', name: 'Consulting', icon: '💡',
    baseIncome: 800, maxIncome: 3000, energyCost: 20, stressGain: 12,
    finIQRequired: 30, risk: 0.25,
    description: 'Sell your expertise by the hour.'
  },
  stockTrading: {
    id: 'stockTrading', name: 'Day Trading', icon: '📈',
    baseIncome: -500, maxIncome: 5000, energyCost: 22, stressGain: 20,
    finIQRequired: 35, risk: 0.5,
    description: 'High risk, high reward. Could lose it all.'
  }
};

// Learning - 9 different ways to learn
export const LEARNING = {
  books: {
    id: 'books', name: 'Read Books', icon: '📖',
    finIQGain: 5, energyCost: 8, cost: 0,
    description: 'Rich Dad Poor Dad, Think & Grow Rich...'
  },
  podcast: {
    id: 'podcast', name: 'Finance Podcast', icon: '🎧',
    finIQGain: 3, energyCost: 5, cost: 0,
    description: 'Learn while commuting. Free!'
  },
  youtube: {
    id: 'youtube', name: 'YouTube University', icon: '📺',
    finIQGain: 4, energyCost: 6, cost: 0,
    description: 'Free educational videos.'
  },
  course: {
    id: 'course', name: 'Online Course', icon: '🎓',
    finIQGain: 12, energyCost: 15, cost: 500,
    description: 'Structured learning. Best ROI.'
  },
  workshop: {
    id: 'workshop', name: 'Weekend Workshop', icon: '🛠️',
    finIQGain: 8, energyCost: 10, cost: 300,
    description: 'Hands-on learning in a day.'
  },
  seminar: {
    id: 'seminar', name: 'Finance Seminar', icon: '🎤',
    finIQGain: 15, energyCost: 12, cost: 1000,
    description: 'Network + learn. Worth it.'
  },
  certification: {
    id: 'certification', name: 'Get Certified', icon: '📜',
    finIQGain: 18, energyCost: 20, cost: 1500,
    description: 'Professional certification. Boosts career.'
  },
  mentor: {
    id: 'mentor', name: 'Find a Mentor', icon: '🧠',
    finIQGain: 20, energyCost: 10, cost: 2000,
    description: 'Learn from someone who escaped.'
  },
  mastermind: {
    id: 'mastermind', name: 'Mastermind Group', icon: '👥',
    finIQGain: 25, energyCost: 15, cost: 3000,
    description: 'Join elite group of entrepreneurs.'
  }
};
