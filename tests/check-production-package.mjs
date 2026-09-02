import assert from 'node:assert/strict'
import { lstat, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = path.resolve(frontendRoot, '..')
const apiRoot = path.join(repositoryRoot, 'api')
const adminRoot = path.join(repositoryRoot, 'admin')
const args = Object.fromEntries(process.argv.slice(2).map((value) => {
  const match = value.match(/^--(front|api|report)=(.+)$/)
  if (!match) throw new Error('Use --front=HTTPS_ORIGIN --api=HTTPS_ORIGIN --report=NAME')
  return [match[1], match[2]]
}))
const reportName = args.report || 'production-package-preflight'
if (!/^[a-z0-9-]+$/i.test(reportName)) throw new Error('Invalid report name')

function productionOrigin(value, name) {
  assert.ok(value, `Missing --${name}=HTTPS_ORIGIN`)
  const url = new URL(value)
  assert.equal(url.protocol, 'https:', `${name} must use HTTPS`)
  assert.equal(url.username, '', `${name} must not contain credentials`)
  assert.equal(url.password, '', `${name} must not contain credentials`)
  assert.equal(url.pathname, '/', `${name} must not contain a path`)
  assert.equal(url.search, '', `${name} must not contain a query`)
  assert.equal(url.hash, '', `${name} must not contain a fragment`)
  assert.ok(!['localhost', '127.0.0.1', '::1'].includes(url.hostname), `${name} must not be local`)
  return url.origin
}

const frontOrigin = productionOrigin(args.front, 'front')
const apiOrigin = productionOrigin(args.api, 'api')
assert.notEqual(frontOrigin, apiOrigin, 'Frontend and API origins must differ')

async function filesBelow(root) {
  const output = []
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name)
      const metadata = await lstat(absolute)
      assert.equal(metadata.isSymbolicLink(), false, `Deployment input must not contain symlinks: ${absolute}`)
      if (entry.isDirectory()) await visit(absolute)
      else if (entry.isFile()) output.push(absolute)
    }
  }
  await visit(root)
  return output
}

async function required(relative) {
  const absolute = path.join(repositoryRoot, relative)
  assert.ok((await stat(absolute)).isFile(), `Required file missing: ${relative}`)
  return absolute
}

async function textFiles(files) {
  const extensions = new Set(['.html', '.js', '.css', '.php', '.htaccess'])
  return files.filter((file) => extensions.has(path.extname(file).toLowerCase()) || path.basename(file) === '.htaccess')
}

async function findText(files, pattern) {
  const matches = []
  for (const file of await textFiles(files)) {
    const content = await readFile(file, 'utf8')
    if (pattern.test(content)) matches.push(path.relative(repositoryRoot, file).replaceAll('\\', '/'))
  }
  return matches
}

async function totalBytes(files) {
  let bytes = 0
  for (const file of files) bytes += (await stat(file)).size
  return bytes
}

const checks = []
async function check(name, action) {
  try {
    const details = await action()
    checks.push({ name, status: 'pass', ...(details === undefined ? {} : { details }) })
  } catch (error) {
    checks.push({ name, status: 'fail', error: error.message })
  }
}

