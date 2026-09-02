# RM Design frontend

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

## Production build

`npm run build` creates the Vite assets plus the PHP SEO entry in `dist/`.
The deployed document root must point to `frontend/dist`, with the private API
application available through the default sibling path or `RM_API_BOOTSTRAP`.

Do not deploy only `index.html`: direct case URLs, sitemap, robots and HTTP 404
depend on `dist/index.php`, `dist/app-shell.html` and `dist/.htaccess`.

See `../docs/frontend-seo.md` for local checks and hosting requirements.

## Pre-launch validation (Stage 5)

Run against the built PHP site on port 8080 and the API on 8081, not Vite preview:

```powershell
npm test
npm run build
npm run test:public
npm run test:launch
npm run test:browser
npm run test:lighthouse
npm run test:production-package
```

The launch gate writes `reports/stage5-local.json` and fails on SEO, delivery or
resource-budget regressions. The optional browser fixture runs at
`http://127.0.0.1:5176/__qa`, blocks writes and supports synthetic API delay/errors.
It is not included in dist and is not a physical-device measurement. The
Lighthouse command runs the controlled local mobile/desktop cold/warm matrix and
writes `reports/lighthouse-controlled-local.json`; it is a lab measurement, not
field Core Web Vitals.
The mobile/tablet menu suite checks disclosure state, focus boundaries, Escape,
SPA navigation and desktop-breakpoint cleanup using synthetic keyboard events.
These checks do not substitute for native keyboard or touch/device testing.
Stop it with Ctrl+C. See `../docs/frontend-stage-5-launch-validation.md` for results,
PHP failure isolation, production prerequisites and real-device follow-up.

`test:production-package` is an offline, read-only check for the currently
configured production origins and built frontend/admin/API artifacts. It writes
`reports/production-package-preflight.json` and does not create an upload archive
or include secrets. See `../docs/production-deployment.md` before exporting the
database or uploading files.
