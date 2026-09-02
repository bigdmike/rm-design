import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const shell = await readFile(path.join(dist, 'index.html'), 'utf8')
await writeFile(path.join(dist, 'app-shell.html'), shell, 'utf8')
await copyFile(path.join(root, 'server', 'index.php'), path.join(dist, 'index.php'))
await copyFile(path.join(root, 'server', '.htaccess'), path.join(dist, '.htaccess'))
