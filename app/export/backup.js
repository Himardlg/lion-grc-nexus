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
// Módulo: Copias de seguridad e importación/exportación de empresas.
function buildBackupPayload(){return {type:'grc-nexus-backup',app:'Nexus GRC Lion',appVersion:'1.19.1',schemaVersion:19,exportedAt:new Date().toISOString(),activeCompanyId:db.activeCompanyId,profile:db.profile,settings:db.settings,companies:db.companies};}
function exportBackup(){
 const payload=buildBackupPayload();
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='grc-nexus-respaldo-'+new Date().toISOString().slice(0,10)+'.grcnexus-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function restoreBackup(e){
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>10*1024*1024){alert('El respaldo supera el límite de 10 MB.');e.target.value='';return}
 const reader=new FileReader();reader.onload=()=>{
  const previous=db;
  try{
   const x=JSON.parse(String(reader.result||''));
   if(x?.type!=='grc-nexus-backup'||!x.companies||typeof x.companies!=='object'||Array.isArray(x.companies))throw new Error('Formato no válido');
   const entries=Object.entries(x.companies);if(!entries.length||entries.length>200)throw new Error('Número de empresas no válido');
   if(!confirm('Se reemplazarán los datos locales actuales por el respaldo seleccionado. Antes de continuar, asegúrate de haber exportado una copia de seguridad de lo que tienes ahora. ¿Continuar?')){e.target.value='';return}
   const companies={},idMap={};
   for(const [oldId,value] of entries){const c=normalizeCompany(value);const id='org-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);idMap[oldId]=id;c.id=id;companies[id]=c;}
   const oldActive=x.activeCompanyId,activeCompanyId=idMap[oldActive]||Object.keys(companies)[0];
   const safeProfile=x.profile&&typeof x.profile==='object'?x.profile:{};
   const safeSettings=x.settings&&typeof x.settings==='object'?x.settings:{};
   db={version:19,activeCompanyId,companies,profile:{name:String(safeProfile.name||'Administrador').slice(0,100),role:String(safeProfile.role||'Usuario').slice(0,100),email:String(safeProfile.email||'').slice(0,200),avatar:String(safeProfile.avatar||'A').slice(0,2)},settings:{theme:['claro','oscuro'].includes(safeSettings.theme)?safeSettings.theme:'claro',language:safeSettings.language==='en'?'en':'es',autoRecommendations:safeSettings.autoRecommendations!==false,defaultTarget:Math.max(1,Math.min(5,Number(safeSettings.defaultTarget)||3)),density:['comfortable','standard','compact'].includes(safeSettings.density)?safeSettings.density:'comfortable',sidebar:['expanded','compact'].includes(safeSettings.sidebar)?safeSettings.sidebar:'expanded',startPage:['panel','companies','inicio'].includes(safeSettings.startPage)?safeSettings.startPage:'panel',accent:'gold',confirmReset:safeSettings.confirmReset!==false}};
   if(!save()){db=previous;return}location.hash='#companies';render();alert('Respaldo restaurado. Se han importado '+entries.length+' empresas.');
  }catch(err){db=previous;alert('No se ha podido restaurar el respaldo: el archivo no es válido o está dañado. No se han sustituido los datos actuales.');}
  finally{e.target.value=''}
 };reader.onerror=()=>{alert('No se pudo leer el archivo.');e.target.value=''};reader.readAsText(file);
}
function exportCompany(){let c=ctx(),blob=new Blob([JSON.stringify({type:'grc-nexus-company',version:19,company:c},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(c.name||'empresa').replace(/[^a-z0-9áéíóúüñ]+/gi,'-')+'.grcnexus.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function importCompany(e){let file=e.target.files?.[0];if(!file)return;let reader=new FileReader();reader.onload=()=>{try{let x=JSON.parse(reader.result),c=normalizeCompany(x.company||x);c.id='org-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);c.name=(c.name||'Empresa importada')+' · importada';db.companies[c.id]=c;db.activeCompanyId=c.id;save();location.hash='companies'}catch(err){alert('El archivo no parece un proyecto de Nexus GRC Lion válido.')}};reader.readAsText(file)}
function resetCompany(){if(db.settings.confirmReset!==false&&!confirm(`¿Restablecer el proyecto de “${ctx().name}”? Esta acción eliminará evaluación, acciones, evidencias, riesgos y auditorías.`))return;let c=ctx();c.assess={};c.actions=[];c.evidence=[];c.risks=[];c.audits=[];c.soa={};c.updatedAt=now();save();render()}
function openDetail(type,id){location.hash=`detail?type=${type}&id=${encodeURIComponent(id)}`}