let frontendFiles = []
let adminFiles = []
let uploadFiles = []
await check('production origins', async () => ({ frontOrigin, apiOrigin }))
await check('frontend production environment', async () => {
  const value = (await readFile(path.join(frontendRoot, '.env.production'), 'utf8')).match(/^VITE_API_URL=(.+)$/m)?.[1]
  assert.equal(value, apiOrigin)
  return { VITE_API_URL: value }
})
await check('admin production environment', async () => {
  const value = (await readFile(path.join(adminRoot, '.env.production'), 'utf8')).match(/^VITE_FRONTEND_URL=(.+)$/m)?.[1]
  assert.equal(new URL(value).origin, frontOrigin)
  return { VITE_FRONTEND_URL: value }
})
await check('frontend public artifact', async () => {
  for (const file of ['frontend/dist/.htaccess', 'frontend/dist/index.php', 'frontend/dist/index.html', 'frontend/dist/app-shell.html']) await required(file)
  frontendFiles = await filesBelow(path.join(frontendRoot, 'dist'))
  assert.ok(frontendFiles.some((file) => file.includes(`${path.sep}assets${path.sep}`)), 'Frontend assets are missing')
  const entry = await readFile(path.join(frontendRoot, 'dist', 'index.php'), 'utf8')
  assert.match(entry, /dirname\(__DIR__\)\s*\.\s*'\/api\/bootstrap\.php'/, 'Frontend entry must support the cPanel sibling api/ layout')
  assert.match(entry, /dirname\(__DIR__,\s*2\)\s*\.\s*'\/api\/bootstrap\.php'/, 'Frontend entry must retain the local dist layout')
  return { files: frontendFiles.length, bytes: await totalBytes(frontendFiles) }
})
await check('admin public artifact', async () => {
  for (const file of ['api/public/admin/.htaccess', 'api/public/admin/index.html']) await required(file)
  adminFiles = await filesBelow(path.join(apiRoot, 'public', 'admin'))
  assert.ok(adminFiles.some((file) => file.includes(`${path.sep}assets${path.sep}`)), 'Admin assets are missing')
  return { files: adminFiles.length, bytes: await totalBytes(adminFiles) }
})
await check('API runtime artifact', async () => {
  for (const file of [
    'api/bootstrap.php', 'api/composer.json', 'api/composer.lock', 'api/vendor/autoload.php',
    'api/public/index.php', 'api/public/.htaccess', 'api/public/uploads/.htaccess',
    'api/config/database.php', 'api/config/auth.php', 'api/config/media.php',
    'api/config/contact.php', 'api/config/gmail.php',
  ]) await required(file)
  for (const directory of ['api/app', 'api/templates', 'api/vendor']) assert.ok((await stat(path.join(repositoryRoot, directory))).isDirectory())
})
await check('built files contain no local origins or source maps', async () => {
  const files = [...frontendFiles, ...adminFiles]
  assert.ok(files.length > 0, 'Build artifacts were not loaded')
  const forbidden = await findText(files, /(?:localhost|127\.0\.0\.1|rm-api\.localhost|rm\.localhost|sourceMappingURL)/i)
  assert.deepEqual(forbidden, [])
  assert.deepEqual(files.filter((file) => file.toLowerCase().endsWith('.map')), [])
})
await check('built files contain configured production origins', async () => {
  const frontReferences = await findText(adminFiles, new RegExp(frontOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  const apiReferences = await findText(frontendFiles, new RegExp(apiOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.ok(frontReferences.length > 0, 'Admin bundle does not contain the configured frontend origin')
  assert.ok(apiReferences.length > 0, 'Frontend bundle does not contain the configured API origin')
  return { frontReferences, apiReferences }
})
await check('public deployment selection excludes development and secrets', async () => {
  const forbiddenNames = /(?:^|\/)(?:_dev|tests?|node_modules|vendor|storage|database)(?:\/|$)|(?:^|\/)(?:\.env|composer\.(?:json|lock))$/i
  const selected = [
    ...frontendFiles.map((file) => path.relative(path.join(frontendRoot, 'dist'), file).replaceAll('\\', '/')),
    ...adminFiles.map((file) => `admin/${path.relative(path.join(apiRoot, 'public', 'admin'), file).replaceAll('\\', '/')}`),
    'index.php', '.htaccess', 'uploads/.htaccess',
  ]
  assert.deepEqual(selected.filter((name) => forbiddenNames.test(name)), [])
  return { excludedLocalPublicDirectory: 'api/public/_dev' }
})
await check('uploads are a separate required artifact', async () => {
  uploadFiles = await filesBelow(path.join(apiRoot, 'public', 'uploads'))
  assert.ok(uploadFiles.some((file) => path.basename(file) === '.htaccess'))
  return { files: uploadFiles.length, bytes: await totalBytes(uploadFiles), restoreSeparately: true }
})
await check('local credentials are excluded and Gmail delivery remains disabled', async () => {
  const gmail = await readFile(path.join(apiRoot, 'config', 'gmail.php'), 'utf8')
  assert.match(gmail, /['"]delivery_enabled['"]\s*=>\s*false/)
  const excluded = [
    'api/config/local.php', 'api/config/auth.local.php', 'api/config/media.local.php',
    'api/config/gmail.local.php', 'api/storage/auth.key', 'api/storage/local-test-account.json',
  ]
  return { excluded }
})

const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Offline, read-only deployment artifact inspection. No network, database, uploads or hosting changes.',
  targets: { frontOrigin, apiOrigin },
  checks,
  passed: checks.filter((item) => item.status === 'pass').length,
  failed: checks.filter((item) => item.status === 'fail').length,
  requiredOnHost: [
    'Create private config/local.php and config/auth.local.php outside both document roots.',
    'Generate a new production AUTH_HMAC_KEY and one-time setup key; never upload local auth.key or test account.',
    'Create writable private storage/sessions, storage/media-temp and HTMLPurifier cache directories.',
    'Import the database dump separately and restore api/public/uploads separately.',
    'Keep api/public/_dev, api/tests, local config files, logs and backups out of public roots.',
    'Leave Gmail delivery disabled until the separately authorized final stage.',
  ],
}
await mkdir(path.join(frontendRoot, 'reports'), { recursive: true })
const target = path.join(frontendRoot, 'reports', `${reportName}.json`)
await writeFile(target, JSON.stringify(report, null, 2) + '\n')
console.table(checks.map(({ name, status, error }) => ({ name, status, error: error || '' })))
console.log(`${report.failed ? 'FAILED' : 'SUCCESS'}: ${report.passed} passed, ${report.failed} failed. Report: ${target}`)
if (report.failed) process.exitCode = 1
