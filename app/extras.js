// GRC Nexus — Extras: selección múltiple de empresas, edición de elementos
// creados (controles, evidencias, riesgos, auditorías), buscador del mapa
// multinorma y menú de empresa activa al pasar el ratón.
// Licencia GPL-2.0-or-later. Se carga después de feature-b.js y antes de boot.js.
(function () {
  'use strict';

  // ---------- Iconos que faltaban ----------
  if (typeof ICONS === 'object') {
    ICONS['trash-2'] = '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>';
    ICONS['pencil'] = '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>';
    ICONS['x'] = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  }

  // ---------- Estilos (usan las variables del tema de apple.css) ----------
  const css = `
.shell .companycard{position:relative}
.shell .companysel{position:absolute;top:14px;right:14px;display:flex;align-items:center;cursor:pointer;z-index:2}
.shell .companysel input{width:18px;height:18px;margin:0;accent-color:var(--accent);cursor:pointer}
.shell .companycard.picked{border-color:var(--red)}
.shell .companybulk{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:0 54px 16px;padding:12px 16px;background:var(--surface);border:1px solid var(--line);border-radius:12px;color:var(--text)}
.shell .companybulk .bulkall{display:flex;align-items:center;gap:8px;font-weight:500;cursor:pointer}
.shell .companybulk input[type=checkbox]{width:18px;height:18px;margin:0;accent-color:var(--accent)}
.shell .companybulk .bulkcount{color:var(--muted);font-size:13px;margin-right:auto}
.shell .companybulk button{display:inline-flex;align-items:center;gap:6px}
.shell .companybulk button:disabled{opacity:.4;cursor:not-allowed}
@media(max-width:800px){.shell .companybulk{margin:0 20px 16px}}
.shell .lineactions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.shell .lineactions button,.shell .riskcard .lineactions button{display:inline-flex;align-items:center;gap:6px}
.shell .editform{width:100%}
.shell .editform .formactions{display:flex;gap:8px;grid-column:1/-1}
.shell .riskcard.riskedit{grid-column:1/-1}
.shell .ctlquick{margin-top:12px;border-top:1px solid var(--line);padding-top:10px}
.shell .ctlquick>summary{cursor:pointer;list-style:none;display:inline-flex;align-items:center;gap:6px;font-weight:500;color:var(--accent-ink)}
.shell .ctlquick>summary::-webkit-details-marker{display:none}
.shell .ctlquickbody{display:grid;gap:10px;margin-top:10px}
.shell .ctlquickbody label{display:grid;gap:4px;font-size:12px;color:var(--muted)}
.shell .ctlquickbody input,.shell .ctlquickbody select,.shell .ctlquickbody textarea{width:100%;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:8px 10px}
.shell .ctlquickbody textarea{min-height:64px;resize:vertical}
.shell .maptoolbar{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 10px}
.shell .maptoolbar input{flex:1 1 260px}
`;
  const st = document.createElement && document.createElement('style');
  if (st && document.head) { st.id = 'nexus-extras-css'; st.textContent = css; document.head.appendChild(st); }

  const E = v => (typeof esc === 'function' ? esc(v) : String(v ?? ''));
  const opts = (list, cur) => list.map(o => `<option${o === cur ? ' selected' : ''}>${E(o)}</option>`).join('');
  const pad = () => { const e = document.getElementById('saveStatus'); if (e) { e.className = 'save-status saved'; e.innerHTML = icon('check') + ' Cambios guardados'; } };

  // =====================================================================
  // 1) MIS EMPRESAS: selección múltiple + eliminar seleccionadas
  // =====================================================================
  if (typeof companyCard === 'function') {
    const cardOrig = companyCard;
    companyCard = function (c) {
      const h = cardOrig(c);
      return h.replace(/(<article class="companycard[^"]*")>/,
        `$1><label class="companysel" title="Seleccionar empresa"><input type="checkbox" class="company-select" value="${E(c.id)}" aria-label="Seleccionar empresa" onchange="updateCompanySelection()"></label>`);
    };
  }
  if (typeof companies === 'function') {
    const companiesOrig = companies;
    companies = function () {
      const h = companiesOrig();
      if (!Object.keys(db.companies || {}).length) return h;
      const bar = `<section class="companybulk"><label class="bulkall"><input type="checkbox" id="companySelectAll" onchange="toggleAllCompanies(this.checked)"> Seleccionar todas</label><span class="bulkcount" id="companySelCount" aria-live="polite">0 seleccionadas</span><button type="button" class="danger" id="companyDeleteSel" onclick="deleteSelectedCompanies()" disabled>${icon('trash-2')} Eliminar seleccionadas</button></section>`;
      return h.replace('<section class="companygrid">', bar + '<section class="companygrid">');
    };
  }
  function updateCompanySelection() {
    const all = [...document.querySelectorAll('.company-select')];
    const on = all.filter(x => x.checked);
    all.forEach(x => { const a = x.closest('.companycard'); if (a) a.classList.toggle('picked', x.checked); });
    const n = on.length;
    const cnt = document.getElementById('companySelCount'), btn = document.getElementById('companyDeleteSel'), sa = document.getElementById('companySelectAll');
    if (cnt) cnt.textContent = n + ' ' + (n === 1 ? 'seleccionada' : 'seleccionadas');
    if (btn) btn.disabled = !n;
    if (sa) { sa.checked = n > 0 && n === all.length; sa.indeterminate = n > 0 && n < all.length; }
  }
  function toggleAllCompanies(on) {
    document.querySelectorAll('.company-select').forEach(x => { x.checked = !!on; });
    updateCompanySelection();
  }

  // =====================================================================
  // 2) EDITAR evidencias, riesgos y auditorías
  // =====================================================================
  const ED = { evidence: -1, risks: -1, audits: -1 };
  const ctlOpts = cur => {
    const list = activeControls().map(x => [x.id, x.id + ' · ' + x.name]);
    if (cur && !list.some(x => x[0] === cur)) list.unshift([cur, cur]);
    return list.map(([id, t]) => `<option value="${E(id)}"${id === cur ? ' selected' : ''}>${E(t)}</option>`).join('');
  };
  const rangeOpts = cur => [1, 2, 3, 4, 5].map(x => `<option${x === Number(cur) ? ' selected' : ''}>${x}</option>`).join('');
  const editBtns = (kind, i) => `<div class="lineactions"><button type="button" class="secondary" onclick="startEdit('${kind}',${i})">${icon('pencil')} Editar</button><button type="button" class="danger" onclick="removeItem('${kind}',${i})">Eliminar</button></div>`;
  const cancelBtns = label => `<div class="formactions"><button type="submit">${label}</button><button type="button" class="secondary" onclick="cancelEdit()">Cancelar</button></div>`;

  function startEdit(kind, i) {
    ED.evidence = ED.risks = ED.audits = -1;
    ED[kind] = i;
    render();
    setTimeout(() => { const f = document.querySelector('.editform input,.editform select'); if (f) { f.focus(); f.scrollIntoView && f.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 30);
  }
  function cancelEdit() {
    ED.evidence = ED.risks = ED.audits = -1;
    render();
  }
  function saveEdit(kind, i, e) {
    e.preventDefault();
    const f = new FormData(e.target), list = ctx()[kind];
    if (!list || !list[i]) { cancelEdit(); return; }
    if (kind === 'evidence') {
      const s = f.get('status');
      Object.assign(list[i], {
        title: String(f.get('title') || '').trim() || list[i].title,
        control: f.get('control'), ref: f.get('ref') || '', owner: f.get('owner') || '',
        reviewDate: f.get('reviewDate') || '',
        status: ['Vigente', 'Revisar', 'Obsoleta'].includes(s) ? s : 'Vigente',
        notes: f.get('notes') || ''
      });
    } else if (kind === 'risks') {
      const s = f.get('status'), n = v => Math.max(1, Math.min(5, Number(v) || 1));
      Object.assign(list[i], {
        title: String(f.get('title') || '').trim() || list[i].title,
        control: f.get('control'), impact: n(f.get('impact')), likelihood: n(f.get('likelihood')),
        owner: f.get('owner') || '', treatment: f.get('treatment') || '',
        status: ['Abierto', 'En tratamiento', 'Aceptado', 'Cerrado'].includes(s) ? s : 'Abierto'
      });
    } else if (kind === 'audits') {
      const s = f.get('status');
      Object.assign(list[i], {
        name: String(f.get('name') || '').trim() || list[i].name,
        scope: f.get('scope') || '', owner: f.get('owner') || '', date: f.get('date') || '',
        findings: f.get('findings') || '',
        status: ['Planificada', 'En curso', 'Finalizada'].includes(s) ? s : 'Planificada'
      });
    }
    ctx().updatedAt = now();
    ED[kind] = -1;
    if (save()) { render(); pad(); }
  }

  evidence = function () {
    const c = ctx();
    const row = (e, i) => ED.evidence === i
      ? `<div class="line"><form class="inlineform editform" onsubmit="saveEdit('evidence',${i},event)"><input name="title" required value="${E(e.title)}" placeholder="Nombre de la evidencia"><select name="control">${ctlOpts(e.control)}</select><input name="ref" value="${E(e.ref)}" placeholder="Ruta o enlace seguro"><input name="owner" value="${E(e.owner)}" placeholder="Responsable"><input name="reviewDate" type="date" value="${E(e.reviewDate)}" aria-label="Fecha de revisión"><select name="status">${opts(['Vigente', 'Revisar', 'Obsoleta'], e.status || 'Vigente')}</select><input name="notes" value="${E(e.notes)}" placeholder="Notas de revisión">${cancelBtns('Guardar evidencia')}</form></div>`
      : `<div class="line"><div><b>${E(e.title)}</b><small>${E(e.control)} · ${E(e.owner || 'Sin responsable')} · ${E(e.status || 'Vigente')} · Revisar: ${E(e.reviewDate || 'Sin fecha')}<br>${E(e.ref || 'Sin referencia')}${e.notes ? ' · ' + E(e.notes) : ''}</small></div>${editBtns('evidence', i)}</div>`;
    return head('11 · EVIDENCIAS', 'Demostrar lo que existe', 'Registra responsable, vigencia y revisión. No adjuntes secretos ni datos personales innecesarios; guarda aquí la referencia segura al repositorio documental.')
      + `<section class="panel"><div class="panelhead"><h2>Nueva evidencia</h2></div><form class="inlineform" onsubmit="addEvidence(event)"><input name="title" required placeholder="Nombre de la evidencia"><select name="control">${activeControls().map(x => `<option value="${x.id}">${x.id} · ${E(x.name)}</option>`).join('')}</select><input name="ref" placeholder="Ruta o enlace seguro"><input name="owner" placeholder="Responsable"><input name="reviewDate" type="date" aria-label="Fecha de revisión"><select name="status"><option>Vigente</option><option>Revisar</option><option>Obsoleta</option></select><input name="notes" placeholder="Notas de revisión"><button>Registrar evidencia</button></form></section>`
      + `<section class="panel">${c.evidence.length ? c.evidence.map(row).join('') : '<div class="empty">Todavía no hay evidencias registradas.</div>'}</section>`;
  };

  risks = function () {
    const c = ctx();
    const card = (r, i) => ED.risks === i
      ? `<article class="riskcard riskedit"><div class="eyebrow">Editar riesgo</div><form class="inlineform editform" onsubmit="saveEdit('risks',${i},event)"><input name="title" required value="${E(r.title)}" placeholder="Riesgo identificado"><select name="control">${ctlOpts(r.control)}</select><label>Impacto<select name="impact">${rangeOpts(r.impact)}</select></label><label>Probabilidad<select name="likelihood">${rangeOpts(r.likelihood)}</select></label><input name="owner" value="${E(r.owner)}" placeholder="Responsable del riesgo"><input name="treatment" value="${E(r.treatment)}" placeholder="Tratamiento / respuesta"><select name="status">${opts(['Abierto', 'En tratamiento', 'Aceptado', 'Cerrado'], r.status || 'Abierto')}</select>${cancelBtns('Guardar riesgo')}</form></article>`
      : `<article class="riskcard"><div class="eyebrow">${E(r.control)} · ${E(r.status || 'Abierto')}</div><h2>${E(r.title)}</h2><p>Impacto ${r.impact} · Probabilidad ${r.likelihood} · Inherente <b>${r.impact * r.likelihood}/25</b></p><p>Responsable: ${E(r.owner || 'Sin asignar')}<br>Tratamiento: ${E(r.treatment || 'Pendiente de definir')}</p>${editBtns('risks', i)}</article>`;
    return head('12 · RIESGOS', 'Conectar cumplimiento y riesgo', 'Registra valoración inherente, responsable, tratamiento y estado. La puntuación es una ayuda de priorización, no una valoración automática de riesgo residual.')
      + `<section class="panel"><form class="inlineform" onsubmit="addRisk(event)"><input name="title" required placeholder="Riesgo identificado"><select name="control">${activeControls().map(x => `<option value="${x.id}">${x.id} · ${E(x.name)}</option>`).join('')}</select><label>Impacto<select name="impact">${[1, 2, 3, 4, 5].map(x => `<option>${x}</option>`).join('')}</select></label><label>Probabilidad<select name="likelihood">${[1, 2, 3, 4, 5].map(x => `<option>${x}</option>`).join('')}</select></label><input name="owner" placeholder="Responsable del riesgo"><input name="treatment" placeholder="Tratamiento / respuesta"><select name="status"><option>Abierto</option><option>En tratamiento</option><option>Aceptado</option><option>Cerrado</option></select><button>Registrar riesgo</button></form></section>`
      + `<section class="riskgrid">${c.risks.length ? c.risks.map(card).join('') : '<div class="empty">Todavía no hay riesgos registrados.</div>'}</section>`;
  };

  audits = function () {
    const c = ctx();
    const row = (a, i) => ED.audits === i
      ? `<div class="line"><form class="inlineform editform" onsubmit="saveEdit('audits',${i},event)"><input name="name" required value="${E(a.name)}" placeholder="Nombre de auditoría"><input name="scope" value="${E(a.scope)}" placeholder="Alcance / normas"><input name="owner" value="${E(a.owner)}" placeholder="Responsable"><input name="date" type="date" value="${E(a.date)}" aria-label="Fecha de auditoría"><select name="status">${opts(['Planificada', 'En curso', 'Finalizada'], a.status || 'Planificada')}</select><input name="findings" value="${E(a.findings)}" placeholder="Resumen de hallazgos">${cancelBtns('Guardar auditoría')}</form></div>`
      : `<div class="line"><div><b>${E(a.name)}</b><small>${E(a.scope || 'Alcance no indicado')} · ${E(a.status)} · ${E(a.owner || 'Sin responsable')} · ${E(a.date || 'Sin fecha')}<br>${E(a.findings || 'Sin resumen de hallazgos')}</small></div>${editBtns('audits', i)}</div>`;
    return head('13 · AUDITORÍA', 'Comprobar y verificar', 'Registra alcance, responsable, fecha y resumen de hallazgos. El seguimiento detallado de cada hallazgo puede vincularse a una acción correctiva.')
      + `<section class="panel"><form class="inlineform" onsubmit="addAudit(event)"><input name="name" required placeholder="Nombre de auditoría"><input name="scope" placeholder="Alcance / normas"><input name="owner" placeholder="Responsable"><input name="date" type="date" aria-label="Fecha de auditoría"><select name="status"><option>Planificada</option><option>En curso</option><option>Finalizada</option></select><input name="findings" placeholder="Resumen de hallazgos"><button>Registrar auditoría</button></form></section>`
      + `<section class="panel">${c.audits.length ? c.audits.map(row).join('') : '<div class="empty">Todavía no hay auditorías registradas.</div>'}</section>`;
  };

  // Al salir de la página, se cancela cualquier edición abierta
  if (window.addEventListener) window.addEventListener('hashchange', () => { ED.evidence = ED.risks = ED.audits = -1; });
  if (typeof removeItem === 'function') {
    const rmOrig = removeItem;
    removeItem = function (k, i) { ED.evidence = ED.risks = ED.audits = -1; return rmOrig(k, i); };
  }

  // =====================================================================
  // 3) CONTROLES: editar la evaluación directamente desde la tarjeta
  // =====================================================================
  if (typeof controlCard === 'function') {
    const cardOrig = controlCard;
    controlCard = function (c, all) {
      const h = cardOrig(c, all);
      if (!hasCompany()) return h;
      const a = ctx().assess[c.id] || { level: 0, owner: '', evidence: '' };
      const form = `<details class="ctlquick"><summary>${icon('pencil')} Editar evaluación</summary><div class="ctlquickbody" data-id="${E(c.id)}"><label>Nivel<select data-f="level">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}"${n === Number(a.level) ? ' selected' : ''}>${n}</option>`).join('')}</select></label><label>Responsable<input data-f="owner" value="${E(a.owner)}" placeholder="Responsable"></label><label>Observación / evidencia<textarea data-f="evidence" placeholder="Observación / evidencia">${E(a.evidence)}</textarea></label><button type="button" onclick="saveControlQuick('${E(c.id)}')">Guardar evaluación</button></div></details>`;
      return h.replace(/<\/article>\s*$/, form + '</article>');
    };
  }
  function saveControlQuick(id) {
    const box = [...document.querySelectorAll('.ctlquickbody')].find(b => b.dataset.id === id);
    if (!box) return;
    const g = k => box.querySelector(`[data-f="${k}"]`);
    const lv = Math.max(0, Math.min(5, Number(g('level').value) || 0));
    const c = ctx();
    c.assess[id] = { level: lv, owner: g('owner').value, evidence: g('evidence').value };
    c.updatedAt = now();
    if (!save()) return;
    const card = box.closest('.controlcard');
    const b = card && card.querySelector('.controlmeta b');
    if (b) b.textContent = lv + '/5';
    const det = box.closest('details');
    if (det) det.open = false;
    pad();
  }

  // =====================================================================
  // 4) MAPA MULTINORMA: buscador + filtro por norma
  // =====================================================================
  const nz = s => (typeof ctlNorm === 'function' ? ctlNorm(s) : String(s ?? '').toLowerCase());
  map = function () {
    const c = ctx(), sel = c.selected || [];
    const groups = activeControls().map(x => ({ c: x, rs: activeReqs().filter(r => usesCtl(r, x.id)), l: c.assess[x.id]?.level || 0 }));
    const empty = groups.length ? '' : `<section class="panel ctlnotice" role="status"><div class="ctlnoticeico">${icon('scale')}</div><div class="ctlnoticetxt"><h2>No hay controles que trazar</h2><p>Esta empresa aún no tiene normas seleccionadas. Elige la normativa aplicable para ver cómo cada control cubre requisitos de varias normas.</p></div><a class="btnprimary" href="#scope">${icon('scale')} Elegir normativa aplicable</a></section>`;
    const toolbar = groups.length
      ? `<div class="toolbar maptoolbar"><input id="mq" type="search" placeholder="Buscar en el mapa: control, norma o requisito" aria-label="Buscar en el mapa" oninput="filterMap()"><select id="mfw" aria-label="Filtrar por norma" onchange="filterMap()" oninput="filterMap()"><option value="">Todas las normas</option>${C.frameworks.filter(f => sel.includes(f.id)).map(f => `<option value="${f.id}">${E(f.short)}</option>`).join('')}</select></div><p id="mqcount" class="ctlcount" aria-live="polite">${groups.length} controles</p><div id="mqempty" class="panel ctlnoresult" style="display:none">${icon('search-x')}<div><b>Sin resultados en el mapa</b><small>Prueba con otra palabra, con el ID de un control o con otra norma.</small></div></div>`
      : '';
    const block = g => {
      const bq = nz([g.c.id, g.c.name, g.c.area, g.c.domain, g.c.description, g.c.reason].join(' '));
      const fws = g.c.fw.filter(f => sel.includes(f));
      return `<div class="mapblock" data-q="${E(bq)}" data-fw="${E(fws.join(','))}"><div class="line"><div><b>${g.c.id} · ${E(g.c.name)}</b><small>${g.rs.length} requisitos relacionados · nivel ${g.l}/5</small></div><div class="tags">${fws.map(f => `<span>${fw(f).short}</span>`).join('')}</div></div><div class="mapreqs">${g.rs.map(r => `<div class="mapreq" data-fw="${E(r.framework)}" data-q="${E(nz([r.id, r.reference, r.title, r.area, fw(r.framework).short, fw(r.framework).name].join(' ')))}"><span>${fw(r.framework).short}</span>${E(r.id)} · ${E(r.title)}<strong class="${reqState(r)}">${reqState(r)}</strong></div>`).join('')}</div></div>`;
    };
    return head('14 · MAPA MULTINORMA', 'Una evaluación, múltiples requisitos', 'La trazabilidad muestra cómo un control puede cerrar varios requisitos y normas.')
      + empty + toolbar + `<section class="panel"${groups.length ? '' : ' hidden'}>${groups.map(block).join('')}</section>`;
  };
  function filterMap() {
    const toks = nz((document.getElementById('mq') || {}).value || '').trim().split(/\s+/).filter(Boolean);
    const f = (document.getElementById('mfw') || {}).value || '';
    let shown = 0, total = 0;
    document.querySelectorAll('.mapblock').forEach(b => {
      total++;
      const blockHit = toks.every(t => (b.dataset.q || '').includes(t));
      const reqs = [...b.querySelectorAll('.mapreq')];
      let n = 0;
      reqs.forEach(r => {
        const ok = (!f || r.dataset.fw === f) && (!toks.length || blockHit || toks.every(t => (r.dataset.q || '').includes(t)));
        r.style.display = ok ? '' : 'none';
        if (ok) n++;
      });
      const fwOk = !f || (b.dataset.fw || '').split(',').includes(f);
      const show = fwOk && (n > 0 || (!reqs.length && (blockHit || !toks.length)));
      b.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    const cnt = document.getElementById('mqcount');
    if (cnt) cnt.textContent = (toks.length || f) ? `${shown} de ${total} controles` : `${total} controles`;
    const em = document.getElementById('mqempty');
    if (em) em.style.display = shown ? 'none' : '';
  }

  // =====================================================================
  // 5) Menú «Empresa activa»: se abre al pasar el ratón
  // =====================================================================
  let closeTimer = null;
  const canHover = () => !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  if (!document.addEventListener) return finish();
  document.addEventListener('mouseover', e => {
    if (!canHover() || !e.target.closest) return;
    const d = e.target.closest('.activeorg');
    if (d) { clearTimeout(closeTimer); if (!d.open) d.open = true; }
  });
  document.addEventListener('mouseout', e => {
    if (!canHover() || !e.target.closest) return;
    const d = e.target.closest('.activeorg');
    if (!d || (e.relatedTarget && d.contains(e.relatedTarget))) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      const o = document.querySelector('.activeorg');
      if (o && !o.matches(':hover')) o.open = false;
    }, 180);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest) return;
    // Con ratón el menú se gobierna por hover; con teclado/táctil sigue funcionando el clic
    if (canHover() && e.detail > 0 && e.target.closest('.activeorg > summary')) { e.preventDefault(); return; }
    const item = e.target.closest('.orgmenu a, .orgmenu button');
    if (item) { const o = item.closest('details'); setTimeout(() => { if (o) o.open = false; }); }
  });

  finish();

  function finish() {
    Object.assign(window, {
      updateCompanySelection, toggleAllCompanies,
      startEdit, cancelEdit, saveEdit,
      saveControlQuick, filterMap
    });
  }
})();
