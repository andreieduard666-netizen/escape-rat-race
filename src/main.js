// Main entry point - Escape the Rat Race
import { GameEngine } from './game/engine.js';
import { renderDashboard, showEventModal } from './ui/dashboard.js';
import { renderMultiplayerMenu, disconnectFromServer } from './ui/multiplayer.js';

const game = new GameEngine();
const app = document.getElementById('app');

// Check for saved game
const savedGame = localStorage.getItem('ratrace_save');

// Set up game callbacks
game.onEvent = (event) => {
  if (event) {
    showEventModal(app, event, game);
  }
};

game.onMonthEnd = (result) => {
  // Dashboard will re-render after month end
};

game.onGameOver = (player, reason) => {
  showGameOver(reason);
};

game.onVictory = (player) => {
  showVictory();
};

// Show title screen
showTitleScreen();

// Title Screen
function showTitleScreen() {
  app.innerHTML = `
    <div id="title-screen" class="screen active">
      <div class="title-logo">🐀 ESCAPE THE RAT RACE</div>
      <div class="title-subtitle">A Financial Freedom Game inspired by Robert Kiyosaki</div>
      
      <div class="title-menu">
        ${savedGame ? `
          <button class="btn btn-success" id="continueBtn">
            ▶️ Continue Game
          </button>
        ` : ''}
        
        <button class="btn btn-primary" id="newGameBtn">
          🎮 New Game
        </button>
        
        <button class="btn btn-secondary" id="howToBtn">
          📖 How to Play
        </button>
        
        <button class="btn btn-primary" id="multiplayerBtn">
          👥 Multiplayer
          <span style="display: block; font-size: 11px; font-weight: normal; color: rgba(255,255,255,0.7);">Online & Local</span>
        </button>
      </div>
      
      <div style="margin-top: 40px; color: var(--text-muted); font-size: 12px; text-align: center;">
        <p>"The rich don't work for money. They make money work for them."</p>
        <p style="margin-top: 4px;">— Robert Kiyosaki</p>
      </div>
    </div>
  `;
  
  // Continue button
  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (game.loadGame(savedGame)) {
        renderDashboard(app, game);
      } else {
        alert('Failed to load save game. Starting new game.');
        showCharacterSelect();
      }
    });
  }
  
  // New game button
  document.getElementById('newGameBtn').addEventListener('click', () => {
    showCharacterSelect();
  });
  
  // How to play button
  document.getElementById('howToBtn').addEventListener('click', () => {
    showHowToPlay();
  });
  
  // Multiplayer button
  document.getElementById('multiplayerBtn').addEventListener('click', () => {
    renderMultiplayerMenu(app, () => showTitleScreen());
  });
}

