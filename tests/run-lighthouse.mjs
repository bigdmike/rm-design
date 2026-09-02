import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const origin = 'http://localhost:8080'
const defaultPages = ['/', '/about', '/works/6', '/workflow', '/contact']
const allowedPath = /^\/(?:$|about$|works(?:\/[1-9][0-9]*)?$|workflow$|press$|contact$|privacy-policy$)/
const args = Object.fromEntries(process.argv.slice(2).map(value => {
  const [key, ...rest] = value.replace(/^--/, '').split('=')
  return [key, rest.join('=') || true]
}))
const runs = Number(args.runs || 3)
const pages = String(args.pages || defaultPages.join(',')).split(',').filter(Boolean)
const forms = String(args.forms || 'mobile,desktop').split(',').filter(Boolean)
const reportName = String(args.report || 'lighthouse-controlled-local')
const chromePath = String(args.chrome || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
const profilesRoot = path.resolve('reports', '.lighthouse-profiles')

if (!Number.isInteger(runs) || runs < 1 || runs > 5) throw new Error('runs must be an integer from 1 to 5')
if (!pages.length || pages.some(page => !allowedPath.test(page))) throw new Error('Only known local public paths may be measured')
if (!forms.length || forms.some(form => !['mobile', 'desktop'].includes(form))) throw new Error('forms must contain mobile and/or desktop')
if (!/^[a-z0-9-]+$/i.test(reportName)) throw new Error('Invalid report name')

function pickMetric(lhr, id, digits = 0) {
  const value = lhr.audits[id]?.numericValue
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : null
}

function categoryScores(lhr) {
  return Object.fromEntries(Object.entries(lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)]))
}

function summarize(lhr, context) {
  const requests = lhr.audits['network-requests']?.details?.items || []
  const lcpNode = lhr.audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node
  const opportunities = Object.entries(lhr.audits).flatMap(([id, audit]) => {
    const savingMs = audit.details?.overallSavingsMs
    return Number.isFinite(savingMs) && savingMs > 0 ? [{ id, title: audit.title, savingMs: Math.round(savingMs) }] : []
  }).sort((a, b) => b.savingMs - a.savingMs).slice(0, 5)
  return {
    ...context,
    fetchTime: lhr.fetchTime,
    finalUrl: lhr.finalDisplayedUrl,
    scores: categoryScores(lhr),
    metrics: {
      fcpMs: pickMetric(lhr, 'first-contentful-paint'),
      lcpMs: pickMetric(lhr, 'largest-contentful-paint'),
      speedIndexMs: pickMetric(lhr, 'speed-index'),
      tbtMs: pickMetric(lhr, 'total-blocking-time'),
      cls: pickMetric(lhr, 'cumulative-layout-shift', 4),
      interactiveMs: pickMetric(lhr, 'interactive'),
      transferBytes: pickMetric(lhr, 'total-byte-weight'),
      requestCount: requests.length,
      fontRequests: requests.filter(item => item.resourceType === 'Font').length,
      fontBytes: requests.filter(item => item.resourceType === 'Font').reduce((sum, item) => sum + (item.transferSize || 0), 0),
    },
    lcpElement: lcpNode ? { selector: lcpNode.selector, label: lcpNode.nodeLabel } : null,
    opportunities,
    failedAudits: Object.entries(lhr.audits)
      .filter(([, audit]) => audit.score !== null && audit.score < 1 && !['manual', 'notApplicable', 'informative'].includes(audit.scoreDisplayMode))
      .map(([id]) => id),
  }
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (!sorted.length) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function aggregate(records) {
  const groups = new Map()
  for (const record of records) {
    const key = `${record.formFactor}|${record.cache}|${record.path}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(record)
  }
  return [...groups.values()].map(group => ({
    formFactor: group[0].formFactor,
    cache: group[0].cache,
    path: group[0].path,
    runs: group.length,
    scores: Object.fromEntries(Object.keys(group[0].scores).map(key => [key, median(group.map(item => item.scores[key]))])),
    metrics: Object.fromEntries(Object.keys(group[0].metrics).map(key => [key, median(group.map(item => item.metrics[key]))])),
    lcpElements: [...new Map(group.map(item => [item.lcpElement?.selector || 'unknown', item.lcpElement])).values()],
    recurringFailures: [...new Set(group.flatMap(item => item.failedAudits))].filter(id => group.every(item => item.failedAudits.includes(id))),
  }))
}

const records = []
let versions
for (const formFactor of forms) {
  const profileDir = path.resolve(profilesRoot, `${process.pid}-${formFactor}`)
  if (!profileDir.startsWith(profilesRoot + path.sep)) throw new Error('Invalid Lighthouse profile path')
  await fs.mkdir(profileDir, { recursive: true })
  const chrome = await launch({
    chromePath,
    userDataDir: profileDir,
    chromeFlags: [
      '--headless=new',
      '--in-process-gpu',
      '--disable-software-rasterizer',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-component-update',
    ],
    logLevel: 'silent',
  })
  try {
    for (let run = 1; run <= runs; run++) {
      for (const page of pages) {
        for (const cache of ['cold', 'warm']) {
          const baseConfig = formFactor === 'desktop' ? desktopConfig : { extends: 'lighthouse:default' }
          const config = cache === 'warm'
            ? { ...baseConfig, settings: { ...(baseConfig.settings || {}), disableStorageReset: true } }
            : baseConfig
          const result = await lighthouse(origin + page, {
            port: chrome.port,
            output: 'json',
            logLevel: 'error',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          }, config)
          if (!result?.lhr || result.lhr.runtimeError) throw new Error(`${formFactor} ${cache} ${page}: ${result?.lhr?.runtimeError?.message || 'Lighthouse failed'}`)
          versions ||= { lighthouse: result.lhr.lighthouseVersion, userAgent: result.lhr.userAgent, hostUserAgent: result.lhr.environment.hostUserAgent }
          const record = summarize(result.lhr, { formFactor, cache, path: page, run })
          records.push(record)
          console.log(`PASS ${formFactor} ${cache} run ${run} ${page}: perf=${record.scores.performance} LCP=${record.metrics.lcpMs}ms CLS=${record.metrics.cls}`)
        }
      }
    }
  } finally {
    try {
      await chrome.kill()
    } catch {
      // Chrome may already have exited after an audit failure.
    }
    await fs.rm(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }).catch(error => {
      console.warn(`WARN: Temporary Chrome profile could not be removed: ${error.message}`)
    })
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  origin,
  node: process.version,
  versions,
  methodology: {
    runs,
    pages,
    forms,
    cacheOrder: ['cold', 'warm'],
    throttling: 'Lighthouse 12 default simulated mobileSlow4G / desktopDense4G with matching CPU slowdown',
    note: 'Cold resets storage; warm immediately follows in the same temporary Chrome profile. Local Docker, no exclusive CPU reservation. Headless Chrome uses an in-process GPU workaround for the restricted Windows runner.',
  },
  summary: aggregate(records),
  records,
}
await fs.mkdir(path.resolve('reports'), { recursive: true })
const target = path.resolve('reports', `${reportName}.json`)
await fs.writeFile(target, JSON.stringify(report, null, 2) + '\n')
console.log(`SUCCESS: ${records.length} Lighthouse audits. Report: ${target}`)
