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
// Módulo: Estado local (localStorage), guardado y utilidades de consulta.
function loadDB(){let raw=null;try{raw=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}if(raw?.companies)return raw;let legacy=null;for(const k of ['grc-nexus-v18','grc-nexus-v17','grc-nexus-v15','grc-nexus-v14','grc-nexus-v13']){try{legacy=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}if(legacy)break}if(legacy?.companies){const companies={};Object.entries(legacy.companies).forEach(([id,x])=>{const c=normalizeCompany(x);c.id=id;companies[id]=c});const activeCompanyId=companies[legacy.activeCompanyId]?legacy.activeCompanyId:(Object.keys(companies)[0]||'');return {...legacy,version:19,activeCompanyId,companies,profile:legacy.profile||{name:'Administrador',role:'Administrador local',email:'',avatar:'A'},settings:{theme:'claro',language:'es',autoRecommendations:true,defaultTarget:3,density:'comfortable',sidebar:'expanded',startPage:'panel',accent:'gold',confirmReset:true,...(legacy.settings||{})}}}let c=normalizeCompany(legacy?.company||null);if(legacy){Object.assign(c,{selected:legacy.selected||[],assess:legacy.assess||{},actions:legacy.actions||[],target:legacy.target||3,soa:legacy.soa||{},evidence:legacy.evidence||[],risks:legacy.risks||[],audits:legacy.audits||[]})}return {version:19,activeCompanyId:c.id,companies:{[c.id]:c},profile:{name:'Administrador',role:'Administrador local',email:'',avatar:'A'},settings:{theme:'claro',language:'es',autoRecommendations:true,defaultTarget:3,density:'comfortable',sidebar:'expanded',startPage:'panel',accent:'gold',confirmReset:true}}}
let db=loadDB();Object.values(db.companies||{}).forEach(migrateCompany);
if(!db.version||db.version<19)db.version=19;if(!db.profile)db.profile={name:'Administrador',role:'Administrador local',email:''};if(!db.settings)db.settings={theme:'claro',language:'es',autoRecommendations:true,defaultTarget:3,density:'comfortable',sidebar:'expanded',startPage:'panel',accent:'gold',confirmReset:true};Object.assign(db.settings,{theme:db.settings.theme||'claro',density:db.settings.density||'comfortable',sidebar:db.settings.sidebar||'expanded',startPage:['panel','companies','inicio'].includes(db.settings.startPage)?db.settings.startPage:'panel',accent:db.settings.accent==='lime'?'gold':(db.settings.accent||'gold'),confirmReset:db.settings.confirmReset!==false});if(!db.profile.avatar)db.profile.avatar=(db.profile.name||'A').slice(0,1).toUpperCase();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));const el=document.getElementById('saveStatus');if(el){el.className='save-status saved';el.innerHTML=icon('check')+' Todos los cambios guardados';}return true}catch(err){const el=document.getElementById('saveStatus');if(el){el.className='save-status error';el.innerHTML=icon('triangle-alert')+' No se han podido guardar los cambios';}alert('No se han podido guardar los cambios en este navegador. Exporta una copia de seguridad y libera espacio antes de continuar.');return false}};
const active=()=>db.companies[db.activeCompanyId]||Object.values(db.companies)[0]||null;
const EMPTY_CO=blankCompany('Sin empresa');
const fw=id=>C.frameworks.find(x=>x.id===id),ctl=id=>C.controls.find(x=>x.id===id),req=id=>C.requirements.find(x=>x.id===id);const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const levels=['No existe','Inicial','Gestionado','Definido','Medido','Optimizado'];
const levelCriteria=['No hay práctica implantada o no se ha encontrado evidencia verificable.','La práctica es puntual/reactiva, depende de personas concretas y no se aplica de forma consistente.','La práctica se repite y tiene responsable, aunque su documentación o aplicación puede variar.','La práctica está documentada, aprobada, asignada y se aplica de forma consistente.','Se mide mediante indicadores, se revisa periódicamente y existen registros de seguimiento.','Se mejora continuamente usando resultados, lecciones aprendidas y revisiones sistemáticas.'];
