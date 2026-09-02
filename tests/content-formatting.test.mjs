import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('plain textarea content is rendered as text with preserved whitespace', async () => {
  const [work, banner, header, about, workflow, privacy] = await Promise.all([
    read('../src/components/home/WorkSection.vue'),
    read('../src/components/home/BannerSection.vue'),
    read('../src/components/workList/HeaderSection.vue'),
    read('../src/components/about/CoverSection.vue'),
    read('../src/components/workflow/CoverSection.vue'),
    read('../src/components/SitePrivacyDialog.vue'),
  ])
  assert.doesNotMatch(work, /v-html="props\.content"/)
  for (const source of [work, banner, header, about, workflow, privacy]) assert.match(source, /preserve-whitespace/)
})

test('rich HTML containers use the shared editor-content contract', async () => {
  const [work, terms, about, step, question] = await Promise.all([
    read('../src/views/WorkPageView.vue'),
    read('../src/views/TermsPageView.vue'),
    read('../src/components/about/ContentSection.vue'),
    read('../src/components/workflow/StepSection.vue'),
    read('../src/components/workflow/QuestionSection.vue'),
  ])
  for (const source of [work, terms, about, step, question]) assert.match(source, /editor-content/)
  assert.doesNotMatch(terms, /editor_content/)
})

test('SSR escapes homepage textarea content and uses the same classes as Vue', async () => {
  const [page, section, site] = await Promise.all([
    read('../../api/templates/public-page.php'),
    read('../../api/templates/public-section.php'),
    read('../../api/app/Content/PublicSite.php'),
  ])
  assert.match(page, /content preserve-whitespace[^\n]+\$this->e\(\$work\['content'\]\)/)
  assert.doesNotMatch(page, /<p class="content"><\?= \$work\['content'\]/)
  assert.match(section, /body_text[\s\S]*preserve-whitespace|preserve-whitespace[\s\S]*body_text/)
  assert.match(site, /content editor-content/)
})
