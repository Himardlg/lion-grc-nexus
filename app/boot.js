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
// Módulo: Arranque: enrutado por hash, render y atajos.
window.onhashchange=render;Object.assign(window,{setGap,setSoaNote,setRequirementField,saveRequirementDetails,saveControlEvaluation,updateActionField,saveCompany,newCompany,selectCompany,editCompany,deleteCompany,toggle,setA,setSoa,filter,filterLevel,filterReq,filterReqState,filterCtl,filterCtlFw,make,auto,updateAction,addEvidence,addRisk,addAudit,removeItem,openDetail,saveProfile,saveSettings,setPreference,cycleTheme,toggleSetting,toggleDock,toggleBar,toggleNav,exportCompany,importCompany,buildBackupPayload,exportBackup,restoreBackup,resetCompany});let _lastHash=null;
function render(){const same=_lastHash===location.hash,y=window.scrollY,v={};if(!same){navOpen=false;sheetOpen=false}if(same)['q','rq','cq'].forEach(i=>{const e=document.getElementById(i);if(e)v[i]=e.value});document.getElementById('app').innerHTML=view();Object.entries(v).forEach(([i,val])=>{const e=document.getElementById(i);if(e&&val){e.value=val;e.dispatchEvent(new Event('input'))}});document.querySelectorAll('.clickable').forEach(e=>{e.tabIndex=0;e.setAttribute('role','link')});window.scrollTo(0,same?y:0);_lastHash=location.hash}
document.addEventListener&&document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList?.contains('clickable')){e.preventDefault();e.target.click()}});
render();
