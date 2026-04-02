// Dashboard - 3 Column Layout
import { CAREERS, SIDE_HUSTLES, LEARNING } from '../data/careers.js';

let chart = null;

export function renderDashboard(container, game) {
  const status = game.getStatus();
  const player = game.player;
  
  container.innerHTML = `
    <div id="dashboard" class="screen active">
      <div class="top-bar">
        <div class="top-bar-left">
          <span class="game-title-small">🐀 ESCAPE THE RAT RACE</span>
          <span class="month-display" style="font-size: 14px; font-weight: bold;">📅 MONTH ${status.month}</span>
        </div>
        <div class="top-bar-stats">
          <div class="stat-pill ${status.money >= 0 ? 'positive' : 'negative'}">
            <span>💰</span><span>$${status.money.toLocaleString()}</span>
          </div>
          <div class="stat-pill positive">
            <span>📈</span><span>+$${status.income.toLocaleString()}</span>
          </div>
          <div class="stat-pill negative">
            <span>📉</span><span>-$${status.expenses.toLocaleString()}</span>
          </div>
          <div class="stat-pill neutral">
            <span>🧠</span><span>FinIQ ${status.finIQ}</span>
          </div>
          <div class="stat-pill neutral">
            <span>⭐</span><span>Lv.${status.level}</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <!-- LEFT -->
        <div class="left-panel">
          <div class="card">
            <h3>📊 FINANCIAL OVERVIEW</h3>
            <div class="stat-row"><span class="stat-label">Job Income</span><span class="stat-value positive">$${status.job ? status.job.income.toLocaleString() : '0'}/mo</span></div>
            <div class="stat-row"><span class="stat-label">Passive Income</span><span class="stat-value positive">$${status.passiveIncome.toLocaleString()}/mo</span></div>
            <div class="stat-row"><span class="stat-label">Total Income</span><span class="stat-value positive">$${status.income.toLocaleString()}/mo</span></div>
            <div class="stat-row"><span class="stat-label">Expenses</span><span class="stat-value negative">$${status.expenses.toLocaleString()}/mo</span></div>
            <div class="stat-row"><span class="stat-label">Net Flow</span><span class="stat-value ${status.income - status.expenses >= 0 ? 'positive' : 'negative'}">${status.income - status.expenses >= 0 ? '+' : ''}$${(status.income - status.expenses).toLocaleString()}/mo</span></div>
          </div>
          
          <div class="card">
            <h3>🎯 PROGRESS</h3>
            <div class="stat-row"><span class="stat-label">Net Worth</span><span class="stat-value ${status.netWorth >= 0 ? 'positive' : 'negative'}">$${status.netWorth.toLocaleString()}</span></div>
            <div class="progress-bar-container">
              <div class="progress-label"><span>Escape</span><span>${status.escapeStreak}/3 months</span></div>
              <div class="progress-bar"><div class="progress-fill green" style="width:${(status.escapeStreak/3)*100}%"></div></div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-label"><span>Energy</span><span>${status.energy}/${status.maxEnergy}</span></div>
              <div class="progress-bar"><div class="progress-fill blue" style="width:${(status.energy/status.maxEnergy)*100}%"></div></div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-label"><span>Stress</span><span>${status.stress}/100</span></div>
              <div class="progress-bar"><div class="progress-fill ${status.stress > 70 ? 'red' : 'gold'}" style="width:${status.stress}%"></div></div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-label"><span>Level ${status.level}</span><span>${status.xp}/${status.level*100} XP</span></div>
              <div class="progress-bar"><div class="progress-fill gold" style="width:${(status.xp/(status.level*100))*100}%"></div></div>
            </div>
          </div>
          
          <div class="card">
            <h3>🏆 GOALS</h3>
            <div class="leaderboard-entry"><span class="leaderboard-rank ${status.passiveIncome >= status.expenses ? 'gold' : ''}">${status.passiveIncome >= status.expenses ? '✓' : '○'}</span><span class="leaderboard-name">Passive > Expenses</span><span class="leaderboard-value">$${status.passiveIncome}/$${status.expenses}</span></div>
            <div class="leaderboard-entry"><span class="leaderboard-rank ${status.netWorth >= 100000 ? 'gold' : ''}">${status.netWorth >= 100000 ? '✓' : '○'}</span><span class="leaderboard-name">$100K Net Worth</span><span class="leaderboard-value">$${status.netWorth.toLocaleString()}</span></div>
            <div class="leaderboard-entry"><span class="leaderboard-rank ${player.liabilities.length === 0 ? 'gold' : ''}">${player.liabilities.length === 0 ? '✓' : '○'}</span><span class="leaderboard-name">Debt Free</span><span class="leaderboard-value">${player.liabilities.length} debts</span></div>
          </div>
        </div>
        
        <!-- CENTER -->
        <div class="center-panel">
          <div class="card ap-display">
            <div class="label">ACTION POINTS</div>
            <div class="ap-dots">${Array(status.maxActionPoints).fill(0).map((_,i) => `<div class="ap-dot ${i >= status.actionPoints ? 'used' : ''}"></div>`).join('')}</div>
          </div>
          
          <div class="card">
            <h3>⚡ ACTIONS</h3>
            <div class="actions-grid">
              <button class="action-btn" data-action="work" ${status.actionPoints<1?'disabled':''}><span class="action-icon">💼</span><span class="action-name">Work</span><span class="action-cost">1 AP • Salary</span></button>
              <button class="action-btn" data-action="hustle" ${status.actionPoints<1?'disabled':''}><span class="action-icon">💡</span><span class="action-name">Hustle</span><span class="action-cost">1 AP • Extra $</span></button>
              <button class="action-btn" data-action="invest" ${status.actionPoints<1?'disabled':''}><span class="action-icon">📈</span><span class="action-name">Invest</span><span class="action-cost">1 AP • Assets</span></button>
              <button class="action-btn" data-action="learn" ${status.actionPoints<1?'disabled':''}><span class="action-icon">📚</span><span class="action-name">Learn</span><span class="action-cost">1 AP • +FinIQ</span></button>
              <button class="action-btn" data-action="debt" ${status.actionPoints<1||status.liabilities.length===0?'disabled':''}><span class="action-icon">💰</span><span class="action-name">Pay Debt</span><span class="action-cost">1 AP • Reduce</span></button>
              <button class="action-btn" data-action="rest" ${status.actionPoints<1?'disabled':''}><span class="action-icon">😴</span><span class="action-name">Rest</span><span class="action-cost">1 AP • Recover</span></button>
            </div>
          </div>
          
          <button class="btn btn-success end-turn-btn" data-action="endTurn">⏭️ END TURN (Next Month)</button>
          
          <div class="card" style="padding:12px">
            <h3>📈 NET WORTH</h3>
            <div class="chart-container"><canvas id="netWorthChart"></canvas></div>
          </div>
        </div>
        
        <!-- RIGHT -->
        <div class="right-panel">
          <div class="card">
            <h3>🏠 ASSETS (${status.assets.length})</h3>
            ${status.assets.length === 0 ? '<div class="empty-list">No assets yet. Start investing!</div>' :
              status.assets.map(a => `<div class="asset-item"><span>${a.icon} ${a.name}</span><span class="income">+$${Math.floor((a.monthlyIncome.min+a.monthlyIncome.max)/2)}/mo</span></div>`).join('')}
          </div>
          
          <div class="card">
            <h3>💳 LIABILITIES (${status.liabilities.length})</h3>
            ${status.liabilities.length === 0 ? '<div class="empty-list" style="color:var(--accent-green)">Debt free! 🎉</div>' :
              status.liabilities.map(l => `<div class="liability-item"><span>${l.icon} ${l.name}</span><span class="payment">-$${l.monthlyPayment}/mo</span></div>`).join('')}
          </div>
          
          <div class="card">
            <h3>💼 JOB</h3>
            ${status.job ? `<div class="asset-item"><span>${status.job.icon} ${status.job.name}</span><span class="income">$${status.job.income.toLocaleString()}/mo</span></div>` : '<div class="empty-list">No job! Use Work action.</div>'}
          </div>
          
          <div class="card" style="padding:12px">
            <h3>💡 WISDOM</h3>
            <p style="color:var(--text-secondary);font-size:12px;font-style:italic">"${getRandomQuote()}"</p>
          </div>
          
          <button class="btn btn-secondary" data-action="menu" style="width:100%">🏠 Main Menu</button>
        </div>
      </div>
    </div>
  `;
  
  initChart(status.history);
  setupHandlers(container, game);
}

