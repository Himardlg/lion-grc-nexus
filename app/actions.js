// GRC Nexus — Herramienta de gestión de cumplimiento multinorma
// Copyright (C) 2026  hiramyclases@gmail.com
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// Catalog data (app/catalog.js) derived from Rosetta Multinorma
// by heindall92, licensed under GNU GPL v2.
// Original: https://github.com/heindall92/rosetta_multinorma
//
// Módulo: Acciones de usuario: empresas, evaluación, SoA, filtros,
// formularios, auditorías, evidencias y snapshots de cobertura.

function saveCompany(e){
  e.preventDefault();
  let f=new FormData(e.target),c=ctx()||blankCompany();
  Object.assign(c,{
    name:f.get('name'),
    sector:f.get('sector'),
    size:f.get('size'),
    employees:f.get('employees'),
    criticality:f.get('criticality'),
    financial:f.get('financial')==='on',
    public:f.get('public')==='on',
    ai:f.get('ai')==='on',
    ensCategory:f.get('ensCategory')||'',
    ensLevels:Object.fromEntries(ENS_DIMS.map(k=>[k,f.get('ensLevel_'+k)]).filter(e=>e[1])),
    nis2Class:f.get('nis2Class')||'',
    doraSimplified:f.get('doraSimplified')==='on',
    sensitive:f.get('sensitive')==='on',
    target:+f.get('target'),
    updatedAt:now()
  });
  let r=recommended();
  if(db.settings.autoRecommendations)c.selected=[...new Set([...c.selected,...r.ids])];
  db.companies[c.id]=c;
  save();
  location.hash='scope';
}


function newCompany(){
  let c = blankCompany(
    db.settings.language === 'en'
      ? 'New organization'
      : 'Nueva organización'
  );

  c.target = Number(db.settings.defaultTarget) || 3;
  c.wizard = 0;
  db.companies[c.id] = c;
  db.activeCompanyId = c.id;

  save();
  goTo('company');
}

function selectCompany(id){
  if(!db.companies[id])return;
  db.activeCompanyId=id;
  save();
  location.hash==='#panel'?render():location.hash='panel';
}

function editCompany(id){
  if(!db.companies[id])return;
  db.activeCompanyId=id;
  save();
  location.hash='company';
}


function deleteSelectedCompanies() {
  const checkboxes = [
    ...document.querySelectorAll('.company-select:checked')
  ];

  const ids = [...new Set(
    checkboxes
      .map(cb => cb.value)
      .filter(id => db.companies && db.companies[id])
  )];

  if (!ids.length) {
    alert('Selecciona al menos una empresa.');
    return;
  }

  const names = ids.map(id => db.companies[id].name || 'Sin nombre');
  const details = names.slice(0, 10).join('\n');
  const more = names.length > 10
    ? `\n… y ${names.length - 10} más`
    : '';

  const message =
    `Vas a eliminar ${ids.length} empresa(s) y todos sus datos asociados.\n\n` +
    `${details}${more}\n\n` +
    'Esta acción no se puede deshacer. ¿Quieres continuar?';

  if (!confirm(message)) return;

  // Borrar únicamente las empresas seleccionadas.
  ids.forEach(id => {
    delete db.companies[id];
  });

  // Seleccionar otra empresa si se ha borrado la activa.
  if (!db.companies[db.activeCompanyId]) {
    db.activeCompanyId = Object.keys(db.companies)[0] || '';
  }

  if (typeof save === 'function') {
    save();
  }

  // Volver a mostrar la lista actualizada.
  if (location.hash === '#companies') {
    render();
  } else {
    location.hash = 'companies';
  }
}


function toggle(id,on){
  let c=ctx();
  c.selected=on?[...new Set([...c.selected,id])]:c.selected.filter(x=>x!==id);
  c.updatedAt=now();
  save();
  render();
}

function setA(id,k,v){
  let c=ctx(),cur=c.assess[id]||{level:0,owner:'',evidence:''};
  if(k==='level'){
    let n=Number(v);
    cur.level=Number.isFinite(n)?Math.max(0,Math.min(5,n)):0;
  }else{
    cur[k]=v;
  }
  c.assess[id]=cur;
  c.updatedAt=now();
  save();
  const card=document.querySelector(`.ctl[data-id="${CSS.escape(id)}"]`);
  if(card){
    card.dataset.level=String(cur.level);
    let sel=card.querySelector('select[data-field="level"]');
    if(sel&&k==='level')sel.value=String(cur.level);
  }
}

function saveControlEvaluation(id){
  const card=document.querySelector(`.ctl[data-id="${CSS.escape(id)}"]`);
  if(!card)return;
  const get=k=>card.querySelector(`[data-field="${k}"]`);
  const c=ctx(),old=c.assess[id]||{level:0,owner:'',evidence:''};
  c.assess[id]={
    level:Number(get('level')?.value??old.level)||0,
    owner:get('owner')?.value??old.owner,
    evidence:get('evidence')?.value??old.evidence
  };
  c.updatedAt=now();
  if(save()){
    const status=document.getElementById('saveStatus');
    if(status)status.innerHTML=icon('check')+' Evaluación guardada';
  }
}

