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
// Módulo: Plan de acción, SoA, enlace compartido y guía del panel.
const today=()=>new Date().toISOString().slice(0,10);
function overdue(a){return !!a.due&&a.due<today()&&!['Completada','Verificada'].includes(a.status)}
function updateActionField(i,k,v){const a=ctx().actions[i];if(!a||!['owner','due','note'].includes(k))return;a[k]=String(v).slice(0,500);ctx().updatedAt=now();save();render()}
function setSoaNote(id,v){const c=ctx();c.soa[id]={app:c.soa[id]?.app!==false,note:String(v).slice(0,500)};save()}
function shareLink(){const u=location.href;navigator.clipboard?.writeText(u).then(()=>alert('Enlace copiado a la vista actual. Los datos de la empresa no se incluyen: se guardan solo en este navegador.'),()=>prompt('Copia el enlace:',u))}
function panelGuidance(c){
 const n=[],late=c.actions.filter(overdue).length;
 if(c.selected.includes('ens'))n.push((c.ensCategory||Object.keys(c.ensLevels||{}).length)?`ENS · categoría efectiva <b>${{basica:'Básica',media:'Media',alta:'Alta'}[ensEffectiveCategory(c)]}</b>${ensEffectiveCategory(c)!==c.ensCategory?' (elevada por los niveles de dimensión)':''}: determina qué medidas del Anexo II aplican.`:'ENS · falta determinar la <b>categoría</b> (Básica/Media/Alta) en <a href="#company">Empresa</a>.');
 if(c.selected.includes('nis2'))n.push(c.nis2Class==='fuera'?'NIS2 · marcada como <b>fuera de ámbito</b>: revisa si sigue siendo necesaria.':c.nis2Class?`NIS2 · entidad <b>${c.nis2Class==='esencial'?'esencial':'importante'}</b>: condiciona el régimen de supervisión.`:'NIS2 · falta clasificar la entidad (esencial/importante) en <a href="#company">Empresa</a>.');
 if(c.selected.includes('dora'))n.push(c.doraSimplified?'DORA · marco <b>simplificado</b> (art. 16): valida que cumples las condiciones de proporcionalidad.':'DORA · marco completo de gestión del riesgo TIC.');
 if(c.wizard!=null)n.push(`Asistente de configuración sin terminar: <a href="#${WIZ[c.wizard]?.[0]||'company'}">continuar</a>.`);
 coherence(c).forEach(w=>n.push(w));
 if(late)n.push(`<b>${late}</b> acción(es) <b>vencida(s)</b> en <a href="#actions">Plan de acción</a>.`);
 return n.length?`<section class="pn-guide" aria-label="Avisos">${n.map(x=>`<p>${x}</p>`).join('')}</section>`:''}
function exportSoA(f){
 const c=ctx(),rows=[['Requisito','Referencia','Título','Aplica','Justificación','Control','Madurez','Estado','Responsable']];
 C.requirements.filter(r=>r.framework===f).forEach(r=>{const so=c.soa[r.id],a=c.assess[r.control];rows.push([r.id,r.reference,r.title,so?.app===false?'No':'Sí',so?.note||'',r.maps.map(k=>k.control).join(' + '),Math.min(5,...r.maps.map(k=>c.assess[k.control]?.level??0)),statusLabel(reqState(r)),a?.owner||'']);});
 const b=new Blob(['\ufeff'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),l=document.createElement('a');l.href=URL.createObjectURL(b);l.download='SoA-'+f+'.csv';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),500)}
