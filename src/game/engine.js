// Game Engine - manages game state and flow
import { Player } from './player.js';
import { SCENARIOS, RANDOM_EVENTS } from '../data/scenarios.js';

export class GameEngine {
  constructor() {
    this.player = null;
    this.state = 'menu'; // menu, characterSelect, playing, gameOver, victory
    this.currentEvent = null;
    this.eventQueue = [];
    this.consecutiveEscapeMonths = 0;
    this.totalMonths = 0;
    this.maxMonths = 120; // 10 year limit
    
    // Callbacks for UI updates
    this.onStateChange = null;
    this.onEvent = null;
    this.onMonthEnd = null;
    this.onGameOver = null;
    this.onVictory = null;
  }
  
  // Start new game with character
  startGame(name, background) {
    this.player = new Player(name, background);
    this.state = 'playing';
    this.consecutiveEscapeMonths = 0;
    this.totalMonths = 0;
    this.eventQueue = [];
    this.currentEvent = null;
    
    if (this.onStateChange) this.onStateChange('playing');
    
    return this.player;
  }
  
  // End current player's turn and process month
  endTurn() {
    if (this.state !== 'playing') return;
    
    // Process month finances
    const monthResult = this.player.processMonth();
    this.totalMonths++;
    
    // Check for random events
    this.rollForEvent();
    
    // Check win condition
    if (this.player.hasEscaped()) {
      this.consecutiveEscapeMonths++;
      if (this.consecutiveEscapeMonths >= 3) {
        this.state = 'victory';
        if (this.onVictory) this.onVictory(this.player);
        return monthResult;
      }
    } else {
      this.consecutiveEscapeMonths = 0;
    }
    
    // Check lose condition
    if (this.player.isBankrupt()) {
      this.state = 'gameOver';
      if (this.onGameOver) this.onGameOver(this.player, 'bankruptcy');
      return monthResult;
    }
    
    // Check time limit
    if (this.totalMonths >= this.maxMonths) {
      this.state = 'gameOver';
      if (this.onGameOver) this.onGameOver(this.player, 'timeout');
      return monthResult;
    }
    
    // Check level up
    if (this.player.checkLevelUp()) {
      this.queueEvent({
        type: 'levelUp',
        title: 'Level Up!',
        icon: '⬆️',
        message: `You reached Level ${this.player.level}! Max energy increased.`
      });
    }
    
    if (this.onMonthEnd) this.onMonthEnd(monthResult);
    
    return monthResult;
  }
  
  // Roll for random events
  rollForEvent() {
    const roll = Math.random();
    
    // Boss events (rare, every ~12 months)
    if (this.player.month % 12 === 0 && roll < 0.15) {
      const bossEvents = RANDOM_EVENTS.boss;
      const event = bossEvents[Math.floor(Math.random() * bossEvents.length)];
      this.triggerEvent(event);
      return;
    }
    
    // Regular events
    // 20% chance for positive
    if (roll < 0.20) {
      const events = RANDOM_EVENTS.positive;
      const event = events[Math.floor(Math.random() * events.length)];
      this.triggerEvent(event);
      return;
    }
    
    // 15% chance for negative
    if (roll < 0.35) {
      const events = RANDOM_EVENTS.negative;
      const event = events[Math.floor(Math.random() * events.length)];
      this.triggerEvent(event);
      return;
    }
    
    // 10% chance for decision scenario
    if (roll < 0.45) {
      this.rollForScenario();
    }
  }
  
  // Roll for decision scenarios
  rollForScenario() {
    const eligible = SCENARIOS.filter(s => 
      this.player.finIQ >= s.minFinIQ && Math.random() < s.probability
    );
    
    if (eligible.length > 0) {
      const scenario = eligible[Math.floor(Math.random() * eligible.length)];
      this.currentEvent = {
        type: 'decision',
        ...scenario
      };
      if (this.onEvent) this.onEvent(this.currentEvent);
    }
  }
  
  // Trigger a random event
  triggerEvent(event) {
    const message = event.action(this.player);
    this.queueEvent({
      type: 'event',
      title: event.name,
      icon: event.icon,
      message: message
    });
    
    if (event.duration) {
      if (event.id === 'recession') {
        this.player.recessionMonths = event.duration;
      }
    }
  }
  
