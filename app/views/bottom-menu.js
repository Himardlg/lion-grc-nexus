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
// Módulo: Menú inferior móvil (barra de pestañas + hoja «Más»).
/* Menú inferior (móvil), estructura tomada de Rosetta: barra de pestañas + hoja «Más». Solo vistas y preferencias existentes. */
var sheetOpen=false;
function bottomMenu(p,en,L){const dark=db.settings.theme==='oscuro',tab=(id,t,ic)=>`<a href="#${id}" class="tb-i"${p===id?' aria-current="page"':''}>${icon(ic)}<span>${t}</span></a>`,more=[['requirements',L('Requisitos','Requirements'),'list-checks'],['current',L('Situación','Current state'),'clipboard-list'],['risks',L('Riesgos','Risks'),'triangle-alert'],['evidence',L('Evidencias','Evidence'),'files'],['informe',L('Informe','Report'),'file-text'],['map',L('Mapa','Map'),'map'],['settings',L('Ajustes','Settings'),'settings'],['about',L('Ayuda','Help'),'circle-help'],['profile',L('Perfil','Profile'),'user']];
return `<nav class="tabbar" aria-label="${L('Secciones','Sections')}">${tab('inicio',L('Inicio','Home'),'house')}${tab('panel',L('Panel','Panel'),'layout-dashboard')}${tab('controls',L('Controles','Controls'),'shield')}${tab('actions',L('Plan','Plan'),'list-todo')}<button type="button" class="tb-i tb-more" aria-haspopup="dialog" aria-expanded="${sheetOpen}" aria-controls="bsheet" onclick="toggleSheet()">${icon('ellipsis')}<span>${L('Más','More')}</span></button></nav>${sheetOpen?`<div class="bsheet-back" onclick="toggleSheet(false)"></div><div id="bsheet" class="bsheet" role="dialog" aria-modal="true" aria-label="${L('Más opciones','More options')}"><div class="bs-grid">${more.map(([id,t,ic])=>`<a href="#${id}"${p===id?' aria-current="page"':''}>${icon(ic)}<span>${t}</span></a>`).join('')}</div><div class="bs-row"><div class="bs-seg" role="group" aria-label="${L('Idioma','Language')}"><button type="button" aria-pressed="${!en}" onclick="setPreference('language','es')">ES</button><button type="button" aria-pressed="${en}" onclick="setPreference('language','en')">EN</button></div><button type="button" class="bs-theme" role="switch" aria-checked="${dark}" aria-label="${L('Modo oscuro','Dark mode')}" onclick="setPreference('theme','${dark?'claro':'oscuro'}')">${icon('sun')}${icon('moon')}<span class="knob">${icon(dark?'moon':'sun')}</span></button></div></div>`:''}`}
function toggleSheet(v){sheetOpen=v===undefined?!sheetOpen:v;render();const el=sheetOpen?document.querySelector('#bsheet a, #bsheet button'):document.querySelector('.tb-more');if(el&&el.focus)el.focus()}
document.addEventListener?.('keydown',e=>{if(e.key==='Escape'&&sheetOpen)toggleSheet(false);else if(e.key==='Tab'&&sheetOpen){const f=[...document.querySelectorAll('#bsheet a,#bsheet button')];if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
