<div align="center">

# ✦ Mrunmayi Shinde — Portfolio

A glassmorphism, AI-flavoured personal site built with plain HTML, CSS and JavaScript.

**🌐 Live: https://mrunmayis2600.github.io/Portfolio/**

</div>

## Features
- Glassmorphism UI with an aurora background, an interactive **neural-network canvas** and cursor-spotlight glass cards
- Dark / light theme (remembers your choice, respects system preference)
- Typed role line, animated profile card, animated counters and scroll reveals
- Featured project with screenshot tabs, plus research, skills, education and certifications
- **"Ask my AI"** — an offline demo assistant that answers from the CV (no server, no API keys)
- Responsive, keyboard-accessible, and honours `prefers-reduced-motion`

## Structure
```
index.html        page content
css/style.css     design tokens, glass components, themes, responsive rules
js/main.js        canvas, animations, theme, assistant
assets/           favicon and project screenshots
```

## Run locally
No build step — open `index.html`, or serve the folder:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy
Hosted with **GitHub Pages** from the `main` branch (root folder).
