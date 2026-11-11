import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { AUTHOR_NAME, DEFAULT_IMAGE, PAGE_META, SITE_URL } from '../src/config/seo.js'

const START = '<!-- seo:start -->'
const END = '<!-- seo:end -->'
const NOSCRIPT_START = '<!-- noscript:start -->'
const NOSCRIPT_END = '<!-- noscript:end -->'
const ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const safeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')

function renderSeo(pathname, meta) {
  const canonical = new URL(pathname, SITE_URL).toString()
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const image = DEFAULT_IMAGE

  return [
    START,
    '    <title>' + title + '</title>',
    '    <meta name="description" content="' + description + '" />',
    '    <meta name="author" content="' + escapeHtml(AUTHOR_NAME) + '" />',
    '    <meta name="robots" content="' + ROBOTS + '" />',
    '    <meta name="googlebot" content="' + ROBOTS + '" />',
    '    <link rel="canonical" href="' + escapeHtml(canonical) + '" />',
    '    <meta property="og:site_name" content="K.M. AFAQ" />',
    '    <meta property="og:locale" content="en_US" />',
    '    <meta property="og:type" content="website" />',
    '    <meta property="og:title" content="' + title + '" />',
    '    <meta property="og:description" content="' + description + '" />',
    '    <meta property="og:url" content="' + escapeHtml(canonical) + '" />',
    '    <meta property="og:image" content="' + escapeHtml(image) + '" />',
    '    <meta property="og:image:alt" content="Kanwar Muhammad Afaq — AI Researcher" />',
    '    <meta name="twitter:card" content="summary_large_image" />',
    '    <meta name="twitter:title" content="' + title + '" />',
    '    <meta name="twitter:description" content="' + description + '" />',
    '    <meta name="twitter:image" content="' + escapeHtml(image) + '" />',
    '    <meta name="twitter:image:alt" content="Kanwar Muhammad Afaq — AI Researcher" />',
    '    <script type="application/ld+json">' + safeJson(meta.jsonLd) + '</script>',
    '    ' + END,
  ].join('\n')
}

function injectSeo(html, seoBlock) {
  const start = html.indexOf(START)
  const end = html.indexOf(END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error('SEO markers are missing from dist/index.html')
  }
  return html.slice(0, start) + seoBlock + html.slice(end + END.length)
}

function renderNoscript(meta) {
  return [
    NOSCRIPT_START,
    '      <main style="max-width:760px;margin:48px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">',
    '        <p><strong>' + escapeHtml(meta.title) + '</strong></p>',
    '        <p>' + escapeHtml(meta.description) + '</p>',
    '        <p><a href="/about">About</a> · <a href="/projects">Projects</a> · <a href="/publications">Publications</a> · <a href="/gallery">Gallery</a> · <a href="/blog">Blog</a> · <a href="/contact">Contact</a></p>',
    '        <p><a href="/article-archive">Browse all AI and NLP articles in the archive</a></p>',
    '      </main>',
    '      ' + NOSCRIPT_END,
  ].join('\n')
}

function injectNoscript(html, block) {
  const start = html.indexOf(NOSCRIPT_START)
  const end = html.indexOf(NOSCRIPT_END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Noscript markers are missing from dist/index.html')
  }
  return html.slice(0, start) + block + html.slice(end + NOSCRIPT_END.length)
}

