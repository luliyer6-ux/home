"""Rebuild public article snapshots atomically. Uses only Python's standard library."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from urllib.request import build_opener, ProxyHandler, Request
from urllib.parse import urljoin, urlsplit
import json, re, os, shutil, tempfile, concurrent.futures, datetime, sys, time
ROOT=Path(__file__).resolve().parent.parent
ORIGIN='https://luliy.me';SOURCE='https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/'
# Mainland China cannot reliably reach GitHub's hosts, so article photos load through this site's relay
# (functions/gh/, README 9.4). The original address stays in data-direct for the fallback in render().
GH=[(re.compile(r'^https://raw\.githubusercontent\.com/luliy6/luliy6\.github\.io/(?:refs/heads/)?main/(?=(?:docs|static)/)'),'/gh/raw/'),
 (re.compile(r'^https://github\.com/user-attachments/assets/(?=[0-9a-f]{8}-)',re.I),'/gh/ua/'),
 (re.compile(r'^https://camo\.githubusercontent\.com/(?=[0-9a-f]{20})',re.I),'/gh/camo/')]
def relay(u):
 for pattern,path in GH:
  if pattern.match(u):return pattern.sub(path,u,1)
 return u
def absolute(u):return ORIGIN+u if u.startswith('/') else u
RESERVED={'about','archive','book','gallery','favorites','chronicle','chronicle-data','timeline','stock','link','library'}
ALLOWED=set('a abbr b blockquote br code del details div em figcaption figure h1 h2 h3 h4 h5 h6 hr i img kbd li ol p pre s small span strong sub summary sup table tbody td th thead tr u ul'.split())
DROP=set('script style iframe object embed svg form button canvas meta link input select textarea'.split());VOID={'br','hr','img'}
class Node:
 def __init__(self,tag='',attrs=None):self.tag=tag;self.attrs=dict(attrs or []);self.children=[]
class Document(HTMLParser):
 def __init__(self,html):
  super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root];self.feed(html)
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs);self.stack[-1].children.append(n)
  if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:self.stack.append(n)
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.handle_endtag(tag)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):self.stack[-1].children.append(data)
def walk(n):
 if isinstance(n,str):return
 yield n
 for c in n.children:yield from walk(c)
def text(n):return n if isinstance(n,str) else ''.join(text(c) for c in n.children)
def safe_url(raw,base):
 u=urljoin(base,raw)
 return u if urlsplit(u).scheme in {'http','https','mailto'} else ''
def clean(node,base,toc,pid,literal=False):
 if isinstance(node,str):
  if pid=='P51' and not literal:node=re.sub(r'(?<=[\u3400-\u9fff])([,.])(?=[\u3400-\u9fff\s]|$)',lambda m:'，' if m[1]==',' else '。',node)
  return escape(node)
 if node.tag in DROP:return ''
 attrs={}
 if node.tag=='a':
  u=safe_url(node.attrs.get('href',''),base)
  if u:attrs={'href':u,'rel':'noopener noreferrer'}
 if node.tag=='img':
  u=safe_url(node.attrs.get('src',''),base)
  if not u or urlsplit(u).scheme not in {'http','https'}:return ''
  attrs={'src':relay(u),'alt':node.attrs.get('alt',''),'loading':'lazy','decoding':'async','referrerpolicy':'no-referrer'}
  if attrs['src']!=u:attrs.update({'data-direct':u,'onerror':'this.onerror=null;this.src=this.dataset.direct'})
 if node.tag in {'pre','code'}:
  value=' '.join(c for c in node.attrs.get('class','').split() if re.fullmatch(r'language-[\w-]+',c))
  if value:attrs['class']=value
 if node.tag=='th' and node.attrs.get('scope') in {'row','col','rowgroup','colgroup'}:attrs['scope']=node.attrs['scope']
 if re.fullmatch('h[1-6]',node.tag):
  attrs['id']='heading-'+str(len(toc)+1);toc.append((int(node.tag[1]),text(node).strip(),attrs['id']))
 children=''.join(clean(c,base,toc,pid,literal or node.tag in {'pre','code','a'}) for c in node.children)
 if node.tag not in ALLOWED:return children
 rendered=''.join(' '+k+'="'+escape(v,quote=True)+'"' for k,v in attrs.items())
 return '<'+node.tag+rendered+'>'+('' if node.tag in VOID else children+'</'+node.tag+'>')
def fetch(url):
 proxy=os.environ.get('SITE_BUILD_PROXY');opener=build_opener(ProxyHandler({'https':proxy,'http':proxy}) if proxy else ProxyHandler())
 for attempt in range(3):
  try:
   with opener.open(Request(url,headers={'User-Agent':'Luliy-static-publisher/1.0'}),timeout=40) as r:
    data=r.read(8*1024*1024+1)
    if len(data)>8*1024*1024:raise ValueError('Source too large')
    return data.decode('utf-8-sig')
  except (OSError,TimeoutError):
   if attempt==2:raise
   time.sleep(1+attempt)

def entries(feed):
 # Gmeek feed contains an issue-number keyed posts mapping.
 posts=feed.get('posts',feed)
 if isinstance(posts,dict):items=list(posts.items())
 elif isinstance(posts,list):items=[(p.get('number',p.get('id')),p) for p in posts]
 else:raise ValueError('Invalid feed shape')
 result=[]
 for number,item in items:
  if not isinstance(item,dict) or not item.get('postUrl'):continue
  labels=[str(v.get('name','') if isinstance(v,dict) else v) for v in item.get('labels',[])];lower={v.lower() for v in labels}
  if lower&RESERVED:continue
  pid='P'+str(number).removeprefix('P')
  if not re.fullmatch(r'P\d+',pid):raise ValueError('Invalid public article identity')
  result.append(dict(item,id=pid,labels=labels))
 if not result:raise ValueError('No public articles; refusing empty publication')
 return sorted(result,key=lambda x:(x.get('createdDate',''),int(x['id'][1:])),reverse=True)
def build_one(item,pages):
 url=urljoin(SOURCE,item['postUrl'])
 if not url.startswith(SOURCE+'post/'):raise ValueError('Unexpected public source URL')
 doc=Document(pages.get(url) or fetch(url));body=next((n for n in walk(doc.root) if n.attrs.get('id')=='postBody'),None)
 if not body or not (text(body).strip() or any(n.tag=='img' for n in walk(body))):raise ValueError('Missing article body: '+item['id'])
 toc=[];content=''.join(clean(c,'https://blog.luliy.me/'+item['postUrl'],toc,item['id']) for c in body.children)
 title=item.get('postTitle') or item.get('title');date=item.get('createdDate','')
 if not title:raise ValueError('Missing title')
 summary=re.sub(r'\s+',' ',text(body)).strip()[:150] or title+' · Luliy 圖文記錄';image=absolute(relay(next((safe_url(n.attrs.get('src',''),'https://blog.luliy.me/'+item['postUrl']) for n in walk(body) if n.tag=='img'),ORIGIN+'/assets/site/share.png')))
 return dict(item,title=title,date=date,summary=summary,image=image,body=content,toc=toc)
def render(p):
 e=lambda x:escape(str(x),quote=True);url=ORIGIN+'/articles/'+p['id']+'/'
 toc=''.join('<a style="--level:'+str(level)+'" href="#'+id+'">'+e(title)+'</a>' for level,title,id in p['toc'])
 return f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(p['title'])} · Luliy Articles</title><meta name="description" content="{e(p['summary'])}"><link rel="canonical" href="{url}"><link rel="alternate" type="application/rss+xml" title="Luliy Articles" href="/feed.xml"><meta property="og:type" content="article"><meta property="og:title" content="{e(p['title'])}"><meta property="og:description" content="{e(p['summary'])}"><meta property="og:url" content="{url}"><meta property="og:image" content="{e(p['image'])}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(p['title'])}"><meta name="twitter:description" content="{e(p['summary'])}"><meta name="twitter:image" content="{e(p['image'])}"><link rel="stylesheet" href="/site-publish/article.css"></head><body><header><a href="/">LULIY <small>Articles</small></a><a href="/#/article/{p['id']}">在主站閱讀 ↗</a></header><main><h1>{e(p['title'])}</h1><p class="meta">{e(p['date'])} · LULIY</p><div class="reading"><aside aria-label="文章目錄">{toc or '此文章沒有目錄'}</aside><article>{p['body']}</article></div></main><footer><a href="/feed.xml">RSS 訂閱</a> · <a href="/#/posts">所有文章</a> · <a href="#">回到頂部 ↑</a></footer></body></html>'''
def generate(dest):
 raw_feed=fetch(SOURCE+'postList.json');feed=json.loads(raw_feed);items=entries(feed)
 # Every page in the feed (reserved ones too: the home page reads them), for the mirror below.
 listed=feed.get('posts',feed);listed=listed.values() if isinstance(listed,dict) else listed
 names=sorted({v['postUrl'] for v in listed if isinstance(v,dict) and re.fullmatch(r'post/[\w.%-]+\.html',str(v.get('postUrl','')))})
 def grab(name):
  try:return name,fetch(SOURCE+name)
  except (OSError,TimeoutError,ValueError):return name,None
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:pages=dict(pool.map(grab,names+['about.html']))
 sources={SOURCE+k:v for k,v in pages.items() if v}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:posts=list(pool.map(lambda i:build_one(i,sources),items))
 temp=Path(tempfile.mkdtemp(prefix='luliy-static-'))
 try:
  for p in posts:
   folder=temp/'articles'/p['id'];folder.mkdir(parents=True);(folder/'index.html').write_text(render(p),encoding='utf8')
  rss=['<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Luliy Articles</title><link>https://luliy.me/</link><description>Luliy 的文章與思考</description><language>zh-Hant</language>']
  urls=[ORIGIN+'/']
  for p in posts:
   url=ORIGIN+'/articles/'+p['id']+'/';urls.append(url);date=datetime.datetime.fromisoformat(p['date'][:10]).replace(tzinfo=datetime.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')
   rss.append('<item><title>'+escape(p['title'])+'</title><link>'+url+'</link><guid isPermaLink="true">'+url+'</guid><description>'+escape(p['summary'])+'</description><pubDate>'+date+'</pubDate></item>')
  (temp/'feed.xml').write_text(''.join(rss)+'</channel></rss>',encoding='utf8')
  (temp/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+escape(u)+'</loc></url>' for u in urls)+'</urlset>',encoding='utf8')
  (temp/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /mirror/\nSitemap: https://luliy.me/sitemap.xml\n',encoding='utf8')
  (temp/'public-articles.json').write_text(json.dumps([{k:v for k,v in p.items() if k in {'id','title','date','summary','image'}} for p in posts],ensure_ascii=False,indent=2),encoding='utf8')
  # mirror/: plain copies of the blog's article list and pages, the relay's last resort when GitHub is unreachable
  # and its edge cache is empty. A page that could not be read today keeps yesterday's copy. Pages are stored as
  # .txt (never served as pages of this site) with % written as ~; functions/gh/ asks for the same names.
  (temp/'mirror'/'post').mkdir(parents=True);(temp/'mirror'/'postList.json').write_text(raw_feed,encoding='utf8')
  for name,html in pages.items():
   name=name.replace('%','~')+'.txt';old=dest/'mirror'/name
   if html is None and old.exists():html=old.read_text(encoding='utf8')
   if html is not None:(temp/'mirror'/name).write_text(html,encoding='utf8')
  dest.mkdir(parents=True,exist_ok=True)
  if (dest/'mirror').exists():shutil.rmtree(dest/'mirror')
  shutil.copytree(temp/'mirror',dest/'mirror')
  existing=dest/'articles'
  if existing.exists():shutil.rmtree(existing)
  shutil.copytree(temp/'articles',existing)
  for name in ['feed.xml','sitemap.xml','robots.txt','public-articles.json']:shutil.copyfile(temp/name,dest/name)
  print('Generated',len(posts),'complete public articles')
 finally:shutil.rmtree(temp)
if __name__=='__main__':generate(Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT)
