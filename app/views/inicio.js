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
// Módulo: Pantalla de inicio y empresa de ejemplo.
function inicioView(){
 const own=hasCompany();
 return `<section class="ini"><div class="ini-hero"><div class="eyebrow">NEXUS · MAPA MULTINORMA</div><h1>Evalúa una capacidad una vez. Cuenta en todas tus normas.</h1><p>Nexus conecta ${C.controls.length} capacidades con ${C.requirements.length} requisitos de ENS, ISO 27001, NIS2, ISO 42001 y DORA, para ver qué cubres, qué te falta y qué hacer primero.</p>
 <div class="ini-btns">${own?'<a class="buttonlink" href="#panel">Ir a mi panel '+icon('arrow-right')+'</a>':'<button onclick="newCompany()">Empezar con mi empresa '+icon('arrow-right')+'</button>'}<button class="secondary" onclick="loadDemo()">Ver un ejemplo</button><button class="secondary" onclick="openSearch()">Buscar un requisito</button></div></div>
 <div class="ini-steps"><div><b>1</b><h3>Cuéntanos tu contexto</h3><p>Sector, tamaño, categoría ENS o clasificación NIS2. Nexus propone qué normas revisar.</p></div><div><b>2</b><h3>Evalúa una sola vez</h3><p>Cada capacidad se puntúa una vez y su resultado se reparte entre todas las normas que la usan.</p></div><div><b>3</b><h3>Decide con datos</h3><p>Cobertura por norma, brechas con mayor impacto, plan de acción y exportables.</p></div></div>
 <div class="ini-norms">${C.frameworks.map(f=>`<a href="#library?fw=${f.id}"><b>${esc(f.short)}</b><span>${C.requirements.filter(r=>r.framework===f.id).length} requisitos</span><small>${esc(f.desc)}</small></a>`).join('')}</div>
 <div class="ini-links"><a href="#compare">${icon('arrow-left-right')} Comparar dos normas</a><a href="#equivalences">Equivalencias</a><a href="#library">Biblioteca</a></div></section>`}

function loadDemo(){
 const c=blankCompany('TechServ · ejemplo');Object.assign(c,{sector:'Proveedor TIC del sector público',size:'Mediana',employees:'85',criticality:'alta',public:true,ensCategory:'alta',nis2Class:'importante',selected:['ens','iso27001','nis2'],target:3,wizard:null});
 C.controls.forEach((k,i)=>{const ens=k.fw.includes('ens');c.assess[k.id]={level:ens?(i%7===3?2:4):k.fw.includes('iso27001')?1:0,owner:ens?'Responsable de seguridad':'',evidence:''}});
 db.companies[c.id]=c;db.activeCompanyId=c.id;save();auto();goTo('panel')}
