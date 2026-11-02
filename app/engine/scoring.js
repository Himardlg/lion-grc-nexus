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
// Módulo: Motor de cobertura, estado de requisitos y prioridades.
function ctx(){return active()||EMPTY_CO}
function hasCompany(){return !!active()}
function recommended(){let c=ctx(),out=[...c.selected],reasons=[];if(c.financial){out.push('dora');reasons.push('Entidad financiera: revisar DORA')}if(c.ai){out.push('iso42001');reasons.push('Uso o desarrollo de IA: revisar ISO 42001')}if(c.public){out.push('ens');reasons.push('Entidad pública: revisar ENS')}if(c.criticality==='alta'){out.push('nis2');reasons.push('Criticidad alta: confirmar ámbito jurídico NIS2')}return{ids:[...new Set(out)],reasons}}
function activeControls(){let c=ctx();return C.controls.filter(x=>x.fw.some(f=>c.selected.includes(f)))}function activeReqs(){let c=ctx();return C.requirements.filter(r=>c.selected.includes(r.framework))}function mavg(){let c=ctx(),a=activeControls().map(x=>c.assess[x.id]?.level??0);return a.length?a.reduce((x,y)=>x+y,0)/a.length:0}
function reqState(r){let c=ctx();if(c.soa[r.id]?.app===false)return 'no_aplica';
 if(r.framework==='ens'&&r.ens&&!r.ens[ensReqLevel(r,c)])return 'no_aplica';
 let num=0,den=0,top=0;for(const m of r.maps){const l=c.assess[m.control]?.level??0;num+=m.w*(l>=c.target?1:l>0?.5:0);den+=m.w;top=Math.max(top,m.w)}
 if((c.gapclosed||{})[r.id])top=1;const sc=den?num/den*top:0;return sc>=0.999?'cubierto':sc>0?'parcial':'gap'}
function coverage(){let rs=activeReqs(),count={cubierto:0,parcial:0,gap:0,no_aplica:0};rs.forEach(r=>count[reqState(r)]++);return{...count,total:rs.length,pct:rs.length?Math.round(count.cubierto/rs.length*100):0}}
function priority(x){let c=ctx(),a=c.assess[x.id]?.level??0,n=x.fw.filter(f=>c.selected.includes(f)).length;return a===0?Math.min(100,75+n*6):a<c.target?Math.min(95,45+(c.target-a)*15+n*6):a<4?40:15}
function statusLabel(s){return s==='cubierto'?'Cubierto':s==='parcial'?'Parcial':s==='no_aplica'?'No aplica':'Gap'}
