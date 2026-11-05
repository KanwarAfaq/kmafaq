import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderArchive } from '../api/article-archive.js';

test('archive exposes safe crawlable article URLs and canonical metadata',()=>{
  const html=renderArchive([
    {slug:'roman-urdu-nlp-challenges',title:'Roman Urdu NLP Challenges',excerpt:'Research and language analysis'},
    {slug:'roman-urdu-nlp-challenges',title:'Duplicate title'},
    {slug:'github-pages-react-deployment',title:'React Deployment',excerpt:'Static hosting'},
  ]);
  assert.match(html,/<title>AI &amp; NLP Article Archive/);
  assert.match(html,/rel="canonical" href="https:\/\/kmafaq.site\/article-archive"/);
  assert.match(html,/href="\/blog\/roman-urdu-nlp-challenges"/);
  assert.match(html,/href="\/blog\/github-pages-react-deployment"/);
  assert.equal((html.match(/href="\/blog\/roman-urdu-nlp-challenges"/g)||[]).length,1);
});
test('archive escapes injected titles and rejects unsafe slugs',()=>{
 const html=renderArchive([{slug:'unsafe/../path',title:'Bad slug'},
   {slug:'safe-article',title:'<img src=x onerror=alert(1)>'}]);
 assert.doesNotMatch(html,/href="\/blog\/unsafe/);
 assert.doesNotMatch(html,/<img src=x/);
 assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
});
test('sitemap and deployed route advertise the real server-rendered archive',()=>{
 const cfg=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
 assert.ok(cfg.rewrites.some(x=>x.source==='/article-archive'&&x.destination==='/api/article-archive'));
 const sitemap=fs.readFileSync(new URL('../api/sitemap.js',import.meta.url),'utf8');
 assert.match(sitemap,/'\/article-archive'/);
 const generator=fs.readFileSync(new URL('../scripts/generate-static-pages.mjs',import.meta.url),'utf8');
 assert.match(generator,/href="\/article-archive"/);
});
