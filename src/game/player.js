// Player class - manages all player stats and actions
import { CAREERS, SIDE_HUSTLES, LEARNING } from '../data/careers.js';
import { ASSETS, LIABILITIES, LIFESTYLES } from '../data/investments.js';

export class Player {
  constructor(name, background) {
    this.name = name;
    this.background = background;
    this.id = Math.random().toString(36).substr(2, 9);
    
    // Apply background bonuses
    const bg = this.getBackgroundStats(background);
    
    // Core stats
    this.money = bg.money;
    this.baseIncome = bg.income;
    this.baseExpenses = bg.expenses;
    this.finIQ = bg.finIQ;
    this.energy = 100;
    this.maxEnergy = 100;
    this.stress = 0;
    
    // Turn stats
    this.actionPoints = 3;
    this.maxActionPoints = 3;
    
    // Game state
    this.job = bg.job;
    this.assets = [...bg.assets];
    this.liabilities = [...bg.liabilities];
    this.lifestyle = 'basic';
    this.month = 1;
    
    // Progression
    this.xp = 0;
    this.level = 1;
    this.achievements = [];
    this.totalEarnings = 0;
    this.totalExpenses = 0;
    this.passiveIncomeStreak = 0;
    
    // Temporary effects
    this.temporaryBonus = null;
    this.recessionMonths = 0;
    
    // History for charts
    this.history = [{
      month: 1,
      netWorth: this.calculateNetWorth(),
      income: this.calculateTotalIncome(),
      expenses: this.calculateTotalExpenses(),
      passiveIncome: this.calculatePassiveIncome()
    }];
  }
  
  getBackgroundStats(background) {
    const backgrounds = {
      student: {
        money: 500,
        income: 1500,
        expenses: 1200,
        finIQ: 5,
        job: null,
        assets: [],
        liabilities: [{
          id: 'studentLoan_start',
          name: 'Student Loan',
          icon: '🎓',
          balance: 25000,
          monthlyPayment: 300,
          interestRate: 0.05
        }]
      },
      employee: {
        money: 2000,
        income: 3500,
        expenses: 3000,
        finIQ: 10,
        job: CAREERS.office,
        assets: [],
        liabilities: [{
          id: 'creditCard_start',
          name: 'Credit Card',
          icon: '💳',
          balance: 5000,
          monthlyPayment: 200,
          interestRate: 0.18
        }]
      },
      entrepreneur: {
        money: 5000,
        income: 2000,
        expenses: 2500,
        finIQ: 20,
        job: null,
        assets: [{
          id: 'sideBusiness_start',
          name: 'Side Business',
          icon: '💼',
          cost: 3000,
          monthlyIncome: { min: 100, max: 500 },
          category: 'business',
          volatility: 0.3
        }],
        liabilities: [{
          id: 'businessLoan_start',
          name: 'Business Loan',
          icon: '🏦',
          balance: 10000,
          monthlyPayment: 350,
          interestRate: 0.08
        }]
      }
    };
    return backgrounds[background] || backgrounds.employee;
  }
  
  // Calculate various income/expense values
  calculateJobIncome() {
    if (!this.job) return 0;
    return this.job.income;
  }
  
  calculatePassiveIncome() {
    let total = 0;
    this.assets.forEach(asset => {
      const income = asset.monthlyIncome;
      const base = income.min + Math.random() * (income.max - income.min);
      
      // Apply volatility
      if (asset.volatility) {
        const volatility = (Math.random() - 0.5) * 2 * asset.volatility;
        total += base * (1 + volatility);
      } else {
        total += base;
      }
    });
    
    // Apply recession
    if (this.recessionMonths > 0) {
      total *= 0.5;
    }
    
    // Apply temporary bonus
    if (this.temporaryBonus?.type === 'sideIncome') {
      total *= this.temporaryBonus.multiplier;
    }
    
    return Math.floor(total);
  }
  
  calculateTotalIncome() {
    return this.calculateJobIncome() + this.calculatePassiveIncome();
  }
  
  calculateLiabilityPayments() {
    let total = 0;
    this.liabilities.forEach(liability => {
      total += liability.monthlyPayment;
    });
    return total;
  }
  
  calculateTotalExpenses() {
    const lifestyle = LIFESTYLES[this.lifestyle];
    const baseExp = this.baseExpenses || lifestyle.monthlyExpenses;
    return baseExp + this.calculateLiabilityPayments();
  }
  
