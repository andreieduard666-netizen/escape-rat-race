// Escape the Rat Race - Multiplayer Server
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Game rooms storage
const rooms = new Map();

// Generate room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Room class
class GameRoom {
  constructor(code, hostId, hostName, maxPlayers = 6) {
    this.code = code;
    this.hostId = hostId;
    this.maxPlayers = maxPlayers;
    this.players = new Map();
    this.state = 'lobby'; // lobby | playing | finished
    this.currentTurnIndex = 0;
    this.month = 1;
    this.turnOrder = [];
    this.createdAt = Date.now();
    this.settings = {
      startingMoney: 2000,
      gameSpeed: 'normal' // normal | fast
    };
  }

  addPlayer(socketId, name, background) {
    if (this.players.size >= this.maxPlayers) return false;
    if (this.state !== 'lobby') return false;

    this.players.set(socketId, {
      id: socketId,
      name: name,
      background: background,
      ready: false,
      // Player stats
      money: 2000,
      baseIncome: 0,
      baseExpenses: 2000,
      finIQ: 10,
      energy: 100,
      maxEnergy: 100,
      stress: 0,
      actionPoints: 3,
      maxActionPoints: 3,
      job: null,
      assets: [],
      liabilities: [],
      level: 1,
      xp: 0,
      passiveIncome: 0,
      netWorth: 2000,
      isBankrupt: false,
      hasEscaped: false,
      escapeStreak: 0,
      finished: false
    });

    this.turnOrder.push(socketId);
    return true;
  }

  removePlayer(socketId) {
    this.players.delete(socketId);
    this.turnOrder = this.turnOrder.filter(id => id !== socketId);
    
    // Transfer host if needed
    if (this.hostId === socketId && this.players.size > 0) {
      this.hostId = this.turnOrder[0];
    }
    
    return this.players.size;
  }

  setReady(socketId, ready) {
    const player = this.players.get(socketId);
    if (player) {
      player.ready = ready;
      return true;
    }
    return false;
  }

  allReady() {
    if (this.players.size < 2) return false;
    for (const player of this.players.values()) {
      if (!player.ready) return false;
    }
    return true;
  }

  startGame() {
    if (!this.allReady()) return false;
    
    this.state = 'playing';
    this.currentTurnIndex = 0;
    this.month = 1;
    
    // Initialize players based on background
    for (const player of this.players.values()) {
      this.initPlayerByBackground(player);
    }
    
    return true;
  }

  initPlayerByBackground(player) {
    const backgrounds = {
      student: { money: 500, income: 1500, expenses: 1200, finIQ: 5, liabilities: [{ name: 'Student Loan', monthlyPayment: 300, balance: 25000 }] },
      employee: { money: 2000, income: 3500, expenses: 3000, finIQ: 10, liabilities: [{ name: 'Credit Card', monthlyPayment: 200, balance: 5000 }] },
      entrepreneur: { money: 5000, income: 2000, expenses: 2500, finIQ: 20, assets: [{ name: 'Side Business', monthlyIncome: 300 }], liabilities: [{ name: 'Business Loan', monthlyPayment: 350, balance: 10000 }] }
    };
    
    const bg = backgrounds[player.background] || backgrounds.employee;
    player.money = bg.money;
    player.baseIncome = bg.income;
    player.baseExpenses = bg.expenses;
    player.finIQ = bg.finIQ;
    player.liabilities = bg.liabilities || [];
    player.assets = bg.assets || [];
    player.passiveIncome = player.assets.reduce((sum, a) => sum + (a.monthlyIncome || 0), 0);
    player.netWorth = player.money + player.assets.reduce((sum, a) => sum + (a.cost || 5000), 0) - player.liabilities.reduce((sum, l) => sum + l.balance, 0);
  }

  getCurrentPlayer() {
    if (this.turnOrder.length === 0) return null;
    const currentId = this.turnOrder[this.currentTurnIndex];
    return this.players.get(currentId);
  }

