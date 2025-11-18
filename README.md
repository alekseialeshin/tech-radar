# Tech Radar

A simple, visual tool to track your team's technology choices.

Based on [Zalando Tech Radar](https://github.com/zalando/tech-radar) and inspired by [ThoughtWorks](https://www.thoughtworks.com/radar).

## Quick Start

1. Open `index.html` in a browser
2. Edit the `CONFIG` object in `index.html` to update technologies
3. Refresh to see changes

That's it!

## How It Works

**4 Quadrants** (categories):
- Languages & Frameworks
- Infrastructure  
- Datastores
- Data Management

**4 Rings** (adoption level):
- **ADOPT** (center) — Proven at scale, use with confidence
- **TRIAL** — Successful in projects, worth using
- **ASSESS** — Worth exploring for potential value
- **HOLD** (outer) — Not recommended for new projects

**Movement Indicators**:
- ⬤ No change
- ▲ Moved inward (more favorable)
- ▼ Moved outward (less favorable)
- ★ New entry

## Updating Technologies

Open `index.html` and edit the `CONFIG` object:

```javascript
const CONFIG = {
  title: "Your Tech Radar",
  date: "2025.02",
  entries: [
    {
      quadrant: 0,  // 0=Languages, 1=Infrastructure, 2=Datastores, 3=Data
      ring: 1,      // 0=ADOPT, 1=TRIAL, 2=ASSESS, 3=HOLD
      label: "React",
      active: true,
      moved: 0      // 0=no change, 1=in, -1=out, 2=new
    },
    // ... add more entries
  ]
};
```

### Quick Reference

**quadrant values:**
- `0` = Languages & Frameworks
- `1` = Infrastructure
- `2` = Datastores
- `3` = Data Management

**ring values:**
- `0` = ADOPT
- `1` = TRIAL
- `2` = ASSESS
- `3` = HOLD

**moved values:**
- `0` = No change (⬤)
- `1` = Moved inward (▲)
- `-1` = Moved outward (▼)
- `2` = New entry (★)

## Customization

All customization happens in `index.html`:

**Change colors:**
```javascript
rings: [
  { name: "ADOPT", color: "#5ba300" },
  { name: "TRIAL", color: "#009eb0" },
  { name: "ASSESS", color: "#c7ba00" },
  { name: "HOLD", color: "#e09b96" }
]
```

**Rename quadrants:**
```javascript
quadrants: [
  { name: "Your Custom Name" },
  // ...
]
```

## Files

- `index.html` — **Edit this file to update your radar**
- `radar.js` — Visualization engine (no need to edit)
- `radar.css` — Minimal styling (no need to edit)
- `config.json` — *(No longer used - can be deleted)*

## Deployment

**GitHub Pages:**
1. Push to GitHub
2. Enable Pages in repo settings
3. Access at `https://username.github.io/repo-name`

**Any static host:**
Upload all files to Vercel, Netlify, etc.

**Local:**
Just open `index.html` in any browser

## Tips

- Update quarterly with your team
- Keep entries organized by category
- Use links field to add documentation URLs
- Track changes over time with git

## License

MIT License (based on Zalando Tech Radar)