  // Queue an event for display
  queueEvent(event) {
    this.eventQueue.push(event);
    if (this.onEvent && this.eventQueue.length === 1) {
      this.onEvent(this.eventQueue[0]);
    }
  }
  
  // Process player's choice in a scenario
  processChoice(choiceIndex) {
    if (!this.currentEvent || this.currentEvent.type !== 'decision') return;
    
    const choice = this.currentEvent.choices[choiceIndex];
    if (!choice) return;
    
    const message = choice.action(this.player);
    
    const result = {
      type: 'choiceResult',
      title: this.currentEvent.title,
      icon: this.currentEvent.icon,
      message: message
    };
    
    this.currentEvent = null;
    this.queueEvent(result);
    
    return message;
  }
  
  // Dismiss current event and show next
  dismissEvent() {
    this.eventQueue.shift();
    if (this.eventQueue.length > 0) {
      if (this.onEvent) this.onEvent(this.eventQueue[0]);
    } else {
      if (this.onEvent) this.onEvent(null);
    }
  }
  
  // Player actions
  doWork(jobId) {
    const result = this.player.work(jobId);
    if (result.success) {
      this.queueEvent({
        type: 'action',
        title: 'Work',
        icon: '💼',
        message: result.message
      });
    }
    return result;
  }
  
  doSideHustle(hustleId) {
    const result = this.player.sideHustle(hustleId);
    if (result.success) {
      this.queueEvent({
        type: result.failed ? 'actionFail' : 'action',
        title: 'Side Hustle',
        icon: result.failed ? '❌' : '💡',
        message: result.message
      });
    }
    return result;
  }
  
  doLearn(learnId) {
    const result = this.player.learn(learnId);
    if (result.success) {
      this.queueEvent({
        type: 'action',
        title: 'Learning',
        icon: '📚',
        message: result.message
      });
    }
    return result;
  }
  
  doBuyAsset(assetId) {
    const result = this.player.buyAsset(assetId);
    if (result.success) {
      this.queueEvent({
        type: 'action',
        title: 'Asset Purchased',
        icon: '🏠',
        message: result.message
      });
    }
    return result;
  }
  
  doPayDebt(liabilityIndex) {
    const result = this.player.payDebt(liabilityIndex);
    if (result.success) {
      this.queueEvent({
        type: 'action',
        title: 'Debt Payment',
        icon: '💰',
        message: result.message
      });
    }
    return result;
  }
  
  doRest() {
    const result = this.player.rest();
    if (result.success) {
      this.queueEvent({
        type: 'action',
        title: 'Rest',
        icon: '😴',
        message: result.message
      });
    }
    return result;
  }
  
  // Get game status for UI
  getStatus() {
    if (!this.player) return null;
    
    return {
      month: this.player.month,
      money: this.player.money,
      income: this.player.calculateTotalIncome(),
      expenses: this.player.calculateTotalExpenses(),
      passiveIncome: this.player.calculatePassiveIncome(),
      netWorth: this.player.calculateNetWorth(),
      finIQ: this.player.finIQ,
      energy: this.player.energy,
      maxEnergy: this.player.maxEnergy,
      stress: this.player.stress,
      actionPoints: this.player.actionPoints,
      maxActionPoints: this.player.maxActionPoints,
      level: this.player.level,
      xp: this.player.xp,
      escaped: this.player.hasEscaped(),
      escapeStreak: this.consecutiveEscapeMonths,
      monthsToWin: 3 - this.consecutiveEscapeMonths,
      job: this.player.job,
      assets: this.player.assets,
      liabilities: this.player.liabilities,
      history: this.player.history
    };
  }
  
  // Save/Load game
  saveGame() {
    if (!this.player) return null;
    return JSON.stringify({
      player: this.player.toJSON(),
      state: this.state,
      consecutiveEscapeMonths: this.consecutiveEscapeMonths,
      totalMonths: this.totalMonths
    });
  }
  
  loadGame(saveData) {
    try {
      const data = JSON.parse(saveData);
      this.player = Player.fromJSON(data.player);
      this.state = data.state;
      this.consecutiveEscapeMonths = data.consecutiveEscapeMonths;
      this.totalMonths = data.totalMonths;
      return true;
    } catch (e) {
      console.error('Failed to load game:', e);
      return false;
    }
  }
}