function setGap(id,on){
  let c=ctx();
  c.gapclosed=c.gapclosed||{};
  if(on)c.gapclosed[id]=true;
  else delete c.gapclosed[id];
  c.updatedAt=now();
  save();
  render();
}

function setSoa(id,v){
  let c=ctx();
  c.soa=c.soa||{};
  const note=document.getElementById('req-just-'+id)?.value||c.soa[id]?.note||'';
  if(v==='auto'){
    if(note)c.soa[id]={app:null,note};
    else delete c.soa[id];
  }else{
    c.soa[id]={app:v==='yes',note};
  }
  c.updatedAt=now();
  save();
  refreshDetailStatus(id);
}

function setSoaNote(id,value){
  let c=ctx();
  c.soa=c.soa||{};
  const selected=document.getElementById('req-app-'+id)?.value||'auto';
  const app=selected==='auto'?null:selected==='yes';
  const note=String(value??'').slice(0,2000);
  if(selected==='auto'&&!note)delete c.soa[id];
  else c.soa[id]={app,note};
  c.updatedAt=now();
  save();
}

function setRequirementField(id,field,value){
  if(!['owner','notes','evidence'].includes(field))return;
  let c=ctx();
  c.reqDetails=c.reqDetails||{};
  c.reqDetails[id]=c.reqDetails[id]||{owner:'',notes:'',evidence:''};
  c.reqDetails[id][field]=String(value??'').slice(0,4000);
  c.updatedAt=now();
  save();
}

function saveRequirementDetails(id){
  const c=ctx();
  const app=document.getElementById('req-app-'+id)?.value||'auto';
  const note=document.getElementById('req-just-'+id)?.value||'';
  if(app==='auto'){
    if(note)c.soa[id]={app:null,note};
    else delete c.soa[id];
  }else{
    c.soa[id]={app:app==='yes',note};
  }
  c.reqDetails=c.reqDetails||{};
  c.reqDetails[id]={
    owner:document.getElementById('req-owner-'+id)?.value||'',
    notes:document.getElementById('req-notes-'+id)?.value||'',
    evidence:document.getElementById('req-evidence-'+id)?.value||''
  };
  c.updatedAt=now();
  if(save()){
    const el=document.getElementById('saveStatus');
    if(el){
      el.className='save-status saved';
      el.innerHTML=icon('check')+' Cambios guardados';
    }
    render();
  }
}

function refreshDetailStatus(id){
  const status=document.querySelector('.detailstatus');
  const r=req(id);
  if(status&&r){
    const s=reqState(r);
    status.className='detailstatus '+s;
    const b=status.querySelector('b');
    if(b)b.textContent=statusLabel(s);
  }
}

function setMappingReview(id,field,value){
  let c=ctx();
  c.mappingReviews=c.mappingReviews||{};
  let r=c.mappingReviews[id]||{status:'Pendiente',note:'',reviewer:'',reviewDate:''};
  if(!['status','note','reviewer','reviewDate'].includes(field))return;
  r[field]=String(value??'').slice(0,2000);
  if(field==='status'&&value==='Validada'&&!r.reviewDate){
    r.reviewDate=new Date().toISOString().slice(0,10);
  }
  c.mappingReviews[id]=r;
  save();
  render();
}

function filterMappings(){
  let q=(document.getElementById('mappingSearch')?.value||'').toLowerCase();
  let st=document.getElementById('mappingStatusFilter')?.value||'';
  document.querySelectorAll('.mappingreview').forEach(x=>{
    x.style.display=(!q||x.dataset.search.includes(q))&&(!st||x.dataset.status===st)?'':'none';
  });
}

function exportMappingReviews(){
  let c=ctx(),rows=[['Empresa','ID correspondencia','Norma','Referencia','Requisito','Control','Estado','Revisor','Fecha revisión','Justificación']];
  C.mappings.filter(m=>{
    let r=req(m.requirement);
    return r&&c.selected.includes(r.framework);
  }).forEach(m=>{
    let r=req(m.requirement),cc=ctl(m.control),v=c.mappingReviews?.[m.id]||{};
    rows.push([
      c.name,m.id,fw(r.framework).name,r.reference,r.title,cc.name,
      v.status||'Pendiente',v.reviewer||'',v.reviewDate||'',v.note||m.rationale||''
    ]);
  });
  const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;
  a.download='matriz-correspondencias-'+(c.name||'empresa').replace(/[^a-z0-9_-]+/gi,'-')+'.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function filter(){
  let q=(document.getElementById('q')?.value||'').toLowerCase();
  document.querySelectorAll('.ctl').forEach(x=>x.style.display=x.dataset.q.includes(q)?'':'none');
}

function filterLevel(v){
  document.querySelectorAll('.ctl').forEach(x=>x.style.display=!v||x.dataset.level===v?'':'none');
}

function filterReq(){
  let q=(document.getElementById('rq')?.value||'').toLowerCase();
  document.querySelectorAll('.reqcard').forEach(x=>x.style.display=x.dataset.rq.includes(q)?'':'none');
}

