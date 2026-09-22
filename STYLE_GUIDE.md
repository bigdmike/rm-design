# Frontend style guide

The frontend uses Tailwind CSS 4 as its design system. Plain CSS remains an intentional escape hatch, not a second styling system.

## Where styles belong

- Put colors, fonts, shared surfaces, and other design tokens in `src/assets/css/theme.css` using `@theme`.
- Put document-wide element defaults in `src/assets/css/base.css`, imported into Tailwind's `base` layer.
- Keep reusable or Vue/PHP-shared semantic selectors in `src/assets/css/**`, imported into the `components` layer by `src/style.css`.
- Use utilities directly in Vue templates for one-off layout, spacing, alignment, visibility, and state styles.
- Do not add Vue `<style>` or `<style scoped>` blocks. The single CSS entry is required for the PHP first paint and avoids processing Tailwind separately for each component.

## Choosing utility classes, `@apply`, or plain CSS

Use complete utility class names in templates when a style belongs to one element. Never construct Tailwind names dynamically, such as `bg-${color}`; map states or props to complete class strings instead.

Use a semantic class with `@apply` when the selector is a reusable component contract, represents a meaningful state, or must be emitted by both Vue and PHP. Do not create a wrapper class solely to hide a short list of utilities.

Use plain CSS for keyframes, pseudo-element content, rich-text descendant rules, fluid `clamp()` values, runtime CSS-variable calculations, complex selectors, and accessibility media queries. Plain CSS must consume theme variables for branded values instead of repeating literals.

## Shared rendering contract

The API's PHP first paint and Vue use the same compiled stylesheet. Classes including `main-container`, `main-breadcrumbs`, `editor-content`, `responsive-picture`, page IDs, and component state classes are internal interfaces. Preserve them until both renderers have been migrated and verified together.

## Responsive and visual baseline

Check `/`, `/about`, `/works`, a work detail page, `/press`, `/workflow`, `/contact`, `/privacy-policy`, and a missing route at 375, 640, 768, 1024, and 1536 CSS pixels. Verify the PHP first paint and the hydrated Vue view, plus Header/Menu, dialogs, pagination, FAQ, form errors, image modal, skeleton loading, and reduced-motion behavior.

The pre-refactor production CSS baseline was 152.89 kB raw and 16.97 kB gzip. `npm run build` enforces the existing aggregate CSS ceiling of 22 KiB gzip from `tests/launch-budgets.json`; a size below the ceiling is not by itself proof of visual correctness.

## Browser support and compatibility

The supported baseline is Chrome 111+, Edge 111+, Firefox 128+, Safari 16.4+, and iOS Safari 16.4+. `vite.config.js` explicitly applies this range to both JavaScript and CSS builds so dependency upgrades cannot silently raise it. Older browsers are outside the support contract.

Use progressive enhancement for viewport sizing: place a `vh` declaration immediately before the equivalent `dvh` declaration. Avoid adding custom `color-mix()` declarations when an equivalent static color or theme variable is clear. These rules reduce avoidable rendering failures without introducing a legacy build.

Before a release, run the automated checks and complete this browser matrix on representative devices or vendor-native simulators:

| Browser | Minimum | Required coverage |
| --- | --- | --- |
| Chrome desktop / Android | 111 | Primary routes, responsive widths, keyboard and touch interactions |
| Edge on Windows | 111 | Primary routes and dialogs |
| Firefox desktop | 128 | Primary routes, forms, dialogs, and reduced motion |
| Safari on macOS | 16.4 | Primary routes, navigation, media, dialogs, and hydration |
| iOS Safari | 16.4 | 375/640 px layouts, menu, viewport-height sections, modal, and forms |

The Chromium browser suite is useful for layout regression coverage, but it does not count as Safari, iOS Safari, or Firefox certification.

## Required checks

Run `npm test`, `npm run test:compatibility`, and `npm run build` for every style-system change. Run the public, launch, and browser suites when PHP rendering or shared semantic classes change.
