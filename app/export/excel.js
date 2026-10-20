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
// Módulo: Exportación a Excel (.xlsx) sin dependencias.
const _crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=_crcT[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function zipStore(files){
 const enc=new TextEncoder(),parts=[],cen=[];let off=0;const u16=v=>[v&255,v>>8&255],u32=v=>[v&255,v>>8&255,v>>16&255,v>>>24&255];
 for(const [name,txt] of files){const n=enc.encode(name),d=enc.encode(txt),crc=crc32(d);
  const lh=Uint8Array.from([0x50,0x4b,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0)]);
  parts.push(lh,n,d);
  cen.push(Uint8Array.from([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),n);
  off+=lh.length+n.length+d.length}
 const cs=cen.reduce((s,x)=>s+x.length,0),end=Uint8Array.from([0x50,0x4b,5,6,...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cs),...u32(off),...u16(0)]);
 const all=[...parts,...cen,end],out=new Uint8Array(all.reduce((s,x)=>s+x.length,0));let p=0;all.forEach(x=>{out.set(x,p);p+=x.length});return out}
function xlsxBuild(sheets){
 const X=v=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,''),col=i=>{let s='';for(i++;i>0;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s};
 const sh=sheets.map(([n,rows])=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${(rows[0]||[]).map((_,i)=>`<col min="${i+1}" max="${i+1}" width="${Math.min(60,Math.max(10,...rows.slice(0,200).map(r=>String(r[i]??'').length+2)))}" customWidth="1"/>`).join('')}</cols><sheetData>${rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>typeof v==='number'&&isFinite(v)?`<c r="${col(ci)}${ri+1}" s="${ri?0:1}"><v>${v}</v></c>`:`<c r="${col(ci)}${ri+1}" s="${ri?0:1}" t="inlineStr"><is><t xml:space="preserve">${X(v??'')}</t></is></c>`).join('')}</row>`).join('')}</sheetData><autoFilter ref="A1:${col(Math.max(0,(rows[0]||[]).length-1))}${rows.length}"/></worksheet>`);
 const hd='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',N='http://schemas.openxmlformats.org/';
 return zipStore([['[Content_Types].xml',hd+`<Types xmlns="${N}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`],
 ['_rels/.rels',hd+`<Relationships xmlns="${N}package/2006/relationships"><Relationship Id="rId1" Type="${N}officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
 ['xl/workbook.xml',hd+`<workbook xmlns="${N}spreadsheetml/2006/main" xmlns:r="${N}officeDocument/2006/relationships"><sheets>${sheets.map(([n],i)=>`<sheet name="${X(n).slice(0,31)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets></workbook>`],
 ['xl/_rels/workbook.xml.rels',hd+`<Relationships xmlns="${N}package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="${N}officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length+1}" Type="${N}officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
 ['xl/styles.xml',hd+`<styleSheet xmlns="${N}spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3F6212"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`],
 ...sh.map((x,i)=>[`xl/worksheets/sheet${i+1}.xml`,x])])}
function exportExcel(){
 const c=ctx(),cov=coverage(),{per}=panelData(),lvOf=r=>Math.min(5,...r.maps.map(k=>c.assess[k.control]?.level??0));
 const res=[['Indicador','Valor'],['Empresa',c.name],['Sector',c.sector||''],['Emitido',new Date().toLocaleDateString('es-ES')],['Cobertura global %',cov.pct],['Madurez media',+mavg().toFixed(2)],['Nivel objetivo',c.target],['Categoría ENS efectiva',c.selected.includes('ens')?ensEffectiveCategory(c):'']];
 per.forEach(p=>res.push([`${fw(p.f).short} · % cobertura`,p.pct],[`${fw(p.f).short} · cubiertos / parciales / brechas / n.a.`,`${p.n.cubierto} / ${p.n.parcial} / ${p.n.gap} / ${p.n.no_aplica}`]));
 const reqs=[['Norma','Requisito','Referencia','Título','Controles','Madurez mínima','Objetivo','Estado','Aplica (SoA)','Justificación']];
 activeReqs().forEach(r=>{const so=c.soa[r.id];reqs.push([fw(r.framework).short,r.id,r.reference,r.title,r.maps.map(k=>k.control).join(' + '),lvOf(r),c.target,statusLabel(reqState(r)),so?.app===false?'No':'Sí',so?.note||''])});
 const caps=[['Control','Capacidad','Dominio','Madurez','Objetivo','Responsable','Normas']];
 activeControls().forEach(k=>caps.push([k.id,k.name,k.area,c.assess[k.id]?.level??0,c.target,c.assess[k.id]?.owner||'',k.fw.map(f=>fw(f).short).join(', ')]));
 const acts=[['Acción','Control','Responsable','Fecha límite','Estado','Nota']];c.actions.forEach(a=>acts.push([a.title,a.control,a.owner||'',a.due||'',a.status,a.note||'']));
 const blob=new Blob([xlsxBuild([['Resumen',res],['Requisitos',reqs],['Capacidades',caps],['Plan de acción',acts]])],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),l=document.createElement('a');
 l.href=URL.createObjectURL(blob);l.download='nexus-'+(c.name||'empresa').replace(/[^a-z0-9]+/gi,'-')+'.xlsx';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),500)}
