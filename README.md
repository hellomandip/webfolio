# Mandip Randhawa — Portfolio

Personal portfolio site. Static HTML/CSS, no build step.

## Structure

```
portfolio-site/
├── index.html              # homepage
├── case-studies/           # individual case study pages
├── css/                    # shared stylesheet for case study pages
├── images/
│   ├── hero/                # homepage hero images
│   ├── logos/                # company logos
│   ├── case-studies/         # per-case-study screenshots, grouped by project
│   └── mandip-profile-pic.jpg
└── assets/                 # resume PDF
```

## Local preview

Open `index.html` directly in a browser, or serve the folder locally, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploying with GitHub Pages

1. Push this folder to a GitHub repo.
2. In the repo's Settings → Pages, set the source to the `main` branch, root folder.
3. The site will be live at `https://<username>.github.io/<repo-name>/`.
