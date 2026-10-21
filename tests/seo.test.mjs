import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import handler from '../api/sitemap.js'
import blogHandler from '../api/blog-page.js'
import { renderBlogHtml } from '../server/blog-html.js'
const setEnv = t => {
 const old = {...process.env}; process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_ANON_KEY='test';
 t.after(()=>{process.env=old})
}
const response = () => ({headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},end(body=''){this.body=body;return this},send(body){return this.end(body)}})

test('article first HTML has its own canonical, original text and escaped schema',()=>{
 const html=renderBlogHtml(readFileSync(new URL('../index.html', import.meta.url),'utf8'),{title:'Test <Article>',excerpt:'Original summary',content:'<p>Original article.</p><script>alert(1)</script>',date:'invalid'},'test-article')
 assert.match(html,/href="https:\/\/kmafaq.site\/blog\/test-article"/)
 assert.match(html,/Original article\./)
 assert.doesNotMatch(html,/alert\(1\)|href="https:\/\/kmafaq.site\/"|Invalid Date/)
 const schema=JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)[1])
 assert.equal(schema.headline,'Test <Article>')
 assert.equal(schema.datePublished,undefined)
})
test('sitemap paginates all rows and escapes slugs',async t=>{
 setEnv(t)
 const offsets=[]
 t.mock.method(globalThis,'fetch',async u=>{offsets.push(u.searchParams.get('offset'));return new Response(JSON.stringify(offsets.length===1?Array.from({length:1000},(_,i)=>({slug:'post-'+i,date:'2026-01-01'})):[{slug:'last & one',date:'invalid'}]))})
 const res=response();await handler({method:'GET'},res)
 assert.equal(res.statusCode,200);assert.deepEqual(offsets,['0','1000']);assert.match(res.body,/last%20%26%20one/)
 assert.equal((res.body.match(/<url>/g)||[]).length,1010)
})
test('database errors cannot publish a partial sitemap or turn an article into 404',async t=>{
 setEnv(t)
 t.mock.method(globalThis,'fetch',async()=>new Response('{}',{status:503}))
 for(const [fn,req] of [[handler,{method:'GET'}],[blogHandler,{method:'GET',query:{slug:'known'}}]]){
  const res=response();await fn(req,res);assert.equal(res.statusCode,503);assert.equal(res.headers['Cache-Control'],'no-store')
 }
})
test('missing articles return real 404 without caching',async t=>{
 setEnv(t)
 t.mock.method(globalThis,'fetch',async()=>new Response('[]'))
 const res=response();await blogHandler({method:'GET',query:{slug:'missing'}},res)
 assert.equal(res.statusCode,404);assert.match(res.headers['X-Robots-Tag'],/noindex/)
})