const SNAPSHOT_GUIDES = {
  '/publications': [
    ['Evaluation and reproducibility', 'When comparing papers in natural language processing, look for the dataset split, training settings, baseline systems, random seeds and limitations described by the authors. Multiple measurements and transparent error analysis can help distinguish a robust result from an isolated score. This index is for research discovery: readers should follow each original paper, persistent publication link or repository for the complete experimental details rather than relying only on a short portfolio summary.'],

    ['How to read this research index', 'This collection brings together scholarly work and manuscripts associated with the author’s research areas: natural language processing, code-mixed Roman Urdu, machine learning and environmental forecasting. Research publications and manuscripts are different stages of academic work, so readers should check the publication venue, version, author list, date, and available full text for each record.'],
    ['Research context', 'Roman Urdu language processing presents challenges including inconsistent spelling, mixed scripts and vocabulary, and limited annotated datasets. Research about these challenges may address classification, evaluation, tokenization, model comparison and responsible reporting. Environmental forecasting work can involve time-dependent measurements, model validation, and practical data limitations.'],
    ['Where to explore next', 'For implementation context, browse the project index. For approachable research explanations and technical notes, browse the AI and machine-learning blog. The author profile gives background and links to academic and professional information.']
  ],
  '/blog': [
    ['Reading technical examples responsibly', 'AI tooling changes quickly, so a tutorial may depend on software versions, training data and external services available when it was written. Before reusing an example, check that the dependencies remain maintained, that permissions and licensing permit your use, and that any results are evaluated on appropriate data. Where a post compares models, consider both their accuracy and computational cost. The linked projects and publications offer additional context about research work and applied implementation.'],

    ['Topics covered', 'The technical writing section focuses on artificial intelligence, natural language processing, machine learning, deep learning and practical data science. Articles may explain research ideas, experimental workflows, programming choices, evaluation metrics, or lessons from applying models to real datasets.'],
    ['Using the articles', 'Begin with the topic or problem that matches your interest. When an article discusses a research result, review its method, data, assumptions, limitations and references rather than assuming a technique works equally well everywhere. Distinguish tutorial examples from published experiments, and check publication dates before relying on technical details that may change.'],
    ['Related research material', 'The publications page groups scholarly records while the projects section describes applied work. The about page provides the researcher’s background, and the contact page supports questions about possible technical or academic collaboration.']
  ],
  '/projects': [
    ['From idea to evaluation', 'A useful machine-learning project description explains its input data, intended users and measurable objective. For a text processing system, this includes language coverage, text normalization, representations and the evaluation metric. A time-series forecasting system should describe the training horizon, prediction target, leakage controls and performance across different periods. Review code and documentation where supplied, and avoid assuming one prototype generalizes to every dataset or deployment environment.'],

    ['Project areas', 'The projects section collects applied artificial intelligence, natural language processing, machine learning and data science work. Some projects demonstrate model development and evaluation; others involve data pipelines, automation or user-facing applications. The detailed project records provide the appropriate place to check each project’s scope and technologies.'],
    ['What to examine', 'For any implementation, consider the problem definition, dataset provenance, preprocessing, validation procedure and evaluation results. A research prototype and a deployed service have different performance and reliability requirements. Results should be understood in the context of the data and setup used.'],
    ['Related pages', 'Use the publications section for research manuscripts and papers, or the blog for technical writing. The about and contact pages explain the author’s interests and ways to discuss collaboration.']
  ]
};
function renderStaticSnapshot(pathname,meta){
  const sections=SNAPSHOT_GUIDES[pathname]||[
    ['Explore this section',meta.description],
    ['Research focus','This portfolio covers natural language processing, AI and machine learning research, applied data science and technical work. Read the dedicated project, publication and article pages for methods and details, and use the contact page for collaboration enquiries.']
  ];
  const articles=sections.map(([heading,copy])=>'<section><h2>'+escapeHtml(heading)+'</h2><p>'+escapeHtml(copy)+'</p></section>').join('');
  const nav='<nav aria-label="Portfolio sections"><a href="/about">Researcher profile</a> · <a href="/projects">Projects</a> · <a href="/publications">Publications</a> · <a href="/blog">Technical articles</a> · <a href="/contact">Contact</a></nav>';
  return '<main data-seo-snapshot="true" style="max-width:760px;margin:40px auto;padding:0 20px;font-family:system-ui,sans-serif;line-height:1.65"><h1>'+escapeHtml(meta.title)+'</h1><p>'+escapeHtml(meta.description)+'</p>'+articles+nav+'</main>';
}
function injectStaticSnapshot(html,pathname,meta){
  const marker='<div id="root"></div>';
  if(!html.includes(marker))throw new Error('Vite root placeholder missing');
  return html.replace(marker,'<div id="root">'+renderStaticSnapshot(pathname,meta)+'</div>');
}

const source = await readFile('dist/index.html', 'utf8')

for (const [pathname, meta] of Object.entries(PAGE_META)) {
  const html = injectStaticSnapshot(injectNoscript(
    injectSeo(source, renderSeo(pathname, meta)),
    renderNoscript(meta)
  ), pathname, meta)
  const destination =
    pathname === '/' ? 'dist/index.html' : join('dist', pathname.slice(1), 'index.html')

  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html, 'utf8')
}

console.log('[seo] Generated server-visible metadata for ' + Object.keys(PAGE_META).length + ' public routes.')