// Character Select Screen
function showCharacterSelect() {
  app.innerHTML = `
    <div id="character-screen" class="screen active">
      <div class="screen-title">CHOOSE YOUR PATH</div>
      <div class="screen-subtitle">Each background offers a different challenge</div>
      
      <div class="character-grid">
        <div class="character-card" data-bg="student">
          <div class="char-icon">🎓</div>
          <div class="char-name">Student</div>
          <div class="char-desc">Fresh out of school with debt but time to learn</div>
          <div class="char-stats">
            <div class="char-stat">
              <span class="char-stat-label">Cash</span>
              <span>$500</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Income</span>
              <span>$1,500</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Expenses</span>
              <span>$1,200</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Debt</span>
              <span class="text-red">$25,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">FinIQ</span>
              <span>5</span>
            </div>
          </div>
          <div class="char-perk">⚡ Low expenses, high debt. Learning mode.</div>
        </div>
        
        <div class="character-card selected" data-bg="employee">
          <div class="char-icon">👔</div>
          <div class="char-name">Employee</div>
          <div class="char-desc">Stable job, moderate debt, classic rat race</div>
          <div class="char-stats">
            <div class="char-stat">
              <span class="char-stat-label">Cash</span>
              <span>$2,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Income</span>
              <span>$3,500</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Expenses</span>
              <span>$3,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Debt</span>
              <span class="text-red">$5,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">FinIQ</span>
              <span>10</span>
            </div>
          </div>
          <div class="char-perk">⚡ Balanced start. Recommended for beginners.</div>
        </div>
        
        <div class="character-card" data-bg="entrepreneur">
          <div class="char-icon">💼</div>
          <div class="char-name">Entrepreneur</div>
          <div class="char-desc">Started a business with some assets already</div>
          <div class="char-stats">
            <div class="char-stat">
              <span class="char-stat-label">Cash</span>
              <span>$5,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Income</span>
              <span>$2,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Expenses</span>
              <span>$2,500</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">Debt</span>
              <span class="text-red">$10,000</span>
            </div>
            <div class="char-stat">
              <span class="char-stat-label">FinIQ</span>
              <span>20</span>
            </div>
          </div>
          <div class="char-perk">⚡ Higher FinIQ, starts with a business asset!</div>
        </div>
      </div>
      
      <div style="margin-top: 24px; width: 100%; max-width: 400px;">
        <div class="card" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Your Name</label>
          <input type="text" id="playerName" placeholder="Enter your name..." value="Player" 
            style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); 
            border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-main); font-size: 16px;">
        </div>
        
        <button class="btn btn-success select-character-btn" id="startGameBtn" style="width: 100%;">
          🚀 START GAME
        </button>
        
        <button class="btn btn-secondary" id="backBtn" style="width: 100%; margin-top: 12px;">
          ← Back to Menu
        </button>
      </div>
    </div>
  `;
  
  // Character selection
  let selectedBg = 'employee';
  const cards = document.querySelectorAll('.character-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedBg = card.dataset.bg;
    });
  });
  
  // Start game button
  document.getElementById('startGameBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim() || 'Player';
    game.startGame(name, selectedBg);
    renderDashboard(app, game);
    localStorage.removeItem('ratrace_save'); // Clear old save
  });
  
  // Back button
  document.getElementById('backBtn').addEventListener('click', () => {
    showTitleScreen();
  });
}