function initChart(history) {
  const ctx = document.getElementById('netWorthChart');
  if (!ctx) return;
  if (chart) chart.destroy();
  
  const labels = history.slice(-15).map(h => `M${h.month}`);
  const nw = history.slice(-15).map(h => h.netWorth);
  const pi = history.slice(-15).map(h => h.passiveIncome);
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Net Worth', data: nw, borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0 },
        { label: 'Passive', data: pi, borderColor: '#00aaff', backgroundColor: 'rgba(0,170,255,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8888aa', font: { size: 10 }, boxWidth: 10 } } },
      scales: {
        x: { ticks: { color: '#555577', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.03)' } },
        y: { ticks: { color: '#555577', font: { size: 9 }, callback: v => v >= 1000 ? '$'+(v/1000).toFixed(0)+'k' : '$'+v }, grid: { color: 'rgba(255,255,255,0.03)' } }
      }
    }
  });
}

function setupHandlers(container, game) {
  container.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action, game, container));
  });
  container.querySelector('[data-action="endTurn"]')?.addEventListener('click', () => {
    const oldMonth = game.player.month;
    game.endTurn();
    const newMonth = game.player.month;
    renderDashboard(container, game);
    if (newMonth > oldMonth) {
      toast(`📅 Month ${newMonth}! Income processed.`, 'success');
    }
  });
  container.querySelector('[data-action="menu"]')?.addEventListener('click', () => {
    if (confirm('Return to menu?')) { game.state = 'menu'; localStorage.setItem('ratrace_save', game.saveGame()); window.location.reload(); }
  });
}

