// GRC Nexus — Apartado B: importación SoA, snapshots, demos, alertas,
// búsqueda ampliada y enlaces de consulta. Licencia GPL-2.0-or-later.
(function(){
  const normText = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const dateOnly = v => String(v||'').slice(0,10);
  const escText = v => typeof esc==='function' ? esc(v) : String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const activeCompany = () => typeof ctx==='function' ? ctx() : null;

  // ---------- Alertas de inicio ----------
  function nexusAlerts(){
    const c=activeCompany();
    if(!c || !c.id) return '';
    const today=new Date(); today.setHours(0,0,0,0);
    const soon=new Date(today); soon.setDate(soon.getDate()+14);
    const items=[];
    (c.actions||[]).forEach(a=>{
      if(a.status==='Completada'||a.status==='Verificada') return;
      if(!a.due) return;
      const d=new Date(a.due+'T00:00:00');
      if(Number.isNaN(d.getTime())) return;
      if(d<today) items.push({level:'critical',title:'Acción vencida',detail:(a.title||'Acción sin título')+' · '+a.due});
      else if(d<=soon) items.push({level:'warning',title:'Acción próxima a vencer',detail:(a.title||'Acción sin título')+' · '+a.due});
    });
    (c.evidence||[]).forEach(e=>{
      const status=normText(e.status);
      const d=e.reviewDate?new Date(e.reviewDate+'T00:00:00'):null;
      if(status==='obsoleta'||status==='caducada'||(d&&!Number.isNaN(d.getTime())&&d<today)){
        items.push({level:'critical',title:'Evidencia caducada o pendiente de revisión',detail:(e.title||'Evidencia')+(e.reviewDate?' · revisar '+e.reviewDate:'')});
      } else if(status==='revisar') items.push({level:'warning',title:'Evidencia pendiente de revisión',detail:e.title||'Evidencia'});
    });
    (c.audits||[]).forEach(a=>{
      if(normText(a.status)==='planificada'){
        items.push({level:'warning',title:'Auditoría planificada sin iniciar',detail:(a.name||'Auditoría')+(a.date?' · '+a.date:'')});
      }
    });
    if(!items.length) return `<section class="panel"><div class="panelhead"><div><h2>Alertas de seguimiento</h2><p>No se detectan alertas con las fechas y estados registrados.</p></div><span class="pill">Al día</span></div></section>`;
    return `<section class="panel"><div class="panelhead"><div><h2>Alertas de seguimiento</h2><p>${items.length} asunto(s) requieren atención.</p></div><a class="buttonlink" href="#actions">Revisar plan</a></div>${items.slice(0,12).map(x=>`<div class="line"><div><b>${x.level==='critical'?'⚠':'◷'} ${escText(x.title)}</b><small>${escText(x.detail)}</small></div><span class="pill">${x.level==='critical'?'Prioritaria':'Próxima'}</span></div>`).join('')}${items.length>12?`<small>Se muestran 12 de ${items.length} alertas.</small>`:''}</section>`;
  }

  // ---------- Demos sectoriales ----------
  function loadDemoSector(kind){
    const profiles={
      public:{name:'Administración Pública · demo ENS alto',sector:'Administración pública',size:'Grande',employees:'1200',criticality:'alta',public:true,financial:false,ai:false,sensitive:true,ensCategory:'alta',selected:['ens'],nis2Class:'fuera',target:3,desc:'ENS alto'},
      fintech:{name:'Fintech · demo ISO 27001 + NIS2',sector:'Servicios financieros / fintech',size:'Mediana',employees:'180',criticality:'alta',public:false,financial:true,ai:false,sensitive:true,ensCategory:'',selected:['iso27001','nis2'],nis2Class:'esencial',target:3,desc:'ISO 27001 + NIS2'},
      ai:{name:'Startup IA · demo ISO 42001',sector:'Desarrollo de inteligencia artificial',size:'Pequeña',employees:'24',criticality:'media',public:false,financial:false,ai:true,sensitive:true,ensCategory:'',selected:['iso42001'],nis2Class:'fuera',target:2,desc:'ISO 42001'}
    };
    const p=profiles[kind]||profiles.public;
    const c=blankCompany(p.name);
    Object.assign(c,{sector:p.sector,size:p.size,employees:p.employees,criticality:p.criticality,public:p.public,financial:p.financial,ai:p.ai,sensitive:p.sensitive,ensCategory:p.ensCategory,nis2Class:p.nis2Class,selected:p.selected.slice(),target:p.target,wizard:null});
    C.controls.forEach((ctl,i)=>{
      const relevant=ctl.fw.some(f=>c.selected.includes(f));
      const seed=kind==='public'?(i%6===0?2:kind==='public'&&relevant?3:1):kind==='fintech'?(i%5===0?1:relevant?3:0):(i%4===0?1:relevant?2:0);
      c.assess[ctl.id]={level:seed,owner:kind==='public'?'Responsable de seguridad':kind==='fintech'?'CISO / Riesgos':'Responsable de IA',evidence:''};
    });
    c.actions=[
      {title:'Validar alcance y responsabilidades de '+p.desc,control:(C.controls[0]||{}).id||'',fw:p.selected.map(f=>fw(f)?.short||f),owner:'Responsable de cumplimiento',due:'',note:'Acción de ejemplo; adaptar al contexto real.',status:'Pendiente'},
      {title:'Revisar evidencias y cerrar brechas prioritarias',control:(C.controls[1]||C.controls[0]||{}).id||'',fw:p.selected.map(f=>fw(f)?.short||f),owner:'Equipo de seguridad',due:'',note:'Acción de ejemplo.',status:'En curso'}
    ];
    c.audits=[{name:'Revisión inicial de cumplimiento',scope:p.desc,owner:'Auditor interno',date:'',findings:'Ejemplo demostrativo; confirmar alcance y evidencias.',status:'Planificada'}];
    db.companies[c.id]=c; db.activeCompanyId=c.id; save();
    if(typeof auto==='function') auto();
    location.hash='panel';
  }
  const inicioViewOriginal=typeof inicioView==='function'?inicioView:function(){return '';};
  function enhanceInicio(){
    let html=inicioViewOriginal();
    html=html.replace('<button class="secondary" onclick="loadDemo()">Ver un ejemplo</button>',
      `<div class="demo-sector-buttons"><button class="secondary" onclick="loadDemoSector('public')">Demo: Administración pública · ENS alto</button><button class="secondary" onclick="loadDemoSector('fintech')">Demo: Fintech · ISO 27001 + NIS2</button><button class="secondary" onclick="loadDemoSector('ai')">Demo: Startup IA · ISO 42001</button></div>`);
    const at=html.lastIndexOf('</section>');
    if(at>=0) html=html.slice(0,at)+nexusAlerts()+html.slice(at);
    return html;
  }

  // ---------- Búsqueda ampliada y filtros ----------
  function searchCatalogEnhanced(q,max=50,filters={}){
    const tokens=normText(q).split(/\s+/).filter(Boolean),hits=[];
    if(!tokens.length) return [];
    const matchText=txt=>{const n=normText(txt);return tokens.every(t=>n.includes(t));};
    const c=activeCompany();
    C.requirements.forEach(r=>{
      const text=[r.id,r.reference,r.title,r.area,r.description,r.objective,r.framework,fw(r.framework)?.short].join(' ');
      if(!matchText(text)) return;
      if(filters.framework && r.framework!==filters.framework) return;
      if(filters.domain && normText(r.area)!==normText(filters.domain)) return;
      hits.push({v:tokens.length?3:1,t:'req',x:r});
    });
    C.controls.forEach(x=>{
      const text=[x.id,x.name,x.area,x.description,x.objective,x.obj,x.ev,(x.fw||[]).map(f=>fw(f)?.short||f).join(' ')].join(' ');
      if(!matchText(text)) return;
      if(filters.framework && !(x.fw||[]).includes(filters.framework)) return;
      if(filters.domain && normText(x.area)!==normText(filters.domain)) return;
      if(filters.maturity){
        const lv=Number(c?.assess?.[x.id]?.level||0);
        if(filters.maturity==='below' && lv>=(Number(c?.target)||3)) return;
        if(filters.maturity!=='below' && lv!==Number(filters.maturity)) return;
      }
      hits.push({v:tokens.length?4:2,t:'ctl',x});
    });
    return hits.sort((a,b)=>b.v-a.v).slice(0,max);
  }
  function openSearchEnhanced(){
    document.getElementById('nxs')?.remove();
    const o=document.createElement('div');o.id='nxs';o.setAttribute('role','dialog');o.setAttribute('aria-label','Buscador multinorma');
    const frameworks=C.frameworks.map(f=>`<option value="${escText(f.id)}">${escText(f.short)}</option>`).join('');
    const domains=[...new Set(C.controls.map(c=>c.area).filter(Boolean))].sort().map(d=>`<option value="${escText(d)}">${escText(d)}</option>`).join('');
    o.innerHTML=`<div class="nxs-box"><input id="nxs-q" placeholder="Buscar por nombre, descripción, objetivo, referencia…" autocomplete="off"><div class="nxs-filters"><select id="nxs-fw"><option value="">Todas las normas</option>${frameworks}</select><select id="nxs-domain"><option value="">Todos los dominios</option>${domains}</select><select id="nxs-maturity"><option value="">Cualquier madurez</option><option value="0">Nivel 0 · inexistente</option><option value="1">Nivel 1 · inicial</option><option value="2">Nivel 2 · gestionado</option><option value="3">Nivel 3 · definido</option><option value="4">Nivel 4 · medido</option><option value="5">Nivel 5 · optimizado</option><option value="below">Por debajo del objetivo</option></select></div><div id="nxs-r"></div><small>Flechas para moverte · Enter para abrir · Esc para cerrar</small></div>`;
    document.body.appendChild(o);const input=document.getElementById('nxs-q');let selected=0;
    const draw=()=>{
      const results=searchCatalogEnhanced(input.value,50,{framework:document.getElementById('nxs-fw').value,domain:document.getElementById('nxs-domain').value,maturity:document.getElementById('nxs-maturity').value});
      selected=Math.min(selected,Math.max(0,results.length-1));o.dataset.n=results.length;
      document.getElementById('nxs-r').innerHTML=results.map((h,i)=>{
        const x=h.x,link=h.t==='req'?`#detail?type=requirement&id=${encodeURIComponent(x.id)}`:`#detail?type=control&id=${encodeURIComponent(x.id)}`;
        const label=h.t==='req'?`${fw(x.framework)?.short||x.framework} · ${x.reference||x.id}`:x.id;
        const desc=h.t==='req'?[x.description,x.objective].filter(Boolean).join(' · '):[x.description,x.objective,x.obj].filter(Boolean).join(' · ');
        return `<a href="${escText(link)}" class="${i===selected?'on':''}" data-h="${escText(link)}"><b>${escText(label)}</b><span>${escText(h.t==='req'?x.title:x.name)}</span><small>${escText(x.area||'')}${desc?' · '+escText(desc):''}</small></a>`;
      }).join('')||(input.value?'<p>Sin resultados para esos criterios.</p>':'<p>Escribe para buscar o utiliza los filtros.</p>');
    };
    [input,...o.querySelectorAll('select')].forEach(el=>el.addEventListener('input',()=>{selected=0;draw()}));
    o.onclick=e=>{if(e.target===o)o.remove();};
    input.onkeydown=e=>{const n=+o.dataset.n||0;if(e.key==='Escape')o.remove();else if(e.key==='ArrowDown'){selected=Math.min(n-1,selected+1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){selected=Math.max(0,selected-1);draw();e.preventDefault()}else if(e.key==='Enter'){const a=document.querySelector('#nxs-r a.on');if(a){location.hash=a.dataset.h.slice(1);o.remove();e.preventDefault()}}};
    input.focus();draw();
  }

  // ---------- Importador XLSX sin dependencia externa ----------
  let workbookRows=null, workbookName='';
  async function unzipXlsxEntry(bytes, wanted){
    const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    let eocd=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
    if(eocd<0) throw new Error('El archivo no parece un ZIP/XLSX válido.');
    const count=dv.getUint16(eocd+10,true),cdOffset=dv.getUint32(eocd+16,true);
    let pos=cdOffset;
    for(let i=0;i<count;i++){
      if(dv.getUint32(pos,true)!==0x02014b50) break;
      const method=dv.getUint16(pos+10,true),compSize=dv.getUint32(pos+20,true);
      const nameLen=dv.getUint16(pos+28,true),extraLen=dv.getUint16(pos+30,true),commentLen=dv.getUint16(pos+32,true),localOffset=dv.getUint32(pos+42,true);
      const name=new TextDecoder().decode(bytes.slice(pos+46,pos+46+nameLen));
      if(name===wanted){
        const lp=localOffset,ln=dv.getUint16(lp+26,true),le=dv.getUint16(lp+28,true),start=lp+30+ln+le;
        const raw=bytes.slice(start,start+compSize);
        if(method===0)return raw;
        if(method!==8)throw new Error('Compresión XLSX no compatible.');
        if(typeof DecompressionStream==='undefined')throw new Error('Este navegador no permite descomprimir XLSX. Prueba con una versión reciente de Chrome, Edge o Firefox.');
        let stream;
        try{stream=new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));}
        catch(e){throw new Error('El navegador no admite la descompresión necesaria para leer este XLSX.');}
        return new Uint8Array(await new Response(stream).arrayBuffer());
      }
      pos+=46+nameLen+extraLen+commentLen;
    }
    return null;
  }
  function xmlDoc(bytes){return new DOMParser().parseFromString(new TextDecoder().decode(bytes),'application/xml');}
  function colIndex(ref){const letters=String(ref||'').replace(/[0-9]/g,'');let n=0;for(const c of letters)n=n*26+c.charCodeAt(0)-64;return n-1;}
  async function parseXlsx(file){
    if(!file||!file.name.toLowerCase().endsWith('.xlsx'))throw new Error('Selecciona un archivo .xlsx.');
    const bytes=new Uint8Array(await file.arrayBuffer());
    const ssBytes=await unzipXlsxEntry(bytes,'xl/sharedStrings.xml');
    const strings=[];
    if(ssBytes){const doc=xmlDoc(ssBytes);Array.from(doc.getElementsByTagNameNS('*','si')).forEach(si=>strings.push(Array.from(si.getElementsByTagNameNS('*','t')).map(t=>t.textContent).join('')));}
    let sheet=await unzipXlsxEntry(bytes,'xl/worksheets/sheet1.xml');
    if(!sheet)throw new Error('No se ha encontrado la primera hoja del libro.');
    const doc=xmlDoc(sheet),rows=[];
    Array.from(doc.getElementsByTagNameNS('*','row')).forEach(row=>{
      const cells=[];Array.from(row.getElementsByTagNameNS('*','c')).forEach(cell=>{
        const idx=colIndex(cell.getAttribute('r'));const type=cell.getAttribute('t');let value='';
        if(type==='inlineStr')value=Array.from(cell.getElementsByTagNameNS('*','t')).map(t=>t.textContent).join('');
        else {const vs=cell.getElementsByTagNameNS('*','v'),v=vs.length?vs[0]:null;value=v?v.textContent:'';if(type==='s')value=strings[Number(value)]??'';}
        cells[idx]=String(value??'');
      });
      rows.push(cells);
    });
    return rows.filter(r=>r.some(v=>String(v||'').trim()));
  }
  function importSoaView(){
    const c=activeCompany();
    if(!c||!c.id)return `<section class="panel"><h2>Importar SoA desde Excel</h2><p>Selecciona o crea una empresa antes de importar una Declaración de Aplicabilidad.</p><a class="buttonlink" href="#companies">Ir a empresas</a></section>`;
    return `<section class="pagehead"><div><small>APARTADO B · PRIORIDAD ALTA</small><h1>Importar SoA desde Excel</h1><p>Importa requisitos, aplicabilidad y justificaciones a la empresa activa sin borrar las entradas existentes.</p></div></section>
      <section class="panel"><div class="panelhead"><div><h2>1. Selecciona el archivo</h2><p>Se procesa la primera hoja del libro .xlsx en tu navegador; no se envía a un servidor.</p></div></div><input type="file" id="soa-xlsx-file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onchange="handleSoaFile(this.files&&this.files[0])"><div id="soa-import-status" role="status" aria-live="polite"></div><p class="muted">Empresa activa: <b>${escText(c.name)}</b>. Recomendado: una fila por requisito y una fila de encabezados.</p></section>
      <section class="panel" id="soa-mapping-panel"><h2>2. Mapea las columnas</h2><p>Selecciona qué columna contiene cada dato. Se aceptan IDs, referencias normativas o títulos de requisitos que existan en el catálogo.</p><div id="soa-mapping-ui"><div class="empty">Primero selecciona un archivo Excel.</div></div></section>`;
  }
  async function handleSoaFile(file){
    const status=document.getElementById('soa-import-status'),ui=document.getElementById('soa-mapping-ui');
    if(status)status.textContent='Leyendo el archivo…';
    try{
      workbookRows=await parseXlsx(file);workbookName=file.name;
      if(!workbookRows.length)throw new Error('La primera hoja no contiene filas con datos.');
      const headers=workbookRows[0].map((v,i)=>String(v||'').trim()||`Columna ${i+1}`);
      const opts=headers.map((h,i)=>`<option value="${i}">${escText(h)}</option>`).join('');
      const guess=(terms)=>{const i=headers.findIndex(h=>terms.some(t=>normText(h).includes(normText(t))));return i>=0?i:0;};
      const reqCol=guess(['requisito','requirement','referencia','reference','id']);
      const appCol=guess(['aplica','applicable','aplicabilidad','applicability','sí/no','si/no']);
      const justCol=guess(['justificacion','justification','motivo','rationale','nota']);
      ui.innerHTML=`<div class="inlineform"><label>Requisito / referencia<select id="soa-col-req">${opts}</select></label><label>Aplica sí/no<select id="soa-col-app">${opts}</select></label><label>Justificación<select id="soa-col-note">${opts}<option value="-1">Sin columna de justificación</option></select></label></div><div class="panelhead"><div><h3>Vista previa</h3><p>${workbookRows.length-1} fila(s) de datos · archivo ${escText(workbookName)}</p></div><button onclick="applySoaImport()">Fusionar con empresa activa</button></div><div class="tablewrap"><table><thead><tr>${headers.map(h=>`<th>${escText(h)}</th>`).join('')}</tr></thead><tbody>${workbookRows.slice(1,6).map(r=>`<tr>${headers.map((_,i)=>`<td>${escText(r[i]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div id="soa-import-result" role="status"></div>`;
      document.getElementById('soa-col-req').value=String(reqCol);
      document.getElementById('soa-col-app').value=String(appCol);
      document.getElementById('soa-col-note').value=String(justCol);
      if(status)status.textContent='Archivo leído correctamente. Revisa el mapeo antes de fusionar.';
    }catch(err){if(status)status.textContent='No se pudo leer el archivo: '+(err?.message||err);if(ui)ui.innerHTML='<div class="empty">Corrige el archivo o prueba con un .xlsx estándar.</div>';}
  }
  function applySoaImport(){
    const c=activeCompany();
    if(!c||!c.id||!workbookRows||workbookRows.length<2){alert('Selecciona una empresa y carga un archivo válido.');return;}
    const ri=Number(document.getElementById('soa-col-req')?.value),ai=Number(document.getElementById('soa-col-app')?.value),ni=Number(document.getElementById('soa-col-note')?.value??-1);
    const norm=v=>normText(v).replace(/[^a-z0-9]/g,'');
    const reqIndex=new Map();
    C.requirements.forEach(r=>[r.id,r.reference,r.title,`${fw(r.framework)?.short||''} ${r.reference||''}`].filter(Boolean).forEach(k=>reqIndex.set(norm(k),r)));
    const resolve=value=>{
      const key=norm(value);if(!key)return null;
      if(reqIndex.has(key))return reqIndex.get(key);
      const matches=C.requirements.filter(r=>[r.id,r.reference,r.title].some(v=>norm(v)===key));
      if(matches.length===1)return matches[0];
      const fuzzy=C.requirements.filter(r=>norm(r.reference)===key||norm(r.id)===key);
      return fuzzy.length===1?fuzzy[0]:null;
    };
    let imported=0,unmatched=0,skipped=0;
    c.soa=c.soa||{};
    for(const row of workbookRows.slice(1)){
      const val=String(row[ri]??'').trim();if(!val){skipped++;continue;}
      const r=resolve(val);if(!r){unmatched++;continue;}
      const app=normText(row[ai]||'');
      let applicable=null;
      if(['si','sí','yes','y','true','1','aplica','aplicable','x'].includes(app)) applicable=true;
      else if(['no','n','false','0','no aplica','noaplica','not applicable','na','n/a'].includes(app)) applicable=false;
      else {unmatched++;continue;}
      const note=ni>=0?String(row[ni]??'').slice(0,2000):String(c.soa[r.id]?.note||'');
      c.soa[r.id]={app:applicable,note};
      imported++;
    }
    c.updatedAt=now();
    const ok=save();
    const result=document.getElementById('soa-import-result');
    if(result)result.innerHTML=`<p><b>${imported}</b> requisito(s) importados; <b>${unmatched}</b> fila(s) no reconocidas o con aplicabilidad ambigua; <b>${skipped}</b> fila(s) vacías omitidas.</p><p>${ok?'Cambios guardados en la empresa activa.':'No se pudo confirmar el guardado local.'} Las entradas coincidentes se actualizaron y las demás se conservaron.</p>`;
    // No renderizamos de nuevo: así el usuario puede leer el resumen de importación.
  }

  // ---------- Informe ejecutivo ----------
  function executiveReportView(){
    let html=informeViewOriginal();
    const c=activeCompany(),cov=coverage(),snaps=Array.isArray(c?.snapshots)?c.snapshots:[];
    const actions=c?.actions||[],counts={'Pendiente':0,'En curso':0,'Bloqueada':0,'Completada':0,'Verificada':0};
    actions.forEach(a=>{if(counts[a.status]!==undefined)counts[a.status]++;});
    const first=snaps.length?snaps[0]:null,last=snaps.length?snaps[snaps.length-1]:null;
    const delta=first&&last&&first.id!==last.id?Number(last.coverage?.pct||0)-Number(first.coverage?.pct||0):null;
    const evolution=`<h2>Evolución del cumplimiento</h2>${snaps.length?`<p>Hay ${snaps.length} revisiones registradas. La cobertura de la última revisión es ${Number(last.coverage?.pct||0)}%. ${delta===null?'Guarda al menos dos revisiones para medir la evolución.':`El cambio entre la primera y la última revisión es ${delta>0?'+':''}${delta.toFixed(1)} puntos porcentuales.`}</p><table class="pn-matrix"><thead><tr><th>Revisión</th><th>Fecha</th><th>Cobertura</th><th>Madurez</th></tr></thead><tbody>${snaps.map(s=>`<tr><td>${escText(s.label||'Revisión')}</td><td>${escText(dateOnly(s.date))}</td><td>${Number(s.coverage?.pct||0)}%</td><td>${Number(s.maturity||0).toFixed(1)}/5</td></tr>`).join('')}</tbody></table>`:'<p>No hay revisiones guardadas. Guarda snapshots en la pantalla Madurez para mostrar la evolución.</p>'}`;
    const status=`<h2>Estado del plan de acción</h2><p>${actions.length} acción(es): ${counts['Pendiente']} pendientes, ${counts['En curso']} en curso, ${counts['Bloqueada']} bloqueadas y ${counts['Completada']+counts['Verificada']} finalizadas o verificadas.</p>`;
    const summary=`<div class="exec-summary"><h2>Resumen para dirección</h2><p>La organización tiene una cobertura global del <b>${Number(cov.pct||0)}%</b> y una madurez media de <b>${Number(mavg()).toFixed(1)} sobre 5</b>. Se han evaluado ${cov.total||0} requisitos en las normas seleccionadas. Estas cifras son una referencia de autoevaluación y no equivalen a una certificación.</p>${status}${evolution}</div>`;
    const at=html.lastIndexOf('</section>');
    if(at>=0)html=html.slice(0,at)+summary+html.slice(at);
    return html;
  }
  const informeViewOriginal=typeof informeView==='function'?informeView:function(){return '<section class="panel">Informe no disponible.</section>';};

  // ---------- Compartir una vista de solo lectura ----------
  function bytesToB64(bytes){let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function b64ToBytes(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const bin=atob(s),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;}
  async function compressText(s){
    if(typeof CompressionStream==='undefined')throw new Error('Este navegador no permite comprimir el enlace. Usa la exportación de copia de seguridad.');
    const stream=new Blob([s]).stream().pipeThrough(new CompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  async function decompressText(bytes){
    if(typeof DecompressionStream==='undefined')throw new Error('Este navegador no permite abrir el enlace comprimido.');
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
    return await new Response(stream).text();
  }
  function sharePayload(c){
    // Excluir datos personales de perfil, correo y preferencias globales.
    return {schema:1,createdAt:new Date().toISOString(),company:{
      name:c.name,sector:c.sector,size:c.size,criticality:c.criticality,selected:c.selected,
      target:c.target,assess:c.assess,soa:c.soa,reqDetails:c.reqDetails,
      actions:(c.actions||[]).map(a=>({title:a.title,control:a.control,fw:a.fw,status:a.status,due:a.due})),
      snapshots:(c.snapshots||[]).slice(-12),audits:(c.audits||[]).map(a=>({name:a.name,status:a.status,date:a.date})),
      evidence:(c.evidence||[]).map(e=>({title:e.title,control:e.control,status:e.status,reviewDate:e.reviewDate}))
    }};
  }
  async function shareCompanyLink(){
    const c=activeCompany();if(!c||!c.id){alert('Selecciona una empresa antes de compartir.');return;}
    if(!confirm('El enlace incluirá datos de cumplimiento y podría ser visto por cualquiera que lo reciba. No incluyas información confidencial, secretos ni datos personales. ¿Continuar?'))return;
    try{
      const packed=bytesToB64(await compressText(JSON.stringify(sharePayload(c))));
      const url=new URL(location.href);url.hash='shared='+packed;
      if(url.href.length>8000){alert('El enlace resultante supera 8.000 caracteres. Reduce los datos o comparte un informe PDF sin información sensible.');return;}
      if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(url.href);alert('Enlace de solo lectura copiado. Cualquiera que lo reciba podrá ver los datos incluidos.');}
      else prompt('Copia este enlace de solo lectura:',url.href);
    }catch(e){alert('No se pudo generar el enlace: '+(e?.message||e));}
  }
  let sharedLoading=false,sharedCompany=null,sharedError='';
  async function loadSharedHash(){
    if(sharedLoading||sharedCompany)return;sharedLoading=true;
    try{
      const payload=JSON.parse(await decompressText(b64ToBytes(location.hash.slice('#shared='.length))));
      if(payload.schema!==1||!payload.company||typeof payload.company.name!=='string')throw new Error('Formato de enlace no reconocido.');
      sharedCompany=payload.company;
    }catch(e){sharedError=e?.message||'No se pudo abrir el enlace.';}
    finally{sharedLoading=false;if(typeof render==='function')render();}
  }
  function sharedReadOnlyView(){
    if(!sharedCompany){if(!sharedLoading&&!sharedError)loadSharedHash();return `<section class="panel"><h1>Vista compartida de solo lectura</h1><p>${sharedError?escText(sharedError):'Abriendo el estado compartido…'}</p><a href="#inicio">Abrir Nexus local</a></section>`;}
    const c=sharedCompany,as=c.assess||{},controls=C.controls.filter(x=>(c.selected||[]).some(f=>(x.fw||[]).includes(f)));
    const lv=x=>Number(as[x.id]?.level||0),gaps=controls.filter(x=>lv(x)<Number(c.target||3)).sort((a,b)=>lv(a)-lv(b)).slice(0,5);
    const reqs=C.requirements.filter(r=>(c.selected||[]).includes(r.framework));
    const total=reqs.length,covered=reqs.filter(r=>{const ids=C.mappings.filter(m=>m.requirement===r.id).map(m=>m.control);return ids.length&&ids.some(id=>lv(C.controls.find(x=>x.id===id)||{id})>=Number(c.target||3));}).length;
    const pct=total?Math.round(covered/total*100):0;
    return `<section class="rep"><div class="rep-bar"><span class="pill">SOLO LECTURA · ENLACE COMPARTIDO</span><button onclick="window.print()">Imprimir / guardar PDF</button><a href="#inicio">Salir de vista compartida</a></div><header><div class="eyebrow">RESUMEN COMPARTIDO · NO CERTIFICADO</div><h1>${escText(c.name)}</h1><p>${escText(c.sector||'Sector no indicado')} · ${escText(c.size||'Tamaño no indicado')}</p></header><div class="pn-kpis"><div><b>${pct}%</b><span>indicador aproximado de controles sobre objetivo</span></div><div><b>${controls.length}</b><span>capacidades aplicables</span></div><div><b>${gaps.length}</b><span>brechas destacadas</span></div><div><b>${(c.snapshots||[]).length}</b><span>revisiones compartidas</span></div></div><h2>Brechas prioritarias</h2>${gaps.length?`<ol>${gaps.map(x=>`<li><b>${escText(x.id)} · ${escText(x.name)}</b> — madurez ${lv(x)}/5, objetivo ${Number(c.target||3)}/5.</li>`).join('')}</ol>`:'<p>No se identifican brechas en las capacidades seleccionadas según los datos compartidos.</p>'}<h2>Plan de acción</h2>${(c.actions||[]).length?`<ul>${c.actions.map(a=>`<li>${escText(a.title)} · ${escText(a.status||'Pendiente')}${a.due?' · fecha límite '+escText(a.due):''}</li>`).join('')}</ul>`:'<p>No hay acciones compartidas.</p>'}<h2>Evolución</h2>${(c.snapshots||[]).length?`<table class="pn-matrix"><thead><tr><th>Revisión</th><th>Fecha</th><th>Cobertura registrada</th><th>Madurez</th></tr></thead><tbody>${c.snapshots.map(s=>`<tr><td>${escText(s.label||'Revisión')}</td><td>${escText(dateOnly(s.date))}</td><td>${Number(s.coverage?.pct||0)}%</td><td>${Number(s.maturity||0).toFixed(1)}/5</td></tr>`).join('')}</tbody></table>`:'<p>No se compartieron snapshots.</p>'}<p class="rep-note">Vista de solo lectura. Los datos proceden de una autoevaluación compartida por URL y no constituyen una certificación. La URL contiene información codificada, no cifrada.</p></section>`;
  }
  const originalView=typeof view==='function'?view:null;
  if(originalView) view=function(){
    if(location.hash.startsWith('#shared='))return `<div class="shell theme-claro"><main>${sharedReadOnlyView()}</main></div>`;
    return originalView();
  };
  // Add all entry points globally for inline handlers.
  Object.assign(window,{
    loadDemoSector,
    handleSoaFile,
    applySoaImport,
    openSearch:openSearchEnhanced,
    searchCatalog:searchCatalogEnhanced,
    shareCompanyLink,
    createCoverageSnapshot:typeof createCoverageSnapshot==='function'?createCoverageSnapshot:function(){if(typeof saveCoverageSnapshot==='function')saveCoverageSnapshot(prompt('Nombre de la revisión:','Revisión de cumplimiento')||'Revisión de cumplimiento');},
    saveCoverageSnapshot:typeof saveCoverageSnapshot==='function'?saveCoverageSnapshot:function(){alert('La función de snapshots no está disponible.');}
  });
  // Replace existing home view without changing the underlying welcome layout.
  if(typeof inicioView==='function') inicioView=enhanceInicio;
  // Enhance the print report with management-level status and evolution.
  if(typeof informeView==='function') informeView=executiveReportView;
  // Expose the importer as a global page helper.
  window.importSoaView=importSoaView;
})();
