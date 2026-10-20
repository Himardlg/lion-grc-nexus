# Genera correcciones de contraste a partir de la auditoría: python3 tools/contrast_fix.py >> assets/app.css
import colorsys,re,sys,json
sys.path.insert(0,'tools'); import contrast
def lum(c):
    f=lambda x:(x/255/12.92 if x/255<=.03928 else ((x/255+.055)/1.055)**2.4); return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])
def cr(a,b):
    l1,l2=lum(a),lum(b); return (max(l1,l2)+.05)/(min(l1,l2)+.05)
def adjust(fg,bgs,lighten):
    h,l,s=colorsys.rgb_to_hls(*[x/255 for x in fg])
    for _ in range(100):
        c=[round(x*255) for x in colorsys.hls_to_rgb(h,l,s)]
        if all(cr(c,b)>=5 for b in bgs): return '#%02x%02x%02x'%tuple(c)
        l=min(1,l+.01) if lighten else max(0,l-.01)
    return '#ffffff' if lighten else '#000000'
res=contrast.run(); groups={}
for k,v in res.items():
    th=k.split('|')[0]
    for r in v['rules']: groups.setdefault((th,r['aside'],r['sel']),[]).append(r)
print('\n/* contraste automático */')
for (th,aside,sel),rs in groups.items():
    if 'theme-' in sel: continue
    dark=aside or th=='oscuro'; col=adjust(rs[0]['fg'],[r['bg'] for r in rs],dark)
    pre='.shell aside ' if aside else f'.theme-{th} main '
    print(f'{pre}{sel}{{color:{col}}}')