  getCurrentPlayerId() {
    if (this.turnOrder.length === 0) return null;
    return this.turnOrder[this.currentTurnIndex];
  }

  nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
    
    // If we've gone through all players, new month
    if (this.currentTurnIndex === 0) {
      this.month++;
      this.processMonth();
    }
    
    // Skip bankrupt players
    let attempts = 0;
    while (this.getCurrentPlayer()?.isBankrupt && attempts < this.turnOrder.length) {
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
      attempts++;
    }
    
    return this.getCurrentPlayer();
  }

  processMonth() {
    for (const player of this.players.values()) {
      if (player.isBankrupt) continue;
      
      // Calculate income
      const jobIncome = player.job?.income || 0;
      const passiveIncome = player.passiveIncome;
      const totalIncome = jobIncome + passiveIncome;
      
      // Calculate expenses
      const liabilityPayments = player.liabilities.reduce((sum, l) => sum + l.monthlyPayment, 0);
      const totalExpenses = player.baseExpenses + liabilityPayments;
      
      // Net change
      const net = totalIncome - totalExpenses;
      player.money += net;
      
      // Reduce liability balances
      player.liabilities.forEach(l => {
        l.balance = Math.max(0, l.balance - l.monthlyPayment);
      });
      player.liabilities = player.liabilities.filter(l => l.balance > 0);
      
      // Recalculate stats
      player.passiveIncome = player.assets.reduce((sum, a) => sum + (a.monthlyIncome || 0), 0);
      player.netWorth = player.money + player.assets.reduce((sum, a) => sum + (a.cost || 5000), 0) - player.liabilities.reduce((sum, l) => sum + l.balance, 0);
      
      // Check escape
      if (player.passiveIncome > totalExpenses) {
        player.escapeStreak++;
        if (player.escapeStreak >= 3) {
          player.hasEscaped = true;
          player.finished = true;
        }
      } else {
        player.escapeStreak = 0;
      }
      
      // Check bankruptcy
      if (player.money < -5000 || player.stress >= 100) {
        player.isBankrupt = true;
        player.finished = true;
      }
      
      // Reset action points
      player.actionPoints = player.maxActionPoints;
      player.energy = Math.min(player.maxEnergy, player.energy + 30);
      player.stress = Math.max(0, player.stress - 5);
    }
  }

  // Actions
  doWork(socketId, jobId) {
    const player = this.players.get(socketId);
    if (!player || player.actionPoints < 1) return { success: false, message: 'No action points!' };
    
    const jobs = {
      cashier: { income: 2000, energyCost: 15, stressGain: 10, finIQRequired: 0 },
      delivery: { income: 2500, energyCost: 18, stressGain: 12, finIQRequired: 0 },
      office: { income: 3500, energyCost: 20, stressGain: 15, finIQRequired: 10 },
      programmer: { income: 5500, energyCost: 22, stressGain: 18, finIQRequired: 25 },
      manager: { income: 6000, energyCost: 25, stressGain: 20, finIQRequired: 30 },
      director: { income: 9000, energyCost: 28, stressGain: 25, finIQRequired: 50 }
    };
    
    const job = jobs[jobId];
    if (!job) return { success: false, message: 'Invalid job!' };
    if (player.finIQ < job.finIQRequired) return { success: false, message: `Need ${job.finIQRequired} FinIQ!` };
    if (player.energy < job.energyCost) return { success: false, message: 'Not enough energy!' };
    
    player.job = { id: jobId, ...job, name: jobId.charAt(0).toUpperCase() + jobId.slice(1) };
    player.actionPoints--;
    player.energy -= job.energyCost;
    player.stress += job.stressGain;
    player.xp += 10;
    
    return { success: true, message: `Working as ${player.job.name}! Income: $${job.income}/mo` };
  }

  doInvest(socketId, assetId) {
    const player = this.players.get(socketId);
    if (!player || player.actionPoints < 1) return { success: false, message: 'No action points!' };
    
    const assets = {
      savings: { cost: 1000, monthlyIncome: 5, finIQRequired: 0 },
      indexFund: { cost: 2000, monthlyIncome: 50, finIQRequired: 15 },
      stocks: { cost: 5000, monthlyIncome: 175, finIQRequired: 25 },
      crypto: { cost: 1000, monthlyIncome: 150, finIQRequired: 30 },
      rentalProperty: { cost: 50000, monthlyIncome: 700, finIQRequired: 40 },
      franchise: { cost: 100000, monthlyIncome: 2750, finIQRequired: 60 }
    };
    
    const asset = assets[assetId];
    if (!asset) return { success: false, message: 'Invalid asset!' };
    if (player.finIQ < asset.finIQRequired) return { success: false, message: `Need ${asset.finIQRequired} FinIQ!` };
    if (player.money < asset.cost) return { success: false, message: `Need $${asset.cost}!` };
    
    player.money -= asset.cost;
    player.assets.push({ id: assetId, name: assetId.replace(/([A-Z])/g, ' $1').trim(), cost: asset.cost, monthlyIncome: asset.monthlyIncome });
    player.passiveIncome = player.assets.reduce((sum, a) => sum + a.monthlyIncome, 0);
    player.netWorth = player.money + player.assets.reduce((sum, a) => sum + a.cost, 0) - player.liabilities.reduce((sum, l) => sum + l.balance, 0);
    player.actionPoints--;
    player.xp += 25;
    
    return { success: true, message: `Bought ${player.assets[player.assets.length - 1].name}! +$${asset.monthlyIncome}/mo passive` };
  }

  doLearn(socketId, learnId) {
    const player = this.players.get(socketId);
    if (!player || player.actionPoints < 1) return { success: false, message: 'No action points!' };
    
    const learnings = {
      books: { finIQGain: 5, energyCost: 8, cost: 0 },
      podcast: { finIQGain: 3, energyCost: 5, cost: 0 },
      course: { finIQGain: 12, energyCost: 15, cost: 500 },
      seminar: { finIQGain: 15, energyCost: 12, cost: 1000 },
      mentor: { finIQGain: 20, energyCost: 10, cost: 2000 }
    };
    
    const learn = learnings[learnId];
    if (!learn) return { success: false, message: 'Invalid option!' };
    if (player.money < learn.cost) return { success: false, message: `Need $${learn.cost}!` };
    if (player.energy < learn.energyCost) return { success: false, message: 'Not enough energy!' };
    
    player.money -= learn.cost;
    player.finIQ += learn.finIQGain;
    player.energy -= learn.energyCost;
    player.actionPoints--;
    player.xp += 20;
    
    return { success: true, message: `+${learn.finIQGain} Financial IQ!` };
  }

  doPayDebt(socketId, debtIndex) {
    const player = this.players.get(socketId);
    if (!player || player.actionPoints < 1) return { success: false, message: 'No action points!' };
    
    const liability = player.liabilities[debtIndex];
    if (!liability) return { success: false, message: 'Debt not found!' };
    
    const payment = Math.min(liability.balance, player.money);
    if (payment <= 0) return { success: false, message: 'No money to pay!' };
    
    player.money -= payment;
    liability.balance -= payment;
    
    if (liability.balance <= 0) {
      player.liabilities.splice(debtIndex, 1);
      player.xp += 30;
    }
    
    player.actionPoints--;
    player.netWorth = player.money + player.assets.reduce((sum, a) => sum + a.cost, 0) - player.liabilities.reduce((sum, l) => sum + l.balance, 0);
    
    return { success: true, message: `Paid $${payment} toward ${liability.name}!` };
  }

  doHustle(socketId) {
    const player = this.players.get(socketId);
    if (!player || player.actionPoints < 1) return { success: false, message: 'No action points!' };
    if (player.energy < 15) return { success: false, message: 'Not enough energy!' };
    
    player.actionPoints--;
    player.energy -= 15;
    player.stress += 10;
    
    if (Math.random() < 0.2) {
      return { success: true, failed: true, message: 'Side hustle failed this month.' };
    }
    
    const income = 300 + Math.floor(Math.random() * 1200);
    player.money += income;
    player.xp += 15;
    
    return { success: true, message: `Side hustle earned $${income}!` };
  }

  doRest(socketId) {
    const player = this.players.get(socketId);
    if (!player || player.actionPoints < 1) return { success: false, message: 'No action points!' };
    
    player.actionPoints--;
    player.energy = Math.min(player.maxEnergy, player.energy + 40);
    player.stress = Math.max(0, player.stress - 20);
    player.xp += 5;
    
    return { success: true, message: 'Rested! Energy and stress recovered.' };
  }

  getGameState() {
    const playersArray = [];
    for (const [id, player] of this.players) {
      playersArray.push({
        id: id,
        name: player.name,
        background: player.background,
        isHost: id === this.hostId,
        ready: player.ready,
        money: player.money,
        income: player.baseIncome,
        passiveIncome: player.passiveIncome,
        expenses: player.baseExpenses + player.liabilities.reduce((sum, l) => sum + l.monthlyPayment, 0),
        netWorth: player.netWorth,
        finIQ: player.finIQ,
        energy: player.energy,
        stress: player.stress,
        actionPoints: player.actionPoints,
        level: player.level,
        xp: player.xp,
        job: player.job,
        assets: player.assets,
        liabilities: player.liabilities,
        isBankrupt: player.isBankrupt,
        hasEscaped: player.hasEscaped,
        escapeStreak: player.escapeStreak,
        finished: player.finished,
        isCurrentTurn: id === this.getCurrentPlayerId()
      });
    }
    
    return {
      code: this.code,
      state: this.state,
      month: this.month,
      currentPlayerId: this.getCurrentPlayerId(),
      players: playersArray,
      maxPlayers: this.maxPlayers,
      settings: this.settings
    };
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  let currentRoom = null;

  // Create room
  socket.on('lobby:create', (data) => {
    let code = generateRoomCode();
    while (rooms.has(code)) {
      code = generateRoomCode();
    }
    
    const room = new GameRoom(code, socket.id, data.name, data.maxPlayers || 6);
    room.addPlayer(socket.id, data.name, data.background);
    
    rooms.set(code, room);
    currentRoom = code;
    
    socket.join(code);
    socket.emit('lobby:created', { code: code, playerId: socket.id });
    io.to(code).emit('game:state', room.getGameState());
    
    console.log(`Room created: ${code} by ${data.name}`);
  });

  // Join room
  socket.on('lobby:join', (data) => {
    const code = data.code.toUpperCase();
    const room = rooms.get(code);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found!' });
      return;
    }
    
    if (room.state !== 'lobby') {
      socket.emit('error', { message: 'Game already started!' });
      return;
    }
    
    if (!room.addPlayer(socket.id, data.name, data.background)) {
      socket.emit('error', { message: 'Room is full!' });
      return;
    }
    
    currentRoom = code;
    socket.join(code);
    socket.emit('lobby:joined', { code: code, playerId: socket.id });
    io.to(code).emit('game:state', room.getGameState());
    io.to(code).emit('lobby:playerJoined', { name: data.name });
    
    console.log(`${data.name} joined room: ${code}`);
  });

  // Player ready
  socket.on('lobby:ready', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    
    const player = room.players.get(socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(currentRoom).emit('game:state', room.getGameState());
    }
  });

  // Start game (host only)
  socket.on('game:start', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.hostId !== socket.id) return;
    
    if (room.startGame()) {
      io.to(currentRoom).emit('game:started', room.getGameState());
      io.to(currentRoom).emit('game:state', room.getGameState());
      
      // Notify first player
      const currentPlayer = room.getCurrentPlayer();
      if (currentPlayer) {
        io.to(room.getCurrentPlayerId()).emit('game:yourTurn', { month: room.month });
      }
    } else {
      socket.emit('error', { message: 'Not all players are ready!' });
    }
  });

  // Player actions
  socket.on('game:action', (data) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.state !== 'playing') return;
    if (room.getCurrentPlayerId() !== socket.id) {
      socket.emit('error', { message: 'Not your turn!' });
      return;
    }

    let result;
    switch (data.type) {
      case 'work':
        result = room.doWork(socket.id, data.jobId);
        break;
      case 'hustle':
        result = room.doHustle(socket.id);
        break;
      case 'invest':
        result = room.doInvest(socket.id, data.assetId);
        break;
      case 'learn':
        result = room.doLearn(socket.id, data.learnId);
        break;
      case 'payDebt':
        result = room.doPayDebt(socket.id, data.debtIndex);
        break;
      case 'rest':
        result = room.doRest(socket.id);
        break;
      default:
        result = { success: false, message: 'Unknown action!' };
    }

    socket.emit('game:actionResult', result);
    io.to(currentRoom).emit('game:state', room.getGameState());
  });

  // End turn
  socket.on('game:endTurn', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.state !== 'playing') return;
    if (room.getCurrentPlayerId() !== socket.id) {
      socket.emit('error', { message: 'Not your turn!' });
      return;
    }

    const nextPlayer = room.nextTurn();
    
    // Check for winners
    const winners = [];
    for (const player of room.players.values()) {
      if (player.hasEscaped) {
        winners.push(player.name);
      }
    }
    
    if (winners.length > 0 || Array.from(room.players.values()).every(p => p.finished)) {
      room.state = 'finished';
      io.to(currentRoom).emit('game:finished', {
        winners: winners,
        state: room.getGameState()
      });
    } else {
      io.to(currentRoom).emit('game:state', room.getGameState());
      if (nextPlayer) {
        io.to(nextPlayer.id).emit('game:yourTurn', { month: room.month });
      }
    }
  });

  // Chat
  socket.on('chat:message', (data) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    
    const player = room.players.get(socket.id);
    if (player) {
      io.to(currentRoom).emit('chat:message', {
        name: player.name,
        message: data.message,
        timestamp: Date.now()
      });
    }
  });

  // Leave room
  socket.on('lobby:leave', () => {
    handleDisconnect();
  });

  // Disconnect
  function handleDisconnect() {
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        const player = room.players.get(socket.id);
        const playerName = player?.name || 'Someone';
        
        room.removePlayer(socket.id);
        
        if (room.players.size === 0) {
          rooms.delete(currentRoom);
          console.log(`Room deleted: ${currentRoom}`);
        } else {
          io.to(currentRoom).emit('lobby:playerLeft', { name: playerName });
          io.to(currentRoom).emit('game:state', room.getGameState());
        }
      }
      socket.leave(currentRoom);
      currentRoom = null;
    }
  }

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    handleDisconnect();
  });

  // Get available rooms
  socket.on('lobby:list', () => {
    const roomList = [];
    for (const [code, room] of rooms) {
      if (room.state === 'lobby') {
        roomList.push({
          code: code,
          players: room.players.size,
          maxPlayers: room.maxPlayers,
          hostName: room.players.get(room.hostId)?.name || 'Unknown'
        });
      }
    }
    socket.emit('lobby:list', roomList);
  });
});

// Cleanup old rooms every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.createdAt > 3600000) { // 1 hour
      rooms.delete(code);
      console.log(`Cleaned up old room: ${code}`);
    }
  }
}, 1800000);

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🐀 Escape the Rat Race Server running on port ${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
});
