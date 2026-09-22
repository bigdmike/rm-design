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

test('Vue components use the single shared stylesheet entry', async () => {
  const vueFiles = await filesBelow(path.join(projectRoot, 'src'), '.vue')
  const sources = await Promise.all(vueFiles.map((file) => readFile(file, 'utf8')))
  for (let index = 0; index < sources.length; index += 1) {
    assert.doesNotMatch(sources[index], /<style\b/i, `${path.relative(projectRoot, vueFiles[index])} contains a Vue style block`)
  }
})

test('Tailwind utilities are statically detectable', async () => {
  const sourceFiles = [
    ...await filesBelow(path.join(projectRoot, 'src'), '.vue'),
    ...await filesBelow(path.join(projectRoot, 'src'), '.js'),
  ]
  const dynamicUtility = /(?:^|[\s"'`])(?:bg|text|border|ring|from|via|to|fill|stroke|p[trblxy]?|m[trblxy]?|w|h|max-w|min-w)-\$\{/gm
  for (const file of sourceFiles) {
    assert.doesNotMatch(await readFile(file, 'utf8'), dynamicUtility, `${path.relative(projectRoot, file)} constructs a dynamic utility name`)
  }
})

test('brand primitives live only in the Tailwind theme', async () => {
  const themeFile = path.join(projectRoot, 'src', 'assets', 'css', 'theme.css')
  const sourceFiles = [
    ...await filesBelow(path.join(projectRoot, 'src'), '.css'),
    ...await filesBelow(path.join(projectRoot, 'src'), '.vue'),
    ...await filesBelow(path.join(projectRoot, 'src'), '.js'),
  ]
  const brandLiterals = /#(?:cc333a|a3292e|e35d62|f4efe3)\b/ig
  const theme = await readFile(themeFile, 'utf8')
  for (const value of ['#cc333a', '#a3292e', '#e35d62', '#f4efe3']) assert.match(theme, new RegExp(value, 'i'))
  for (const file of sourceFiles.filter((file) => file !== themeFile)) {
    assert.doesNotMatch(await readFile(file, 'utf8'), brandLiterals, `${path.relative(projectRoot, file)} repeats a brand primitive`)
  }
})

test('font stacks live only in the Tailwind theme', async () => {
  const themeFile = path.join(projectRoot, 'src', 'assets', 'css', 'theme.css')
  const sourceFiles = [
    ...await filesBelow(path.join(projectRoot, 'src'), '.css'),
    ...await filesBelow(path.join(projectRoot, 'src'), '.vue'),
  ]
  const fontStackLiteral = /["'](?:Noto Sans TC|DM Sans)["']/g
  for (const file of sourceFiles.filter((file) => file !== themeFile)) {
    assert.doesNotMatch(await readFile(file, 'utf8'), fontStackLiteral, `${path.relative(projectRoot, file)} repeats a shared font stack`)
  }
})

test('the CSS entry declares explicit Tailwind cascade layers', async () => {
  const entry = await readFile(path.join(projectRoot, 'src', 'style.css'), 'utf8')
  assert.match(entry, /@import "\.\/assets\/css\/theme\.css";/)
  assert.match(entry, /@import "\.\/assets\/css\/base\.css" layer\(base\);/)

  const localImports = [...entry.matchAll(/@import "(\.\/assets\/css\/[^"]+\.css)"([^;]*);/g)]
  for (const [, file, suffix] of localImports) {
    if (file.endsWith('/theme.css')) continue
    const expectedLayer = file.endsWith('/base.css') ? 'layer(base)' : 'layer(components)'
    assert.equal(suffix.trim(), expectedLayer, `${file} is missing ${expectedLayer}`)
  }
})
