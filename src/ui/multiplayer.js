// Multiplayer UI - Lobby, Room, and Online Game Interface
import { io } from 'socket.io-client';

let socket = null;
let currentRoom = null;
let onStateChange = null;

// Connect to server
export function connectToServer(serverUrl = 'http://localhost:3001') {
  if (socket?.connected) return socket;
  
  socket = io(serverUrl, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });
  
  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
  
  socket.on('error', (data) => {
    showToast(data.message, 'error');
  });
  
  return socket;
}

// Disconnect from server
export function disconnectFromServer() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentRoom = null;
  }
}

// Create a room
export function createRoom(name, background, maxPlayers = 6) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error('Not connected to server'));
      return;
    }
    
    socket.emit('lobby:create', { name, background, maxPlayers });
    
    socket.once('lobby:created', (data) => {
      currentRoom = data.code;
      resolve(data);
    });
    
    socket.once('error', (data) => {
      reject(new Error(data.message));
    });
  });
}

// Join a room
export function joinRoom(code, name, background) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error('Not connected to server'));
      return;
    }
    
    socket.emit('lobby:join', { code, name, background });
    
    socket.once('lobby:joined', (data) => {
      currentRoom = data.code;
      resolve(data);
    });
    
    socket.once('error', (data) => {
      reject(new Error(data.message));
    });
  });
}

// Leave room
export function leaveRoom() {
  if (socket && currentRoom) {
    socket.emit('lobby:leave');
    currentRoom = null;
  }
}

// Toggle ready
export function toggleReady() {
  if (socket) {
    socket.emit('lobby:ready');
  }
}

// Start game (host only)
export function startGame() {
  if (socket) {
    socket.emit('game:start');
  }
}

// Send game action
export function sendAction(type, data = {}) {
  if (socket) {
    socket.emit('game:action', { type, ...data });
  }
}

// End turn
export function endTurn() {
  if (socket) {
    socket.emit('game:endTurn');
  }
}

// Send chat message
export function sendChat(message) {
  if (socket) {
    socket.emit('chat:message', { message });
  }
}

// Get available rooms
export function getRoomList() {
  return new Promise((resolve) => {
    if (!socket) {
      resolve([]);
      return;
    }
    
    socket.emit('lobby:list');
    socket.once('lobby:list', (rooms) => {
      resolve(rooms);
    });
  });
}

// Register event handlers
export function onGameEvent(event, callback) {
  if (socket) {
    socket.on(event, callback);
  }
}

// Remove event handler
export function offGameEvent(event, callback) {
  if (socket) {
    socket.off(event, callback);
  }
}

// Get socket
export function getSocket() {
  return socket;
}

// Get current room code
export function getCurrentRoom() {
  return currentRoom;
}

// Render Multiplayer Menu
export function renderMultiplayerMenu(container, onBack) {
  container.innerHTML = `
    <div id="multiplayer-menu" class="screen active" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
      <div class="screen-title">👥 MULTIPLAYER</div>
      <div class="screen-subtitle">Play with friends online!</div>
      
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; width: 100%; margin-top: 32px;">
        <button class="btn btn-primary" id="createRoomBtn" style="width: 100%; padding: 20px;">
          🏠 Create Room
          <span style="display: block; font-size: 12px; font-weight: normal; color: var(--text-secondary); margin-top: 4px;">
            Host a game for up to 6 players
          </span>
        </button>
        
        <button class="btn btn-secondary" id="joinRoomBtn" style="width: 100%; padding: 20px;">
          🚪 Join Room
          <span style="display: block; font-size: 12px; font-weight: normal; color: var(--text-secondary); margin-top: 4px;">
            Enter a room code to join
          </span>
        </button>
        
        <button class="btn btn-secondary" id="localGameBtn" style="width: 100%; padding: 20px;">
          📱 Local Hot-Seat (2-6 players)
          <span style="display: block; font-size: 12px; font-weight: normal; color: var(--text-secondary); margin-top: 4px;">
            Pass and play on same device
          </span>
        </button>
        
        <button class="btn btn-secondary" id="backBtn" style="width: 100%;">
          ← Back to Menu
        </button>
      </div>
      
      <div class="card" style="margin-top: 32px; max-width: 400px; width: 100%;">
        <h3 style="font-family: var(--font-display); font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px;">🌐 ONLINE ROOMS</h3>
        <div id="roomList" style="color: var(--text-muted); text-align: center; padding: 20px;">
          Loading rooms...
        </div>
        <button class="btn btn-secondary" id="refreshBtn" style="width: 100%; margin-top: 12px;">
          🔄 Refresh Room List
        </button>
      </div>
    </div>
  `;
  
  // Connect to server
  connectToServer();
  
  // Load room list
  loadRoomList();
  
  document.getElementById('createRoomBtn').addEventListener('click', () => {
    showCreateRoomScreen(container, onBack);
  });
  
  document.getElementById('joinRoomBtn').addEventListener('click', () => {
    showJoinRoomScreen(container, onBack);
  });
  
  document.getElementById('localGameBtn').addEventListener('click', () => {
    showLocalSetupScreen(container, onBack);
  });
  
  document.getElementById('backBtn').addEventListener('click', onBack);
  
  document.getElementById('refreshBtn').addEventListener('click', loadRoomList);
}

