import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsDirectory = path.join(projectRoot, 'dist', 'assets')
const budgets = JSON.parse(await readFile(path.join(projectRoot, 'tests', 'launch-budgets.json'), 'utf8'))
const cssFiles = (await readdir(assetsDirectory)).filter((name) => name.endsWith('.css'))

if (cssFiles.length === 0) throw new Error('CSS budget check found no built stylesheets')

let gzipBytes = 0
for (const file of cssFiles) {
  const source = await readFile(path.join(assetsDirectory, file))
  gzipBytes += gzipSync(source).byteLength
}

if (gzipBytes > budgets.allCssGzipBytes) {
  throw new Error(`Built CSS is ${gzipBytes} gzip bytes; budget is ${budgets.allCssGzipBytes}`)
}

console.log(`CSS budget: ${gzipBytes}/${budgets.allCssGzipBytes} gzip bytes`)