function handleAction(action, game, container) {
  switch (action) {
    case 'work': showWorkModal(game, container); break;
    case 'hustle': showHustleModal(game, container); break;
    case 'invest': showInvestModal(game, container); break;
    case 'learn': showLearnModal(game, container); break;
    case 'debt': showDebtModal(game, container); break;
    case 'rest': const r = game.doRest(); toast(r.message, r.success ? 'success' : 'error'); if (r.success) renderDashboard(container, game); break;
  }
}

function showModal(container, title, icon, content) {
  document.querySelector('.modal-overlay')?.remove();
  const m = document.createElement('div');
  m.className = 'modal-overlay';
  m.innerHTML = `<div class="modal"><div class="modal-header"><span class="modal-icon">${icon}</span><span class="modal-title">${title}</span></div><div class="modal-body">${content}</div></div>`;
  document.body.appendChild(m);
  setTimeout(() => m.classList.add('active'), 10);
  m.addEventListener('click', e => { if (e.target === m) { m.classList.remove('active'); setTimeout(() => m.remove(), 300); } });
  return m;
}

function showWorkModal(game, container) {
  const jobs = game.player.getAvailableJobs();
  const content = `<p style="margin-bottom:12px">Choose a job. Better jobs need higher FinIQ.</p><div class="modal-choices">${jobs.map(j => `<button class="btn btn-secondary choice-btn" data-job="${j.id}" style="display:flex;justify-content:space-between"><span>${j.icon} ${j.name}</span><span style="color:var(--accent-green)">$${j.income.toLocaleString()}/mo</span></button>`).join('')}</div>`;
  const m = showModal(container, 'Choose Job', '💼', content);
  m.querySelectorAll('[data-job]').forEach(b => b.addEventListener('click', () => {
    const r = game.doWork(b.dataset.job); toast(r.message, r.success ? 'success' : 'error');
    if (r.success) { m.classList.remove('active'); setTimeout(() => m.remove(), 300); renderDashboard(container, game); }
  }));
}

function showHustleModal(game, container) {
  const hustles = game.player.getAvailableHustles();
  const content = `<p style="margin-bottom:12px">Side hustles earn extra income with some risk.</p><div class="modal-choices">${hustles.map(h => `<button class="btn btn-secondary choice-btn" data-h="${h.id}" style="display:flex;justify-content:space-between"><div><span>${h.icon} ${h.name}</span><span class="choice-effect">${h.description}</span></div><span style="color:var(--accent-green)">$${h.baseIncome}-${h.maxIncome}</span></button>`).join('')}</div>`;
  const m = showModal(container, 'Side Hustle', '💡', content);
  m.querySelectorAll('[data-h]').forEach(b => b.addEventListener('click', () => {
    const r = game.doSideHustle(b.dataset.h); toast(r.message, r.success && !r.failed ? 'success' : 'error');
    if (r.success) { m.classList.remove('active'); setTimeout(() => m.remove(), 300); renderDashboard(container, game); }
  }));
}