  calculateNetWorth() {
    let assetValue = 0;
    this.assets.forEach(a => { assetValue += a.cost; });
    
    let liabilityValue = 0;
    this.liabilities.forEach(l => { liabilityValue += l.balance; });
    
    return this.money + assetValue - liabilityValue;
  }
  
  // Check if player escaped the rat race
  hasEscaped() {
    return this.calculatePassiveIncome() > this.calculateTotalExpenses();
  }
  
  // Check if player is bankrupt
  isBankrupt() {
    return this.money < -5000 || this.stress >= 100;
  }
  
  // Process end of month
  processMonth() {
    const income = this.calculateTotalIncome();
    const expenses = this.calculateTotalExpenses();
    const net = income - expenses;
    
    this.money += net;
    this.totalEarnings += income;
    this.totalExpenses += expenses;
    
    // Reduce liability balances
    this.liabilities.forEach(liability => {
      const interest = liability.balance * (liability.interestRate / 12);
      const principal = liability.monthlyPayment - interest;
      liability.balance = Math.max(0, liability.balance - principal);
    });
    
    // Remove paid off liabilities
    this.liabilities = this.liabilities.filter(l => l.balance > 0);
    
    // Recession countdown
    if (this.recessionMonths > 0) {
      this.recessionMonths--;
    }
    
    // Temporary bonus countdown
    if (this.temporaryBonus?.months) {
      this.temporaryBonus.months--;
      if (this.temporaryBonus.months <= 0) {
        this.temporaryBonus = null;
      }
    }
    
    // Passive income streak
    if (this.calculatePassiveIncome() > this.calculateTotalExpenses()) {
      this.passiveIncomeStreak++;
    } else {
      this.passiveIncomeStreak = 0;
    }
    
    // Stress reduction
    this.stress = Math.max(0, this.stress - 5);
    
    // Energy recovery
    this.energy = Math.min(this.maxEnergy, this.energy + 30);
    
    // Reset action points
    this.actionPoints = this.maxActionPoints;
    
    // Record history
    this.history.push({
      month: this.month,
      netWorth: this.calculateNetWorth(),
      income: income,
      expenses: expenses,
      passiveIncome: this.calculatePassiveIncome(),
      cash: this.money
    });
    
    this.month++;
    
    return { income, expenses, net };
  }
  
  // Action methods
  work(jobId) {
    if (this.actionPoints < 1) return { success: false, message: 'No action points left!' };
    
    const job = CAREERS[jobId];
    if (!job) return { success: false, message: 'Job not found!' };
    if (this.finIQ < job.finIQRequired) return { success: false, message: `Need ${job.finIQRequired} Financial IQ!` };
    if (this.energy < job.energyCost) return { success: false, message: 'Not enough energy! Rest first.' };
    
    this.job = job;
    this.actionPoints--;
    this.energy -= job.energyCost;
    this.stress += job.stressGain;
    this.xp += 10;
    
    return { success: true, message: `Working as ${job.name}! Income: $${job.income}/mo` };
  }
  
  sideHustle(hustleId) {
    if (this.actionPoints < 1) return { success: false, message: 'No action points left!' };
    
    const hustle = SIDE_HUSTLES[hustleId];
    if (!hustle) return { success: false, message: 'Side hustle not found!' };
    if (this.finIQ < hustle.finIQRequired) return { success: false, message: `Need ${hustle.finIQRequired} Financial IQ!` };
    if (this.energy < hustle.energyCost) return { success: false, message: 'Not enough energy!' };
    
    this.actionPoints--;
    this.energy -= hustle.energyCost;
    this.stress += hustle.stressGain;
    
    // Check for failure
    if (Math.random() < hustle.risk) {
      return { success: true, failed: true, message: `${hustle.name} didn't work out this month.` };
    }
    
    const income = hustle.baseIncome + Math.floor(Math.random() * (hustle.maxIncome - hustle.baseIncome));
    this.money += income;
    this.xp += 15;
    
    return { success: true, message: `${hustle.name} earned you $${income}!` };
  }
  
  learn(learnId) {
    if (this.actionPoints < 1) return { success: false, message: 'No action points left!' };
    
    const learn = LEARNING[learnId];
    if (!learn) return { success: false, message: 'Learning option not found!' };
    if (this.money < learn.cost) return { success: false, message: `Need $${learn.cost}!` };
    if (this.energy < learn.energyCost) return { success: false, message: 'Not enough energy!' };
    
    this.actionPoints--;
    this.money -= learn.cost;
    this.energy -= learn.energyCost;
    this.finIQ += learn.finIQGain;
    this.xp += 20;
    
    // Unlock new jobs based on FinIQ
    const unlockedJobs = Object.values(CAREERS).filter(j => 
      j.finIQRequired <= this.finIQ && j.finIQRequired > (this.finIQ - learn.finIQGain)
    );
    
    let msg = `+${learn.finIQGain} Financial IQ!`;
    if (unlockedJobs.length > 0) {
      msg += ` Unlocked: ${unlockedJobs.map(j => j.name).join(', ')}!`;
    }
    
    return { success: true, message: msg };
  }
  
