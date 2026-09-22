import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const filesBelow = async (directory, extension) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return filesBelow(target, extension)
    return entry.name.endsWith(extension) ? [target] : []
  }))
  return nested.flat()
}

test('Vite build targets match the documented browser baseline', async () => {
  const config = await readFile(path.join(projectRoot, 'vite.config.js'), 'utf8')
  for (const target of ['chrome111', 'edge111', 'firefox128', 'safari16.4', 'ios16.4']) {
    assert.match(config, new RegExp(`['"]${target.replace('.', '\\.')}['"]`), `${target} is missing from the Vite target`)
  }
  assert.match(config, /target:\s*supportedBrowsers/)
  assert.match(config, /cssTarget:\s*supportedBrowsers/)
})

test('dynamic viewport units retain a static viewport fallback', async () => {
  const expectations = [
    ['src/style.css', /#app\s*\{[^}]*min-height:\s*100vh;[\s\S]*@supports\s*\(height:\s*100dvh\)[\s\S]*#app\s*\{[^}]*min-height:\s*100dvh;/],
    ['src/assets/css/home/bannerSection.css', /#home-banner-section\s*\{[^}]*height:\s*100vh;[\s\S]*@supports\s*\(height:\s*100dvh\)[\s\S]*#home-banner-section\s*\{[^}]*height:\s*100dvh;/],
    ['src/assets/css/home/videoSection.css', /#home-video-section\s*\{[^}]*height:\s*100vh;[\s\S]*@supports\s*\(height:\s*100dvh\)[\s\S]*#home-video-section\s*\{[^}]*height:\s*100dvh;/],
    ['src/assets/css/about/coverSection.css', /#about-cover-section\s*\{[^}]*height:\s*100vh;[\s\S]*@supports\s*\(height:\s*100dvh\)[\s\S]*#about-cover-section\s*\{[^}]*height:\s*100dvh;/],
    ['src/assets/css/mainLoading.css', /\.skeleton-home-hero\s*\{[^}]*height:\s*100vh;[\s\S]*@supports\s*\(height:\s*100dvh\)[\s\S]*\.skeleton-home-hero\s*\{[^}]*height:\s*100dvh;/],
    ['src/assets/css/mainLoading.css', /\.skeleton-visual-cover\s*\{[^}]*height:\s*100vh;[\s\S]*@supports\s*\(height:\s*100dvh\)[\s\S]*\.skeleton-visual-cover\s*\{[^}]*height:\s*100dvh;/],
  ]

  for (const [relativeFile, pattern] of expectations) {
    const source = await readFile(path.join(projectRoot, relativeFile), 'utf8')
    assert.match(source, pattern, `${relativeFile} is missing its vh fallback and dvh enhancement`)
  }

  const modal = await readFile(path.join(projectRoot, 'src/assets/css/workPage/imageModal.css'), 'utf8')
  for (const expected of ['height: 100vh', 'max-height: 50vh', 'max-height: 80vh', 'h-dvh', 'max-h-[50dvh]', 'md:max-h-[80dvh]']) {
    assert.ok(modal.includes(expected), `image modal is missing ${expected}`)
  }
})

test('application CSS does not introduce custom color-mix declarations', async () => {
  const cssFiles = await filesBelow(path.join(projectRoot, 'src'), '.css')
  for (const file of cssFiles) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /color-mix\s*\(/i, `${path.relative(projectRoot, file)} uses color-mix()`)
  }
})

test('browser support and release matrix remain documented', async () => {
  const documentation = [
    await readFile(path.join(projectRoot, 'README.md'), 'utf8'),
    await readFile(path.join(projectRoot, 'STYLE_GUIDE.md'), 'utf8'),
  ].join('\n')

  for (const label of ['Chrome 111+', 'Edge 111+', 'Firefox 128+', 'Safari 16.4+', 'iOS Safari 16.4+']) {
    assert.ok(documentation.includes(label), `documentation is missing ${label}`)
  }
})
