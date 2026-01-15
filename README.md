# Standby Match

Personal wrestling match logging app with an 80s territorial VHS aesthetic.

## Features

- Log matches with competitors, promotion, match type, date, rating (half-stars + 5+), blood indicator, and comments
- Mobile-first, thumb-friendly interface
- localStorage persistence (data stays on your device)
- CSV export for backup/analysis
- WrestleWar '89 VHS sleeve inspired design

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

This creates a `dist` folder with the static site.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g., `standby-match`)

2. Update `vite.config.js` if your repo name is different:
   ```js
   base: '/your-repo-name/'
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/standby-match.git
   git push -u origin main
   ```

5. Deploy the dist folder to gh-pages branch:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

6. In your GitHub repo settings, go to Pages and ensure it's set to deploy from the `gh-pages` branch.

Your app will be live at: `https://YOUR_USERNAME.github.io/standby-match/`

## Data Storage

All data is stored in your browser's localStorage. This means:
- Data persists between sessions on the same device/browser
- Data does NOT sync across devices
- Clearing browser data will delete your matches
- Use the CSV export regularly to back up your data

## Rating System

- 1 to 5 stars with half-star increments
- 5+ option for the mythical Meltzer-breakers
- Tap the rating buttons to select

---

*The cream rises to the top.*