  buyAsset(assetId) {
    if (this.actionPoints < 1) return { success: false, message: 'No action points left!' };
    
    const asset = ASSETS[assetId];
    if (!asset) return { success: false, message: 'Asset not found!' };
    if (this.finIQ < asset.finIQRequired) return { success: false, message: `Need ${asset.finIQRequired} Financial IQ!` };
    if (this.money < asset.cost) return { success: false, message: `Need $${asset.cost}!` };
    
    this.actionPoints--;
    this.money -= asset.cost;
    
    const newAsset = {
      ...asset,
      id: assetId + '_' + Date.now()
    };
    this.assets.push(newAsset);
    this.xp += 25;
    
    const avgIncome = Math.floor((asset.monthlyIncome.min + asset.monthlyIncome.max) / 2);
    return { success: true, message: `Bought ${asset.name}! Passive income: ~$${avgIncome}/mo` };
  }
  
  payDebt(liabilityIndex) {
    if (this.actionPoints < 1) return { success: false, message: 'No action points left!' };
    
    const liability = this.liabilities[liabilityIndex];
    if (!liability) return { success: false, message: 'Debt not found!' };
    
    const payment = Math.min(liability.balance, this.money);
    if (payment <= 0) return { success: false, message: 'No money to pay!' };
    
    this.actionPoints--;
    this.money -= payment;
    liability.balance -= payment;
    
    if (liability.balance <= 0) {
      this.liabilities.splice(liabilityIndex, 1);
      this.xp += 30;
      return { success: true, message: `Paid off ${liability.name}! Debt free from this!` };
    }
    
    this.xp += 10;
    return { success: true, message: `Paid $${payment} toward ${liability.name}. Remaining: $${liability.balance}` };
  }
  
  rest() {
    if (this.actionPoints < 1) return { success: false, message: 'No action points left!' };
    
    this.actionPoints--;
    this.energy = Math.min(this.maxEnergy, this.energy + 40);
    this.stress = Math.max(0, this.stress - 20);
    this.xp += 5;
    
    return { success: true, message: 'Rested! Energy and stress recovered.' };
  }
  
  addLiability(liability) {
    this.liabilities.push(liability);
  }
  
  addAsset(asset) {
    this.assets.push(asset);
  }
  
  // Level up system
  checkLevelUp() {
    const xpNeeded = this.level * 100;
    if (this.xp >= xpNeeded) {
      this.xp -= xpNeeded;
      this.level++;
      this.maxEnergy += 5;
      this.maxActionPoints += (this.level % 5 === 0) ? 1 : 0;
      return true;
    }
    return false;
  }
  
  // Get available jobs based on FinIQ
  getAvailableJobs() {
    return Object.values(CAREERS).filter(j => j.finIQRequired <= this.finIQ);
  }
  
  getAvailableHustles() {
    return Object.values(SIDE_HUSTLES).filter(h => h.finIQRequired <= this.finIQ);
  }
  
  getAvailableLearning() {
    return Object.values(LEARNING);
  }
  
  getAvailableAssets() {
    return Object.values(ASSETS).filter(a => a.finIQRequired <= this.finIQ);
  }
  
  // Serialize for saving
  toJSON() {
    return {
      name: this.name,
      background: this.background,
      money: this.money,
      baseIncome: this.baseIncome,
      baseExpenses: this.baseExpenses,
      finIQ: this.finIQ,
      energy: this.energy,
      stress: this.stress,
      actionPoints: this.actionPoints,
      job: this.job,
      assets: this.assets,
      liabilities: this.liabilities,
      lifestyle: this.lifestyle,
      month: this.month,
      xp: this.xp,
      level: this.level,
      achievements: this.achievements,
      totalEarnings: this.totalEarnings,
      totalExpenses: this.totalExpenses,
      passiveIncomeStreak: this.passiveIncomeStreak,
      history: this.history
    };
  }
  
  static fromJSON(data) {
    const player = new Player(data.name, data.background);
    Object.assign(player, data);
    return player;
  }
}
