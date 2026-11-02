# Auditoría de contraste (WCAG AA) con navegador real: python3 tools/contrast.py
import sys,json,os
from playwright.sync_api import sync_playwright
JS="""()=>{const P=s=>{const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const v=m[1].split(',').map(Number);return{r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}};
const L=c=>{const f=x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)};
const bg=e=>{let acc=[];while(e){const b=P(getComputedStyle(e).backgroundColor);if(b&&b.a>0){acc.push(b);if(b.a>=1)break}e=e.parentElement}let base={r:255,g:255,b:255};for(let i=acc.length-1;i>=0;i--){const c=acc[i];base={r:c.r*c.a+base.r*(1-c.a),g:c.g*c.a+base.g*(1-c.a),b:c.b*c.a+base.b*(1-c.a)}}return base};
const ruleFor=el=>{for(let e=el;e&&e.id!=='app';e=e.parentElement){let found=null;for(const sh of document.styleSheets)for(const r of sh.cssRules){if(r.type!==1||!r.style.color)continue;for(const part of r.selectorText.split(',')){const q=part.trim();try{if(e.matches(q))found=q}catch(x){}}}if(found)return{sel:found}}return null};
const out={};document.querySelectorAll('#app *').forEach(e=>{if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||e.offsetParent===null&&cs.position!=='fixed')return;const fg=P(cs.color),b=bg(e);const l1=L(fg),l2=L(b),r=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.6&&+cs.fontWeight>=700);if(r<(big?3:4.5)){const k=e.tagName.toLowerCase()+'.'+[...e.classList].join('.');out[k]=out[k]||{n:0,r:+r.toFixed(2),fg:cs.color,bg:`rgb(${b.r|0},${b.g|0},${b.b|0})`,rules:[]};out[k].n++;if(out[k].rules.length<3){const rl=ruleFor(e);if(rl)out[k].rules.push(Object.assign(rl,{aside:!!e.closest('aside'),bg:[b.r|0,b.g|0,b.b|0],fg:[fg.r,fg.g,fg.b]}))}}});return out}"""
import threading,http.server,functools
def serve(port=8765):
    h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd())
    h.log_message=lambda *a:None
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*a): pass
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',port),functools.partial(H,directory=os.getcwd()))
    threading.Thread(target=srv.serve_forever,daemon=True).start(); return srv
def run(pages=('inicio','panel','compare','scope','requirements','controls','current','actions','library','settings','companies','informe','detail'),themes=('claro','oscuro')):
    res={}; serve()
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':900})
        pg.goto('http://127.0.0.1:8765/index.html'); pg.evaluate("loadDemo()")
        for t in themes:
            pg.evaluate(f"db.settings.theme='{t}';save()")
            for h in pages:
                pg.evaluate(f"location.hash='{h}'"); pg.evaluate("render()")
                for k,v in pg.evaluate(JS).items(): res.setdefault(f'{t}|{k}',dict(v,pages=[]))['pages'].append(h)
        pg.screenshot(path='/home/claude/w/shot.png'); b.close()
    return res
if __name__=='__main__':
    r=run(); bad=sorted(r.items(),key=lambda kv:kv[1]['r'])
    for k,v in bad[:40]: print(f"{v['r']:>5} {k}  fg={v['fg']} bg={v['bg']} x{v['n']} {','.join(v['pages'][:3])}")
    print(len(bad),'combinaciones por debajo de AA'); sys.exit(1 if bad else 0)

