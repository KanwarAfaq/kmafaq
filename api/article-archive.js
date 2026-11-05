const SITE='https://kmafaq.site';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validSlug=s=>typeof s==='string' && s.trim() && !/[\/?#]/.test(s) && s.length<220;
export function renderArchive(rows){
 const seen=new Set();
 const entries=(Array.isArray(rows)?rows:[]).filter(r=>validSlug(r.slug)&&typeof r.title==='string'&&r.title.trim())
  .filter(r=>{if(seen.has(r.slug))return false;seen.add(r.slug);return true;});
 const list=entries.map(r=>'<li><a href="/blog/'+encodeURIComponent(r.slug)+'">'+esc(r.title)+'</a>'+
   (r.excerpt?'<p>'+esc(r.excerpt).slice(0,240)+'</p>':'')+'</li>').join('');
 const title='AI & NLP Article Archive | K.M. AFAQ';
 const description='Browse research articles, artificial intelligence tutorials and NLP notes from Kanwar Muhammad Afaq.';
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'">'+
 '<meta name="robots" content="index,follow"><link rel="canonical" href="'+SITE+'/article-archive">'+
 '<style>body{font:16px/1.65 system-ui;background:#f7fafc;color:#18304b;max-width:950px;margin:auto;padding:28px 20px}a{color:#075caa}li{margin:14px 0;padding:12px 16px;border:1px solid #dde7f0;border-radius:12px;background:white}li p{margin:6px 0 0;color:#526579;font-size:14px}nav{display:flex;gap:18px;margin-bottom:28px}h1{line-height:1.2}ol{padding-left:26px}</style></head><body>'+
 '<nav aria-label="Breadcrumb"><a href="/">K.M. AFAQ</a><a href="/blog">Blog</a></nav>'+
 '<main><h1>'+esc(title)+'</h1><p>'+esc(description)+'</p>'+
 (entries.length?'<ol>'+list+'</ol>':'<p>Articles are currently unavailable. Please revisit the main blog.</p>')+
 '</main><footer><a href="/blog">Back to all blog posts</a></footer></body></html>';
}
export default async function handler(req,res){
 if(req.method!=='GET'&&req.method!=='HEAD'){res.setHeader('Allow','GET, HEAD');return res.status(405).end();}
 const base=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL;
 const key=process.env.SUPABASE_ANON_KEY||process.env.VITE_SUPABASE_ANON_KEY;
 if(!base||!key){res.setHeader('Retry-After','300');return res.status(503).end('Article archive unavailable');}
 try{
  const url=new URL('/rest/v1/blogs',base);url.searchParams.set('select','slug,title,excerpt');
  url.searchParams.set('slug','not.is.null');url.searchParams.set('order','date.desc');url.searchParams.set('limit','500');
  const resp=await fetch(url,{headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json'},signal:AbortSignal.timeout(10000)});
  if(!resp.ok)throw new Error('Blog data HTTP '+resp.status);
  const rows=await resp.json();
  if(!Array.isArray(rows))throw new Error('Invalid article listing');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
  res.status(200);if(req.method==='HEAD')return res.end();
  return res.send(renderArchive(rows));
 }catch(error){console.error('[article-archive]',error.message);res.setHeader('Retry-After','300');return res.status(503).end('Article archive temporarily unavailable');}
}