// How to Play Screen
function showHowToPlay() {
  app.innerHTML = `
    <div id="howto-screen" class="screen active">
      <div class="screen-title">📖 HOW TO PLAY</div>
      <div class="screen-subtitle">Learn the rules of financial freedom</div>
      
      <div class="howto-content">
        <div class="card howto-section">
          <h3>🎯 OBJECTIVE</h3>
          <p>Escape the Rat Race by building <strong>passive income</strong> that exceeds your monthly expenses.</p>
          <p style="margin-top: 8px;">When your passive income > expenses for <strong>3 consecutive months</strong>, you WIN!</p>
        </div>
        
        <div class="card howto-section">
          <h3>⏱️ GAME FLOW</h3>
          <ul>
            <li>Each turn = 1 month of life</li>
            <li>You get 3 Action Points (AP) per turn</li>
            <li>Use actions to earn, invest, and learn</li>
            <li>End your turn to process the month</li>
            <li>Random events can help or hurt you</li>
          </ul>
        </div>
        
        <div class="card howto-section">
          <h3>⚡ ACTIONS</h3>
          <ul>
            <li><strong>💼 Work Job</strong> — Earn stable monthly income</li>
            <li><strong>💡 Side Hustle</strong> — Extra income with some risk</li>
            <li><strong>📈 Invest</strong> — Buy assets that generate passive income</li>
            <li><strong>📚 Learn</strong> — Increase Financial IQ (unlocks better options)</li>
            <li><strong>💰 Pay Debt</strong> — Reduce liabilities and monthly payments</li>
            <li><strong>😴 Rest</strong> — Recover energy and reduce stress</li>
          </ul>
        </div>
        
        <div class="card howto-section">
          <h3>📊 KEY STATS</h3>
          <ul>
            <li><strong>💰 Money</strong> — Your cash on hand</li>
            <li><strong>📈 Income</strong> — What you earn each month</li>
            <li><strong>📉 Expenses</strong> — What you spend each month</li>
            <li><strong>🏠 Assets</strong> — Things that MAKE you money (passive income)</li>
            <li><strong>💳 Liabilities</strong> — Things that COST you money (debt payments)</li>
            <li><strong>🧠 Financial IQ</strong> — Your knowledge level (unlocks better decisions)</li>
            <li><strong>⚡ Energy</strong> — Limits your actions (refills each month)</li>
            <li><strong>😰 Stress</strong> — High stress = bad outcomes</li>
          </ul>
        </div>
        
        <div class="card howto-section">
          <h3>💡 KIYOSAKI'S KEY CONCEPT</h3>
          <p style="font-size: 16px; color: var(--accent-gold); font-style: italic; margin-bottom: 12px;">
            "The rich acquire assets. The poor acquire liabilities. The middle class acquire liabilities they think are assets."
          </p>
          <ul>
            <li><strong>Assets</strong> put money IN your pocket (rental income, dividends, business profits)</li>
            <li><strong>Liabilities</strong> take money OUT of your pocket (car payments, credit cards, loans)</li>
            <li>Focus on buying assets, not liabilities!</li>
          </ul>
        </div>
        
        <div class="card howto-section">
          <h3>🏆 WIN & LOSE</h3>
          <ul>
            <li><strong>WIN:</strong> Passive income > Expenses for 3 consecutive months</li>
            <li><strong>LOSE:</strong> Go bankrupt (money below -$5,000) or Stress reaches 100</li>
          </ul>
        </div>
        
        <div class="card howto-section">
          <h3>⚠️ RANDOM EVENTS</h3>
          <ul>
            <li><strong>Positive:</strong> Tax refunds, bonuses, mentor found</li>
            <li><strong>Negative:</strong> Car breakdowns, rent increases, market dips</li>
            <li><strong>Boss Events:</strong> Economic recession, job loss (rare but devastating)</li>
            <li><strong>Decisions:</strong> Choice scenarios that test your financial wisdom</li>
          </ul>
        </div>
        
        <div class="card howto-section">
          <h3>🎮 TIPS FOR SUCCESS</h3>
          <ul>
            <li>Pay off high-interest debt first (credit cards)</li>
            <li>Increase your Financial IQ to unlock better options</li>
            <li>Don't upgrade your lifestyle too fast</li>
            <li>Build multiple income streams</li>
            <li>Keep some cash for emergencies</li>
            <li>Rest when stress is high</li>
          </ul>
        </div>
      </div>
      
      <button class="btn btn-primary back-btn" id="backToMenuBtn">
        ← Back to Menu
      </button>
    </div>
  `;
  
  document.getElementById('backToMenuBtn').addEventListener('click', () => {
    showTitleScreen();
  });
}

