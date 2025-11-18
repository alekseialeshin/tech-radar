# YIM Tech Radar

A powerful tool to visualize technology choices, inspire and support Engineering teams to pick the best technologies for new projects.

Based on the excellent work by [Zalando Tech Radar](https://github.com/zalando/tech-radar) and inspired by the [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar).

## Quick Start

1. Open `index.html` in your web browser
2. Edit `config.json` to add/remove/update technologies
3. Refresh the page to see your changes

## How it works

The radar is divided into four **quadrants**:

- **Languages & Frameworks** (top right)
- **Infrastructure** (top left)
- **Datastores** (bottom left) 
- **Data Management** (bottom right)

Each technology is placed in one of four **rings**:

- **ADOPT** (center) — Technologies we have high confidence in, proven at scale
- **TRIAL** — Technologies we've seen work successfully in projects 
- **ASSESS** — Technologies worth investigating for potential value
- **HOLD** (outer ring) — Technologies not recommended for new projects

## Visual Indicators

- **⬤** No change from last update
- **▲** Moved inward (more favorable)
- **▼** Moved outward (less favorable) 
- **★** New to the radar

## Editing the Radar

### Adding a New Technology

Edit `config.json` and add an entry like this:

```json
{
  "quadrant": 0,
  "ring": 1, 
  "label": "New Technology",
  "active": true,
  "moved": 2,
  "link": "https://example.com"
}
```

### Configuration Parameters

**quadrant** (required): Which section of the radar
- `0` = Languages & Frameworks
- `1` = Infrastructure  
- `2` = Datastores
- `3` = Data Management

**ring** (required): Which ring/level
- `0` = ADOPT
- `1` = TRIAL
- `2` = ASSESS  
- `3` = HOLD

**label** (required): Name of the technology

**active** (required): Set to `true` for normal display

**moved** (required): Movement indicator
- `0` = No change (⬤)
- `1` = Moved up/inward (▲)
- `-1` = Moved down/outward (▼)
- `2` = New entry (★)

**link** (optional): URL for more information

### Example Entries

```json
{
  "quadrant": 0,
  "ring": 0,
  "label": "React", 
  "active": true,
  "moved": 0,
  "link": "https://reactjs.org"
}
```

### Updating the Date

Change the `date` field at the top of `config.json`:

```json
{
  "date": "2025.02",
  "entries": [...]
}
```

## Customization

### Changing Colors

Edit the radar visualization in `index.html`:

```javascript
rings: [
  { name: "ADOPT", color: "#5ba300" },
  { name: "TRIAL", color: "#009eb0" }, 
  { name: "ASSESS", color: "#c7ba00" },
  { name: "HOLD", color: "#e09b96" }
]
```

### Changing Quadrant Names

```javascript
quadrants: [
  { name: "Languages & Frameworks" },
  { name: "Infrastructure" },
  { name: "Datastores" },
  { name: "Data Management" }
]
```

### Changing Title

```javascript
radar_visualization({
  title: "Your Company Tech Radar",
  // ... other config
});
```

## File Structure

```
/
├── index.html      # Main page
├── radar.js        # Visualization engine  
├── radar.css       # Styling
├── config.json     # Technology data
└── README.md       # This file
```

## Hosting

### GitHub Pages
1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at `https://yourusername.github.io/yourrepo`

### Local Development
Simply open `index.html` in any modern web browser.

### Static Hosting
Upload all files to any static web hosting service (Vercel, Netlify, etc.)

## Tips for Effective Use

1. **Regular Updates**: Review and update quarterly
2. **Team Input**: Gather feedback from multiple team members
3. **Document Decisions**: Use the links to explain why technologies are in specific rings
4. **Version Control**: Track changes over time with git
5. **Clear Criteria**: Define what qualifies for each ring in your organization

## Troubleshooting

### Radar not displaying
- Check browser console for JavaScript errors
- Ensure `config.json` is valid JSON
- Make sure all required fields are present

### Technologies not positioned correctly
- Verify quadrant values are 0-3
- Check ring values are 0-3
- Ensure moved values are valid (-1, 0, 1, or 2)

## License

Based on the MIT-licensed Zalando Tech Radar. See original project for full license details.

## Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

For questions or suggestions, please open an issue in the repository.