async function loadRoomList() {
  const roomListEl = document.getElementById('roomList');
  if (!roomListEl) return;
  
  const rooms = await getRoomList();
  
  if (rooms.length === 0) {
    roomListEl.innerHTML = '<p style="color: var(--text-muted);">No active rooms. Create one!</p>';
  } else {
    roomListEl.innerHTML = rooms.map(room => `
      <div class="asset-item" style="margin-bottom: 8px; cursor: pointer;" data-join="${room.code}">
        <span>🎮 ${room.code}</span>
        <span style="color: var(--accent-blue);">${room.players}/${room.maxPlayers} players</span>
      </div>
    `).join('');
    
    roomListEl.querySelectorAll('[data-join]').forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('roomCodeInput')?.setAttribute('value', el.dataset.join);
        showJoinRoomScreen(document.getElementById('app'), () => renderMultiplayerMenu(document.getElementById('app'), () => window.location.reload()));
      });
    });
  }
}

function showCreateRoomScreen(container, onBack) {
  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
      <div class="screen-title">🏠 CREATE ROOM</div>
      <div class="screen-subtitle">Choose your character and settings</div>
      
      <div class="card" style="max-width: 400px; width: 100%; margin-top: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Your Name</label>
          <input type="text" id="playerName" placeholder="Enter your name..." value="Player"
            style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-main); font-size: 16px;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Character</label>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary bg-select selected" data-bg="employee" style="flex: 1;">👔 Employee</button>
            <button class="btn btn-secondary bg-select" data-bg="student" style="flex: 1;">🎓 Student</button>
            <button class="btn btn-secondary bg-select" data-bg="entrepreneur" style="flex: 1;">💼 Business</button>
          </div>
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Max Players</label>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary max-select" data-max="2" style="flex: 1;">2</button>
            <button class="btn btn-secondary max-select" data-max="4" style="flex: 1;">4</button>
            <button class="btn btn-secondary max-select selected" data-max="6" style="flex: 1;">6</button>
          </div>
        </div>
        
        <button class="btn btn-success" id="createBtn" style="width: 100%;">
          🚀 Create Room
        </button>
      </div>
      
      <button class="btn btn-secondary" id="backBtn" style="margin-top: 16px; max-width: 400px; width: 100%;">
        ← Back
      </button>
    </div>
  `;
  
  let selectedBg = 'employee';
  let selectedMax = 6;
  
  container.querySelectorAll('.bg-select').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.bg-select').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedBg = btn.dataset.bg;
    });
  });
  
  container.querySelectorAll('.max-select').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.max-select').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMax = parseInt(btn.dataset.max);
    });
  });
  
  document.getElementById('createBtn').addEventListener('click', async () => {
    const name = document.getElementById('playerName').value.trim() || 'Player';
    try {
      const data = await createRoom(name, selectedBg, selectedMax);
      showToast(`Room created! Code: ${data.code}`, 'success');
      renderLobbyScreen(container, data.code, true, onBack);
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
  
  document.getElementById('backBtn').addEventListener('click', () => {
    renderMultiplayerMenu(container, onBack);
  });
}

function showJoinRoomScreen(container, onBack) {
  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
      <div class="screen-title">🚪 JOIN ROOM</div>
      <div class="screen-subtitle">Enter the room code to join</div>
      
      <div class="card" style="max-width: 400px; width: 100%; margin-top: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Room Code</label>
          <input type="text" id="roomCodeInput" placeholder="e.g., RAT7K2" maxlength="6" 
            style="width: 100%; padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-display); 
            font-size: 24px; text-align: center; letter-spacing: 8px; text-transform: uppercase;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Your Name</label>
          <input type="text" id="playerName" placeholder="Enter your name..." value="Player"
            style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-main); font-size: 16px;">
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Character</label>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary bg-select selected" data-bg="employee" style="flex: 1;">👔</button>
            <button class="btn btn-secondary bg-select" data-bg="student" style="flex: 1;">🎓</button>
            <button class="btn btn-secondary bg-select" data-bg="entrepreneur" style="flex: 1;">💼</button>
          </div>
        </div>
        
        <button class="btn btn-primary" id="joinBtn" style="width: 100%;">
          🚪 Join Room
        </button>
      </div>
      
      <button class="btn btn-secondary" id="backBtn" style="margin-top: 16px; max-width: 400px; width: 100%;">
        ← Back
      </button>
    </div>
  `;
  
  let selectedBg = 'employee';
  
  container.querySelectorAll('.bg-select').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.bg-select').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedBg = btn.dataset.bg;
    });
  });
  
  document.getElementById('joinBtn').addEventListener('click', async () => {
    const code = document.getElementById('roomCodeInput').value.trim().toUpperCase();
    const name = document.getElementById('playerName').value.trim() || 'Player';
    
    if (code.length !== 6) {
      showToast('Room code must be 6 characters!', 'error');
      return;
    }
    
    try {
      await joinRoom(code, name, selectedBg);
      showToast(`Joined room ${code}!`, 'success');
      renderLobbyScreen(container, code, false, onBack);
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
  
  document.getElementById('backBtn').addEventListener('click', () => {
    renderMultiplayerMenu(container, onBack);
  });
}

function renderLobbyScreen(container, roomCode, isHost, onBack) {
  let gameState = null;
  let chatMessages = [];
  
  function updateLobby(state) {
    gameState = state;
    const playerList = document.getElementById('playerList');
    const startBtn = document.getElementById('startBtn');
    const readyBtn = document.getElementById('readyBtn');
    const waitingText = document.getElementById('waitingText');
    
    if (playerList) {
      playerList.innerHTML = state.players.map(p => `
        <div class="leaderboard-entry ${p.isCurrentTurn ? 'glow' : ''}">
          <span class="leaderboard-rank">${p.isHost ? '👑' : p.ready ? '✅' : '⏳'}</span>
          <span class="leaderboard-name">${p.name}</span>
          <span class="leaderboard-value text-muted">${p.background}</span>
        </div>
      `).join('');
    }
    
    if (startBtn) {
      startBtn.disabled = !isHost || !state.players.every(p => p.ready) || state.players.length < 2;
      startBtn.textContent = isHost ? '🚀 Start Game!' : 'Waiting for host...';
    }
    
    if (waitingText) {
      waitingText.textContent = `${state.players.length}/${state.maxPlayers} players`;
    }
  }
  
  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
      <div class="screen-title">🎮 GAME LOBBY</div>
      
      <div class="card" style="max-width: 500px; width: 100%; margin-top: 24px; text-align: center;">
        <div style="margin-bottom: 16px;">
          <div style="color: var(--text-secondary); margin-bottom: 8px;">Room Code</div>
          <div style="font-family: var(--font-display); font-size: 32px; letter-spacing: 8px; color: var(--accent-green);">
            ${roomCode}
          </div>
          <div style="color: var(--text-muted); font-size: 12px; margin-top: 8px;">Share this code with friends!</div>
        </div>
        
        <div id="waitingText" style="color: var(--accent-blue); margin-bottom: 16px;">Loading...</div>
        
        <div style="text-align: left; margin-bottom: 16px;">
          <h3 style="font-family: var(--font-display); font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px;">👥 PLAYERS</h3>
          <div id="playerList"></div>
        </div>
        
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary" id="readyBtn" style="flex: 1;">
            ✅ Ready
          </button>
          <button class="btn btn-success" id="startBtn" style="flex: 2;" disabled>
            Waiting for host...
          </button>
        </div>
      </div>
      
      <!-- Chat -->
      <div class="card" style="max-width: 500px; width: 100%; margin-top: 16px;">
        <h3 style="font-family: var(--font-display); font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px;">💬 CHAT</h3>
        <div id="chatMessages" style="height: 150px; overflow-y: auto; margin-bottom: 12px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm);">
          <div style="color: var(--text-muted); text-align: center; padding: 20px;">Chat messages will appear here...</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="chatInput" placeholder="Type a message..." 
            style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-main);">
          <button class="btn btn-primary" id="sendChatBtn">Send</button>
        </div>
      </div>
      
      <button class="btn btn-danger" id="leaveBtn" style="margin-top: 16px; max-width: 500px; width: 100%;">
        🚪 Leave Room
      </button>
    </div>
  `;
  
  // Setup event handlers
  onGameEvent('game:state', updateLobby);
  
  onGameEvent('lobby:playerJoined', (data) => {
    showToast(`${data.name} joined the room!`, 'info');
  });
  
  onGameEvent('lobby:playerLeft', (data) => {
    showToast(`${data.name} left the room.`, 'info');
  });
  
  onGameEvent('chat:message', (data) => {
    chatMessages.push(data);
    const chatEl = document.getElementById('chatMessages');
    if (chatEl) {
      chatEl.innerHTML = chatMessages.map(m => `
        <div style="margin-bottom: 4px;">
          <span style="color: var(--accent-blue); font-weight: 600;">${m.name}:</span>
          <span style="color: var(--text-secondary);">${m.message}</span>
        </div>
      `).join('');
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  });
  
  onGameEvent('game:started', (state) => {
    showToast('Game started!', 'success');
    // TODO: Transition to multiplayer game view
  });
  
  document.getElementById('readyBtn').addEventListener('click', () => {
    toggleReady();
  });
  
  document.getElementById('startBtn').addEventListener('click', () => {
    if (isHost) {
      startGame();
    }
  });
  
  document.getElementById('sendChatBtn').addEventListener('click', () => {
    const input = document.getElementById('chatInput');
    if (input.value.trim()) {
      sendChat(input.value.trim());
      input.value = '';
    }
  });
  
  document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('sendChatBtn').click();
    }
  });
  
  document.getElementById('leaveBtn').addEventListener('click', () => {
    leaveRoom();
    renderMultiplayerMenu(container, onBack);
  });
}

// Local Hot-Seat Mode
function showLocalSetupScreen(container, onBack) {
  container.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px;">
      <div class="screen-title">📱 LOCAL HOT-SEAT</div>
      <div class="screen-subtitle">Pass and play on the same device</div>
      
      <div class="card" style="max-width: 500px; width: 100%; margin-top: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Number of Players</label>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary count-select" data-count="2" style="flex: 1;">2</button>
            <button class="btn btn-secondary count-select selected" data-count="3" style="flex: 1;">3</button>
            <button class="btn btn-secondary count-select" data-count="4" style="flex: 1;">4</button>
            <button class="btn btn-secondary count-select" data-count="5" style="flex: 1;">5</button>
            <button class="btn btn-secondary count-select" data-count="6" style="flex: 1;">6</button>
          </div>
        </div>
        
        <div id="playerInputs" style="margin-bottom: 24px;">
          <!-- Player inputs will be generated here -->
        </div>
        
        <button class="btn btn-success" id="startBtn" style="width: 100%;">
          🚀 Start Local Game
        </button>
      </div>
      
      <button class="btn btn-secondary" id="backBtn" style="margin-top: 16px; max-width: 500px; width: 100%;">
        ← Back
      </button>
    </div>
  `;
  
  let playerCount = 3;
  
  function updatePlayerInputs() {
    const inputsEl = document.getElementById('playerInputs');
    inputsEl.innerHTML = Array(playerCount).fill(0).map((_, i) => `
      <div class="card" style="margin-bottom: 8px; padding: 12px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-family: var(--font-display); color: var(--accent-blue); min-width: 30px;">P${i + 1}</span>
          <input type="text" class="local-player-name" data-index="${i}" placeholder="Player ${i + 1}" value="Player ${i + 1}"
            style="flex: 1; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-main);">
          <select class="local-player-bg" data-index="${i}"
            style="padding: 8px; background: var(--bg-card); border: 1px solid var(--border-color);
            border-radius: var(--radius-sm); color: var(--text-primary);">
            <option value="employee">👔 Employee</option>
            <option value="student">🎓 Student</option>
            <option value="entrepreneur">💼 Entrepreneur</option>
          </select>
        </div>
      </div>
    `).join('');
  }
  
  updatePlayerInputs();
  
  container.querySelectorAll('.count-select').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.count-select').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      playerCount = parseInt(btn.dataset.count);
      updatePlayerInputs();
    });
  });
  
  document.getElementById('startBtn').addEventListener('click', () => {
    const players = [];
    document.querySelectorAll('.local-player-name').forEach(input => {
      const index = parseInt(input.dataset.index);
      const bgSelect = document.querySelector(`.local-player-bg[data-index="${index}"]`);
      players.push({
        name: input.value.trim() || `Player ${index + 1}`,
        background: bgSelect.value
      });
    });
    
    // Start local game
    startLocalGame(container, players, onBack);
  });
  
  document.getElementById('backBtn').addEventListener('click', () => {
    renderMultiplayerMenu(container, onBack);
  });
}

function startLocalGame(container, players, onBack) {
  // Store local players in window for main.js to access
  window.localPlayers = players;
  window.isLocalMultiplayer = true;
  
  // Reload to start local game (main.js will check for localPlayers)
  showToast('Starting local game...', 'success');
  
  // Use a custom event to notify main.js
  window.dispatchEvent(new CustomEvent('startLocalGame', { detail: players }));
}

// Toast notification
function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