// Game Over Screen
function showGameOver(reason) {
  const status = game.getStatus();
  
  let reasonText = '';
  let icon = '💀';
  if (reason === 'bankruptcy') {
    reasonText = game.player.stress >= 100 
      ? 'Burnout! Your stress reached 100%.'
      : 'Bankruptcy! Your money dropped below -$5,000.';
  } else if (reason === 'timeout') {
    reasonText = '10 years passed and you\'re still in the rat race.';
    icon = '⏰';
  }
  
  app.innerHTML = `
    <div id="gameover-screen" class="screen active">
      <div class="gameover-icon">${icon}</div>
      <div class="gameover-title" style="color: var(--accent-red);">GAME OVER</div>
      <div class="gameover-subtitle">${reasonText}</div>
      
      <div class="gameover-stats">
        <div class="card gameover-stat">
          <div class="label">Months Played</div>
          <div class="value">${status.month}</div>
        </div>
        <div class="card gameover-stat">
          <div class="label">Final Net Worth</div>
          <div class="value ${status.netWorth >= 0 ? 'text-green' : 'text-red'}">$${status.netWorth.toLocaleString()}</div>
        </div>
        <div class="card gameover-stat">
          <div class="label">Passive Income</div>
          <div class="value text-blue">$${status.passiveIncome}/mo</div>
        </div>
        <div class="card gameover-stat">
          <div class="label">Financial IQ</div>
          <div class="value">${status.finIQ}</div>
        </div>
      </div>
      
      <div class="card" style="max-width: 400px; margin-bottom: 24px; text-align: center;">
        <p style="color: var(--accent-gold); font-style: italic; margin-bottom: 8px;">
          "Failure is part of the process of success. People who avoid failure also avoid success."
        </p>
        <p style="color: var(--text-muted);">— Robert Kiyosaki</p>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px; width: 100%;">
        <button class="btn btn-primary" id="retryBtn" style="width: 100%;">
          🔄 Try Again
        </button>
        <button class="btn btn-secondary" id="menuBtn" style="width: 100%;">
          🏠 Main Menu
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('retryBtn').addEventListener('click', () => {
    showCharacterSelect();
  });
  
  document.getElementById('menuBtn').addEventListener('click', () => {
    localStorage.removeItem('ratrace_save');
    showTitleScreen();
  });
}

// Victory Screen
function showVictory() {
  const status = game.getStatus();
  
  app.innerHTML = `
    <div id="gameover-screen" class="screen active">
      <div class="gameover-icon">🎉</div>
      <div class="gameover-title" style="color: var(--accent-green);">YOU ESCAPED!</div>
      <div class="gameover-subtitle">Congratulations! You've escaped the rat race!</div>
      
      <div class="gameover-stats">
        <div class="card gameover-stat">
          <div class="label">Months to Escape</div>
          <div class="value text-gold">${status.month}</div>
        </div>
        <div class="card gameover-stat">
          <div class="label">Final Net Worth</div>
          <div class="value text-green">$${status.netWorth.toLocaleString()}</div>
        </div>
        <div class="card gameover-stat">
          <div class="label">Passive Income</div>
          <div class="value text-green">$${status.passiveIncome}/mo</div>
        </div>
        <div class="card gameover-stat">
          <div class="label">Level Reached</div>
          <div class="value text-gold">${status.level}</div>
        </div>
      </div>
      
      <div class="card" style="max-width: 400px; margin-bottom: 24px; text-align: center;">
        <p style="color: var(--accent-green); font-size: 18px; margin-bottom: 8px;">
          🏆 FINANCIAL FREEDOM ACHIEVED! 🏆
        </p>
        <p style="color: var(--text-secondary);">
          Your passive income ($${status.passiveIncome}/mo) now exceeds your expenses ($${status.expenses}/mo)!
        </p>
      </div>
      
      <div class="card" style="max-width: 400px; margin-bottom: 24px; text-align: center;">
        <p style="color: var(--accent-gold); font-style: italic; margin-bottom: 8px;">
          "Financial freedom is available to those who learn about it and work for it."
        </p>
        <p style="color: var(--text-muted);">— Robert Kiyosaki</p>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px; width: 100%;">
        <button class="btn btn-success" id="playAgainBtn" style="width: 100%;">
          🎮 Play Again
        </button>
        <button class="btn btn-secondary" id="menuBtn2" style="width: 100%;">
          🏠 Main Menu
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('playAgainBtn').addEventListener('click', () => {
    localStorage.removeItem('ratrace_save');
    showCharacterSelect();
  });
  
  document.getElementById('menuBtn2').addEventListener('click', () => {
    localStorage.removeItem('ratrace_save');
    showTitleScreen();
  });
}

// Local Multiplayer Support
let localPlayers = [];
let currentPlayerIndex = 0;
let localGames = [];

window.addEventListener('startLocalGame', (e) => {
  startLocalMultiplayer(e.detail);
});

function startLocalMultiplayer(players) {
  localPlayers = players;
  currentPlayerIndex = 0;
  localGames = [];
  
  // Create a game instance for each player
  players.forEach(p => {
    const g = new GameEngine();
    g.startGame(p.name, p.background);
    localGames.push(g);
  });
  
  showLocalGameScreen();
}

