# rm-design

Vue 3 + Vite project.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This repository includes a workflow at `.github/workflows/deploy-pages.yml`.

1. Push this project to a GitHub repository.
2. In GitHub, open repository Settings > Pages.
3. Set Source to GitHub Actions.
4. Push to the `main` branch (or run the workflow manually).

After deployment, the site URL is:

`https://<your-github-username>.github.io/<your-repository-name>/`

Notes:
- Vite `base` is configured automatically from `GITHUB_REPOSITORY` in GitHub Actions.
- `dist/404.html` is generated from `dist/index.html` for SPA route refresh fallback on GitHub Pages.
