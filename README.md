# 🐀 Escape the Rat Race

A financial simulation game inspired by Robert Kiyosaki's "Rich Dad Poor Dad".

## 🎮 How to Play

### Solo Mode
1. Run `npm run dev` and open http://localhost:3000
2. Click "New Game" and choose your character
3. Use 3 Action Points each month to:
   - 💼 **Work** - Earn stable income
   - 💡 **Side Hustle** - Extra income with risk
   - 📈 **Invest** - Buy income-generating assets
   - 📚 **Learn** - Increase Financial IQ
   - 💰 **Pay Debt** - Reduce liabilities
   - 😴 **Rest** - Recover energy

### Multiplayer Mode

#### Online (requires server)
1. Start server: `cd server && npm start`
2. Start client: `npm run dev`
3. Click "Multiplayer" → "Create Room" or "Join Room"
4. Share the 6-character room code with friends
5. Everyone clicks "Ready", host clicks "Start"

#### Local Hot-Seat (same device)
1. Click "Multiplayer" → "Local Hot-Seat"
2. Add 2-6 players with names
3. Pass device between turns

## 🚀 Quick Start

**Windows:**
```
Double-click start-game.bat
```

**Manual:**
```bash
# Terminal 1 - Server
cd server
npm install
npm start

# Terminal 2 - Client
npm install
npm run dev
```

Then open http://localhost:3000

## 📱 Build for Android

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## 🏆 Win Condition

**You escape the rat race when your passive income exceeds your expenses for 3 consecutive months!**

## 💡 Key Concept (Robert Kiyosaki)

> "Assets put money IN your pocket.  
> Liabilities take money OUT of your pocket.  
> The rich acquire assets. The poor acquire liabilities."

## 📊 Game Stats

| Stat | Description |
|------|-------------|
| 💰 Money | Cash on hand |
| 📈 Income | Monthly earnings (job + passive) |
| 📉 Expenses | Monthly costs |
| 🏠 Assets | Things that generate passive income |
| 💳 Liabilities | Debts that cost monthly payments |
| 🧠 Financial IQ | Unlocks better jobs & investments |
| ⚡ Energy | Limits actions per turn |
| 😰 Stress | High stress = bad outcomes |

## 🎯 Characters

| Background | Starting Cash | Starting Debt | FinIQ | Difficulty |
|------------|---------------|---------------|-------|------------|
| 🎓 Student | $500 | $25,000 | 5 | Hard |
| 👔 Employee | $2,000 | $5,000 | 10 | Medium |
| 💼 Entrepreneur | $5,000 | $10,000 | 20 | Easy |

## 📁 Project Structure

```
escape-rat-race/
├── src/                 # Game client
│   ├── main.js         # Entry point
│   ├── game/           # Game logic
│   ├── ui/             # UI components
│   ├── data/           # Game data
│   └── styles/         # CSS styles
├── server/             # Multiplayer server
│   └── src/index.js    # Socket.IO server
├── package.json
├── vite.config.js
└── capacitor.config.json
```

## 🛠️ Tech Stack

- **Frontend:** Vanilla JS + Vite + Chart.js
- **Backend:** Node.js + Express + Socket.IO
- **Mobile:** Capacitor (Android)
- **Styling:** CSS3 with CSS variables