function showLocalGameScreen() {
  const currentPlayer = localPlayers[currentPlayerIndex];
  const currentGame = localGames[currentPlayerIndex];
  const status = currentGame.getStatus();
  
  // Check for winners
  const winners = [];
  localGames.forEach((g, i) => {
    if (g.player.hasEscaped) {
      winners.push(localPlayers[i].name);
    }
  });
  
  if (winners.length > 0) {
    showLocalVictory(winners);
    return;
  }
  
  // Check if all bankrupt
  const allBankrupt = localGames.every(g => g.player.isBankrupt);
  if (allBankrupt) {
    showLocalGameOver();
    return;
  }
  
  // Skip bankrupt players
  if (currentGame.player.isBankrupt) {
    nextLocalPlayer();
    return;
  }
  
  app.innerHTML = `
    <div class="screen active" style="display: flex; flex-direction: column; min-height: 100vh;">
      <!-- Pass Device Screen -->
      <div id="passScreen" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg-primary); 
        display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100;">
        <div style="font-size: 64px; margin-bottom: 20px;">📱</div>
        <div style="font-family: var(--font-display); font-size: 28px; color: var(--accent-green); margin-bottom: 8px;">
          Pass to:
        </div>
        <div style="font-family: var(--font-display); font-size: 36px; color: var(--accent-blue); margin-bottom: 32px;">
          ${currentPlayer.name}
        </div>
        <div style="color: var(--text-secondary); margin-bottom: 24px;">
          Player ${currentPlayerIndex + 1} of ${localPlayers.length}
        </div>
        <button class="btn btn-success" id="readyBtn" style="padding: 20px 40px; font-size: 18px;">
          ✓ I'm ${currentPlayer.name} - Ready!
        </button>
      </div>
      
      <!-- Game Dashboard -->
      <div id="localDashboard" style="display: none;">
        <div class="top-bar">
          <div class="top-bar-left">
            <span class="game-title-small">🐀 LOCAL GAME</span>
            <span class="month-display">📅 Month ${status.month}</span>
            <span style="color: var(--accent-gold); font-weight: 600;">🎮 ${currentPlayer.name}'s Turn</span>
          </div>
          <div class="top-bar-stats">
            <div class="stat-pill ${status.money >= 0 ? 'positive' : 'negative'}">
              <span class="icon">💰</span>
              <span>$${status.money.toLocaleString()}</span>
            </div>
            <div class="stat-pill positive">
              <span class="icon">📈</span>
              <span>+$${status.income.toLocaleString()}</span>
            </div>
            <div class="stat-pill negative">
              <span class="icon">📉</span>
              <span>-$${status.expenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content" style="max-width: 1200px;">
          <!-- Left Panel - Stats & Other Players -->
          <div class="left-panel">
            <div class="card stats-card">
              <h3>📊 ${currentPlayer.name}'S STATS</h3>
              <div class="stat-row">
                <span class="stat-label">Passive Income</span>
                <span class="stat-value positive">$${status.passiveIncome}/mo</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Financial IQ</span>
                <span class="stat-value">${status.finIQ}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Net Worth</span>
                <span class="stat-value ${status.netWorth >= 0 ? 'positive' : 'negative'}">$${status.netWorth.toLocaleString()}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-label">
                  <span>Escape Progress</span>
                  <span>${status.escapeStreak}/3 months</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill green" style="width: ${(status.escapeStreak / 3) * 100}%"></div>
                </div>
              </div>
            </div>
            
            <!-- Other Players Standings -->
            <div class="card leaderboard-card">
              <h3>🏆 STANDINGS</h3>
              ${localGames.map((g, i) => {
                const s = g.getStatus();
                const isCurrent = i === currentPlayerIndex;
                return `
                  <div class="leaderboard-entry" style="${isCurrent ? 'background: rgba(0,170,255,0.1); border-radius: 8px; padding: 8px;' : ''}">
                    <span class="leaderboard-rank">${g.player.isBankrupt ? '❌' : g.player.hasEscaped ? '🏆' : isCurrent ? '▶️' : '○'}</span>
                    <span class="leaderboard-name">${localPlayers[i].name}</span>
                    <span class="leaderboard-value ${s.netWorth >= 0 ? 'text-green' : 'text-red'}">$${s.netWorth.toLocaleString()}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Center Panel - Actions -->
          <div class="center-panel">
            <div class="card ap-display">
              <div class="label">ACTION POINTS</div>
              <div class="ap-dots">
                ${Array(status.maxActionPoints).fill(0).map((_, i) => 
                  `<div class="ap-dot ${i >= status.actionPoints ? 'used' : ''}"></div>`
                ).join('')}
              </div>
            </div>
            
            <div class="card">
              <h3 style="font-family: var(--font-display); font-size: 12px; color: var(--text-secondary); margin-bottom: 16px; letter-spacing: 2px;">⚡ ACTIONS</h3>
              <div class="actions-grid">
                <button class="action-btn" data-action="work" ${status.actionPoints < 1 ? 'disabled' : ''}>
                  <span class="action-icon">💼</span>
                  <span class="action-name">Work Job</span>
                  <span class="action-cost">1 AP</span>
                </button>
                <button class="action-btn" data-action="hustle" ${status.actionPoints < 1 ? 'disabled' : ''}>
                  <span class="action-icon">💡</span>
                  <span class="action-name">Side Hustle</span>
                  <span class="action-cost">1 AP</span>
                </button>
                <button class="action-btn" data-action="invest" ${status.actionPoints < 1 ? 'disabled' : ''}>
                  <span class="action-icon">📈</span>
                  <span class="action-name">Invest</span>
                  <span class="action-cost">1 AP</span>
                </button>
                <button class="action-btn" data-action="learn" ${status.actionPoints < 1 ? 'disabled' : ''}>
                  <span class="action-icon">📚</span>
                  <span class="action-name">Learn</span>
                  <span class="action-cost">1 AP</span>
                </button>
                <button class="action-btn" data-action="debt" ${status.actionPoints < 1 || status.liabilities.length === 0 ? 'disabled' : ''}>
                  <span class="action-icon">💰</span>
                  <span class="action-name">Pay Debt</span>
                  <span class="action-cost">1 AP</span>
                </button>
                <button class="action-btn" data-action="rest" ${status.actionPoints < 1 ? 'disabled' : ''}>
                  <span class="action-icon">😴</span>
                  <span class="action-name">Rest</span>
                  <span class="action-cost">1 AP</span>
                </button>
              </div>
            </div>
            
            <button class="btn btn-success end-turn-btn" id="endTurnBtn" style="width: 100%; padding: 16px; font-size: 16px;">
              ⏭️ END TURN (Next Player)
            </button>
          </div>
          
          <!-- Right Panel - Assets/Liabilities -->
          <div class="right-panel">
            <div class="card stats-card">
              <h3>🏠 ASSETS (${status.assets.length})</h3>
              <div class="asset-list">
                ${status.assets.length === 0 ? 
                  '<div class="empty-list">No assets yet.</div>' :
                  status.assets.map(a => `
                    <div class="asset-item">
                      <span>${a.icon} ${a.name}</span>
                      <span class="income">+$${Math.floor((a.monthlyIncome.min + a.monthlyIncome.max) / 2)}/mo</span>
                    </div>
                  `).join('')
                }
              </div>
            </div>
            
            <div class="card stats-card">
              <h3>💳 LIABILITIES (${status.liabilities.length})</h3>
              <div class="liability-list">
                ${status.liabilities.length === 0 ? 
                  '<div class="empty-list" style="color: var(--accent-green);">Debt free! 🎉</div>' :
                  status.liabilities.map(l => `
                    <div class="liability-item">
                      <span>${l.icon} ${l.name}</span>
                      <span class="payment">-$${l.monthlyPayment}/mo</span>
                    </div>
                  `).join('')
                }
              </div>
            </div>
            
            <button class="btn btn-danger" id="exitLocalBtn" style="width: 100%;">
              🚪 Exit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Handle ready button
  document.getElementById('readyBtn').addEventListener('click', () => {
    document.getElementById('passScreen').style.display = 'none';
    document.getElementById('localDashboard').style.display = 'block';
  });
  
  // Handle actions
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      handleLocalAction(action);
    });
  });
  
  document.getElementById('endTurnBtn').addEventListener('click', () => {
    currentGame.endTurn();
    nextLocalPlayer();
  });
  
  document.getElementById('exitLocalBtn').addEventListener('click', () => {
    if (confirm('Exit local game?')) {
      localPlayers = [];
      localGames = [];
      showTitleScreen();
    }
  });
}

