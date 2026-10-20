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
// Módulo: Asistente de configuración paso a paso.
/* Asistente de configuración: Empresa: Normativa: Situación actual: Qué necesitas: Plan de acción */
const WIZ=[['company','Empresa'],['scope','Normativa'],['current','Situación actual'],['needs','Qué necesitas'],['actions','Plan de acción']];
function goTo(h){location.hash==='#'+h?render():location.hash=h}
function wizardBar(p){
 if(!hasCompany())return '';const c=ctx(),i=WIZ.findIndex(w=>w[0]===p);if(c.wizard==null||i<0)return '';
 return `<nav class="wiz" aria-label="Asistente de configuración"><ol>${WIZ.map((w,k)=>`<li class="${k<i?'done':k===i?'now':''}" ${k===i?'aria-current="step"':''}><a href="#${w[0]}"><span>${k<i?icon('check'):k+1}</span>${w[1]}</a></li>`).join('')}</ol><div class="wizbtns">${i>0?'<button class="secondary" onclick="wizGo(-1)">'+icon('arrow-left')+' Atrás</button>':''}<button class="secondary" onclick="wizExit()">Salir del asistente</button>${p==='company'?'':`<button onclick="wizGo(1)">${i===WIZ.length-1?'Finalizar y ver el panel':'Confirmar y continuar '+icon('arrow-right')}</button>`}</div></nav>`}
function wizGo(d){
 const c=ctx(),p=location.hash.slice(1).split('?')[0],i=WIZ.findIndex(w=>w[0]===p);if(i<0)return;
 if(d>0&&p==='scope'&&!c.selected.length){alert('Selecciona al menos una norma para continuar.');return}
 const n=i+d;if(n<0)return;
 if(n>=WIZ.length){c.wizard=null;save();goTo('panel');return}
 c.wizard=n;save();goTo(WIZ[n][0])}
function wizExit(){ctx().wizard=null;save();render()}
function wizStart(){ctx().wizard=0;save();goTo('company')}