function filterReqState(v){
  document.querySelectorAll('.reqcard').forEach(x=>x.style.display=!v||x.dataset.state===v?'':'none');
}

function filterCtl(){
  let q=(document.getElementById('cq')?.value||'').toLowerCase();
  document.querySelectorAll('.controlcard').forEach(x=>x.style.display=x.dataset.cq.includes(q)?'':'none');
}

function filterCtlFw(v){
  document.querySelectorAll('.controlcard').forEach(x=>x.style.display=!v||x.dataset.fw.split(',').includes(v)?'':'none');
}

function make(id){
  let c=ctx(),x=ctl(id);
  if(!c.actions.some(a=>a.control===id)){
    c.actions.push({
      title:'Implantar / mejorar '+x.name,
      control:id,
      fw:x.fw.filter(z=>c.selected.includes(z)).map(z=>fw(z).short),
      status:'Pendiente'
    });
  }
  save();
  location.hash='actions';
}

function auto(){
  let c=ctx();
  activeControls().filter(x=>(c.assess[x.id]?.level||0)<c.target)
    .sort((a,b)=>priority(b)-priority(a))
    .forEach(x=>{
      if(!c.actions.some(a=>a.control===x.id)){
        c.actions.push({
          title:'Implantar / mejorar '+x.name,
          control:x.id,
          fw:x.fw.filter(z=>c.selected.includes(z)).map(z=>fw(z).short),
          status:'Pendiente'
        });
      }
    });
  save();
  render();
}

function updateAction(i,v){
  ctx().actions[i].status=v;
  save();
  render();
}

function updateActionField(i,k,v){
  if(!ctx().actions[i]||!['owner','due','note'].includes(k))return;
  ctx().actions[i][k]=String(v??'').slice(0,2000);
  save();
}

function addEvidence(e){
  e.preventDefault();
  let f=new FormData(e.target);
  ctx().evidence.push({
    title:f.get('title'),
    control:f.get('control'),
    ref:f.get('ref'),
    owner:f.get('owner'),
    reviewDate:f.get('reviewDate'),
    status:f.get('status'),
    notes:f.get('notes')
  });
  save();
  render();
}

function addRisk(e){
  e.preventDefault();
  let f=new FormData(e.target);
  ctx().risks.push({
    title:f.get('title'),
    control:f.get('control'),
    impact:+f.get('impact'),
    likelihood:+f.get('likelihood'),
    owner:f.get('owner'),
    treatment:f.get('treatment'),
    status:f.get('status')
  });
  save();
  render();
}

function addAudit(e){
  e.preventDefault();
  let f=new FormData(e.target);
  ctx().audits.push({
    name:f.get('name'),
    scope:f.get('scope'),
    owner:f.get('owner'),
    date:f.get('date'),
    findings:f.get('findings'),
    status:f.get('status')
  });
  save();
  render();
}

function removeItem(k,i){
  ctx()[k].splice(i,1);
  save();
  render();
}

/**
 * Guarda una fotografía del estado actual de cumplimiento.
 * Conserva como máximo los 12 snapshots más recientes de la empresa.
 */
function saveCoverageSnapshot(label=''){
  const c=ctx();

  if(!c||!c.id){
    alert('Selecciona una empresa antes de guardar el historial.');
    return;
  }

  const cov=coverage();
  const maturityValue=Number(mavg());
  const snapshots=Array.isArray(c.snapshots)?c.snapshots:[];
  const date=new Date();

  const snapshot={
    id:'snap-'+date.getTime().toString(36)+'-'+Math.random().toString(36).slice(2,7),
    date:date.toISOString(),
    label:String(label||'').trim().slice(0,120)||'Revisión de cumplimiento',
    coverage:{
      total:Number(cov.total)||0,
      cubierto:Number(cov.cubierto)||0,
      parcial:Number(cov.parcial)||0,
      gap:Number(cov.gap)||0,
      no_aplica:Number(cov.no_aplica)||0,
      pct:Number(cov.pct)||0
    },
    maturity:Number.isFinite(maturityValue)?Math.round(maturityValue*100)/100:0
  };

  c.snapshots=[...snapshots,snapshot].slice(-12);
  c.updatedAt=now();

  if(save()){
    alert('Snapshot guardado correctamente.');
    render();
  }
}

function saveProfile(e){
  e.preventDefault();
  let f=new FormData(e.target);
  db.profile={
    ...db.profile,
    name:f.get('name')||'Administrador',
    role:f.get('role')||'Usuario',
    email:f.get('email')||'',
    avatar:(f.get('avatar')||f.get('name')||'A').slice(0,2).toUpperCase()
  };
  save();
  render();
}

function saveSettings(e){
  e.preventDefault();
  let f=new FormData(e.target);
  db.settings.defaultTarget=+f.get('defaultTarget');
  db.settings.autoRecommendations=f.get('autoRecommendations')==='on';
  save();
  render();
}

function setPreference(k,v){
  db.settings[k]=v;
  save();
  render();
}

function cycleTheme(){
  db.settings.theme=db.settings.theme==='oscuro'?'claro':'oscuro';
  save();
  render();
}

function toggleSetting(k,v){
  db.settings[k]=v;
  save();
  render();
}