function handleLocalAction(action) {
  const currentGame = localGames[currentPlayerIndex];
  let result;
  
  switch (action) {
    case 'work':
      showLocalWorkModal();
      return;
    case 'hustle':
      showLocalHustleModal();
      return;
    case 'invest':
      showLocalInvestModal();
      return;
    case 'learn':
      showLocalLearnModal();
      return;
    case 'debt':
      showLocalDebtModal();
      return;
    case 'rest':
      result = currentGame.doRest();
      break;
  }
  
  if (result && result.success) {
    showToast(result.message, 'success');
    showLocalGameScreen();
  } else if (result) {
    showToast(result.message, 'error');
  }
}

function showLocalWorkModal() {
  const currentGame = localGames[currentPlayerIndex];
  const jobs = currentGame.player.getAvailableJobs();
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">💼</span>
        <span class="modal-title">Choose a Job</span>
      </div>
      <div class="modal-choices">
        ${jobs.map(j => `
          <button class="btn btn-secondary choice-btn" data-job="${j.id}">
            <span>${j.icon} ${j.name}</span>
            <span style="margin-left: auto; color: var(--accent-green);">$${j.income}/mo</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary" id="cancelModal" style="width: 100%; margin-top: 16px;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('[data-job]').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = currentGame.doWork(btn.dataset.job);
      if (result.success) showToast(result.message, 'success');
      else showToast(result.message, 'error');
      modal.remove();
      showLocalGameScreen();
    });
  });
  
  modal.querySelector('#cancelModal').addEventListener('click', () => modal.remove());
}

function showLocalHustleModal() {
  const currentGame = localGames[currentPlayerIndex];
  const hustles = currentGame.player.getAvailableHustles();
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">💡</span>
        <span class="modal-title">Side Hustle</span>
      </div>
      <div class="modal-choices">
        ${hustles.map(h => `
          <button class="btn btn-secondary choice-btn" data-hustle="${h.id}">
            <span>${h.icon} ${h.name}</span>
            <span style="margin-left: auto; color: var(--accent-green);">$${h.baseIncome}-${h.maxIncome}</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary" id="cancelModal" style="width: 100%; margin-top: 16px;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('[data-hustle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = currentGame.doSideHustle(btn.dataset.hustle);
      if (result.success) showToast(result.message, result.failed ? 'error' : 'success');
      else showToast(result.message, 'error');
      modal.remove();
      showLocalGameScreen();
    });
  });
  
  modal.querySelector('#cancelModal').addEventListener('click', () => modal.remove());
}