function showInvestModal(game, container) {
  const assets = game.player.getAvailableAssets();
  const content = `<p style="margin-bottom:12px">Assets generate passive income!</p><div class="modal-choices">${assets.map(a => `<button class="btn btn-secondary choice-btn" data-a="${a.id}" ${game.player.money<a.cost?'disabled':''} style="display:flex;justify-content:space-between"><div><span>${a.icon} ${a.name}</span><span class="choice-effect">${a.description}</span></div><div style="text-align:right"><div style="color:var(--accent-red)">$${a.cost.toLocaleString()}</div><div style="color:var(--accent-green);font-size:11px">+$${a.monthlyIncome.min}-${a.monthlyIncome.max}/mo</div></div></button>`).join('')}</div>`;
  const m = showModal(container, 'Buy Asset', '📈', content);
  m.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    const r = game.doBuyAsset(b.dataset.a); toast(r.message, r.success ? 'success' : 'error');
    if (r.success) { m.classList.remove('active'); setTimeout(() => m.remove(), 300); renderDashboard(container, game); }
  }));
}

function showLearnModal(game, container) {
  const opts = game.player.getAvailableLearning();
  const content = `<p style="margin-bottom:12px">Increase Financial IQ to unlock better options!</p><div class="modal-choices">${opts.map(l => `<button class="btn btn-secondary choice-btn" data-l="${l.id}" ${game.player.money<l.cost?'disabled':''} style="display:flex;justify-content:space-between"><div><span>${l.icon} ${l.name}</span><span class="choice-effect">${l.description}</span></div><div style="text-align:right">${l.cost>0?`<div style="color:var(--accent-red)">$${l.cost}</div>`:'<div style="color:var(--accent-green)">FREE</div>'}<div style="color:var(--accent-blue);font-size:11px">+${l.finIQGain} FinIQ</div></div></button>`).join('')}</div>`;
  const m = showModal(container, 'Learn', '📚', content);
  m.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => {
    const r = game.doLearn(b.dataset.l); toast(r.message, r.success ? 'success' : 'error');
    if (r.success) { m.classList.remove('active'); setTimeout(() => m.remove(), 300); renderDashboard(container, game); }
  }));
}

function showDebtModal(game, container) {
  const debts = game.player.liabilities;
  const content = `<p style="margin-bottom:12px">Pay down debts to reduce expenses!</p><div class="modal-choices">${debts.map((l,i) => `<button class="btn btn-secondary choice-btn" data-d="${i}" style="display:flex;justify-content:space-between"><span>${l.icon} ${l.name}</span><span style="color:var(--accent-red)">-$${l.monthlyPayment}/mo (bal: $${l.balance.toLocaleString()})</span></button>`).join('')}</div>`;
  const m = showModal(container, 'Pay Debt', '💰', content);
  m.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => {
    const r = game.doPayDebt(parseInt(b.dataset.d)); toast(r.message, r.success ? 'success' : 'error');
    if (r.success) { m.classList.remove('active'); setTimeout(() => m.remove(), 300); renderDashboard(container, game); }
  }));
}

export function showEventModal(container, event, game) {
  if (!event) return;
  let content = '';
  if (event.type === 'decision') {
    content = `<p>${event.description}</p><div class="modal-choices" style="margin-top:12px">${event.choices.map((c,i) => `<button class="btn btn-secondary choice-btn" data-c="${i}" style="display:flex;flex-direction:column;align-items:flex-start"><span>${c.text}</span><span class="choice-effect">${c.effect}</span></button>`).join('')}</div>`;
  } else {
    content = `<p>${event.message}</p><button class="btn btn-primary" data-ok style="width:100%;margin-top:16px">OK</button>`;
  }
  const m = showModal(container, event.title, event.icon, content);
  m.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
    game.processChoice(parseInt(b.dataset.c)); m.classList.remove('active'); setTimeout(() => m.remove(), 300); renderDashboard(container, game);
  }));
  m.querySelector('[data-ok]')?.addEventListener('click', () => {
    game.dismissEvent(); m.classList.remove('active'); setTimeout(() => m.remove(), 300);
    if (game.eventQueue.length > 0) setTimeout(() => showEventModal(container, game.eventQueue[0], game), 400);
    else renderDashboard(container, game);
  });
}

function toast(msg, type = 'info') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = `toast ${type}`; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function getRandomQuote() {
  const quotes = [
    "The rich don't work for money. They make money work for them.",
    "It's not how much money you make. It's how much money you keep.",
    "Assets put money in your pocket. Liabilities take money out.",
    "The single most powerful asset we all have is our mind.",
    "Financial freedom is available to those who learn about it.",
    "Winners are not afraid of losing. But losers are.",
    "The more you learn, the more you earn."
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