function showLocalInvestModal() {
  const currentGame = localGames[currentPlayerIndex];
  const assets = currentGame.player.getAvailableAssets();
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">📈</span>
        <span class="modal-title">Buy Asset</span>
      </div>
      <div class="modal-choices">
        ${assets.map(a => `
          <button class="btn btn-secondary choice-btn" data-asset="${a.id}" ${currentGame.player.money < a.cost ? 'disabled' : ''}>
            <div>
              <span>${a.icon} ${a.name}</span>
              <span class="choice-effect">+$${a.monthlyIncome.min}-${a.monthlyIncome.max}/mo</span>
            </div>
            <span style="margin-left: auto; color: var(--accent-red);">$${a.cost.toLocaleString()}</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary" id="cancelModal" style="width: 100%; margin-top: 16px;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('[data-asset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = currentGame.doBuyAsset(btn.dataset.asset);
      if (result.success) showToast(result.message, 'success');
      else showToast(result.message, 'error');
      modal.remove();
      showLocalGameScreen();
    });
  });
  
  modal.querySelector('#cancelModal').addEventListener('click', () => modal.remove());
}

function showLocalLearnModal() {
  const currentGame = localGames[currentPlayerIndex];
  const options = currentGame.player.getAvailableLearning();
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">📚</span>
        <span class="modal-title">Learn</span>
      </div>
      <div class="modal-choices">
        ${options.map(l => `
          <button class="btn btn-secondary choice-btn" data-learn="${l.id}" ${currentGame.player.money < l.cost ? 'disabled' : ''}>
            <span>${l.icon} ${l.name}</span>
            <span style="margin-left: auto; color: var(--accent-blue);">+${l.finIQGain} FinIQ</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary" id="cancelModal" style="width: 100%; margin-top: 16px;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('[data-learn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = currentGame.doLearn(btn.dataset.learn);
      if (result.success) showToast(result.message, 'success');
      else showToast(result.message, 'error');
      modal.remove();
      showLocalGameScreen();
    });
  });
  
  modal.querySelector('#cancelModal').addEventListener('click', () => modal.remove());
}

function showLocalDebtModal() {
  const currentGame = localGames[currentPlayerIndex];
  const liabilities = currentGame.player.liabilities;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">💰</span>
        <span class="modal-title">Pay Debt</span>
      </div>
      <div class="modal-choices">
        ${liabilities.map((l, i) => `
          <button class="btn btn-secondary choice-btn" data-debt="${i}">
            <span>${l.icon} ${l.name}</span>
            <span style="margin-left: auto; color: var(--accent-red);">$${l.balance.toLocaleString()}</span>
          </button>
        `).join('')}
      </div>
      <button class="btn btn-secondary" id="cancelModal" style="width: 100%; margin-top: 16px;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('[data-debt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = currentGame.doPayDebt(parseInt(btn.dataset.debt));
      if (result.success) showToast(result.message, 'success');
      else showToast(result.message, 'error');
      modal.remove();
      showLocalGameScreen();
    });
  });
  
  modal.querySelector('#cancelModal').addEventListener('click', () => modal.remove());
}

function nextLocalPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % localPlayers.length;
  showLocalGameScreen();
}

function showLocalVictory(winners) {
  app.innerHTML = `
    <div id="gameover-screen" class="screen active">
      <div class="gameover-icon">🎉</div>
      <div class="gameover-title" style="color: var(--accent-green);">WE HAVE A WINNER!</div>
      <div class="gameover-subtitle">${winners.join(', ')} escaped the rat race!</div>
      
      <div class="card leaderboard-card" style="max-width: 400px; margin: 24px auto;">
        <h3>🏆 FINAL STANDINGS</h3>
        ${localGames.map((g, i) => {
          const s = g.getStatus();
          const isWinner = winners.includes(localPlayers[i].name);
          return `
            <div class="leaderboard-entry">
              <span class="leaderboard-rank ${isWinner ? 'gold' : ''}">${isWinner ? '🏆' : '○'}</span>
              <span class="leaderboard-name">${localPlayers[i].name}</span>
              <span class="leaderboard-value ${s.netWorth >= 0 ? 'text-green' : 'text-red'}">$${s.netWorth.toLocaleString()}</span>
            </div>
          `;
        }).join('')}
      </div>
      
      <button class="btn btn-primary" onclick="location.reload()" style="max-width: 300px; width: 100%;">
        🎮 Play Again
      </button>
    </div>
  `;
}

function showLocalGameOver() {
  app.innerHTML = `
    <div id="gameover-screen" class="screen active">
      <div class="gameover-icon">💀</div>
      <div class="gameover-title" style="color: var(--accent-red);">GAME OVER</div>
      <div class="gameover-subtitle">All players went bankrupt!</div>
      
      <button class="btn btn-primary" onclick="location.reload()" style="max-width: 300px; width: 100%;">
        🎮 Try Again
      </button>
    </div>
  `;
}
