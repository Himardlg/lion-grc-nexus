# Cambios

## Sin publicar — catálogo Rosetta v2.3.0
- Documentado que el catálogo de `app/catalog.js` ya equivale al contenido de Rosetta Multinorma v2.3.0 (commit `e5e51f8`, catálogo numerado internamente 2.2.0); verificado control a control, sin diferencias.
- Incluye los 5 enlaces de peso 0 que añadió la alineación con la CCN-STIC 825: GOB-12 → ISO A5.2, ACC-03 → ENS op.acc.5, RED-01 → ENS op.mon.1, FIS-05 → ISO A7.2, ACT-09 → ISO A8.26. No alteran el cálculo de cumplimiento.
- Pendiente: los 17 pares ENS ↔ ISO/IEC 27001 que la CCN-STIC 825 califica de parcialmente análogos son en Rosetta una regla de motor (`src/data/ccn825.json` + `rosetta-engine.js`), no datos del catálogo; no están portados a Nexus.
- Sin cambios de datos ni de lógica.
- Formularios de Riesgos y Evidencias e Informe imprimible sin desbordes horizontales en móvil y tablet (campos con ancho mínimo 0, una columna hasta 800 px y tablas del informe con desplazamiento propio). Verificado: 0 desbordes en las 22 vistas a 390 y 768 px.
- Modularización: `app/app.js` y `app/panel.js` divididos en 20 módulos (`app/engine/`, `app/views/`, `app/export/`, `app/actions.js`, `app/boot.js`) como scripts clásicos compatibles con `file://`. `index.html` fija el orden; `tools/build.js` lo sigue al generar `dist/nexus.html`, y `tools/check.js` y los tests lo leen de `index.html`. Refactor sin cambios de comportamiento: el DOM de las 22 vistas, en claro y oscuro, es idéntico antes y después (por http, `file://` y `dist`).
- Responsive mejorado en Requisitos, Controles y Panel multinorma (390, 768, 1024 y 1440 px): la cabecera ya no aparece en un recuadro con márgenes en tablet/móvil; margen lateral único por tamaño; indicadores de requisitos en 2×2 en pantallas estrechas (antes se desbordaban); KPI del panel en 3 columnas en tablet; cabeceras de panel y selector de matriz que se ajustan sin desbordar; objetivos táctiles de 44 px en botones, campos y enlaces de norma hasta 1024 px.
- Densidad afinada con tokens del Design System v2: cómoda, nueva «Estándar» y compacta (relleno, separación y espaciado entre bloques; la compacta reduce además títulos y cabecera). Se guarda en la preferencia existente `density`.
- Nuevo `tools/sync-catalog.js`: genera `app/catalog.js` desde `src/data/catalog.json` de Rosetta (sin dependencias), con validación de campos en español, `--check` (código 1 si difiere) y `--dry-run` (resumen de controles y requisitos añadidos/eliminados/modificados). Contra Rosetta `e5e51f8` reproduce byte a byte los datos actuales. Scripts npm `sync-catalog` y `sync-catalog:check`; pruebas en `tests/sync-catalog.test.js`.

## 1.19.2 — 13 de octubre de 2026
- Pantalla «Acerca de» (`#about`) con versión, licencia GPL v2, condiciones de distribución y atribución completa a Rosetta Multinorma / heindall92.
- Enlace «ℹ Acerca de» añadido en la barra lateral.
- Cabeceras de licencia GPL v2 en `app/app.js`, `app/panel.js` y `app/catalog.js`.
- Versión actualizada a 1.19.2 en todos los puntos de la UI.

## 1.19.1 — 9 de octubre de 2026
- Detalle de requisito rehecho: título y referencia sin repetir, todas las capacidades que lo cubren (con peso y madurez), evidencias típicas, equivalencias en otras normas y, para el ENS, el nivel considerado y dónde se exige.
- Escapado sistemático de todo texto de catálogo y de empresa en las vistas (44 interpolaciones).
- La opción «Pantalla inicial» ofrece ahora Panel, Presentación y Mis empresas (antes proponía un valor ya inexistente).
- Versiones, documentación del motor y `config/catalog.json` alineados con 1.19.1.

## 1.19.0 — 9 de octubre de 2026
- Evaluación de aplicabilidad para requisitos de todas las normas.
- Campos persistentes de justificación, responsable, observaciones y referencia de evidencia por requisito.
- Botón «Guardar cambios» y estado visible de guardado.
- Corregidos manejadores de justificación SoA y de campos de acciones.
- Datos anteriores conservados mediante migración compatible.

## 1.18.0 — 9 de octubre de 2026
- Respaldo completo de empresas, perfil y preferencias, con restauración validada (formato, 10 MB, máx. 200 empresas) y confirmación.
- Gestión de errores de almacenamiento.
- Referencias oficiales de ISO/IEC 42001 y NIS2 actualizadas.
- Documentación de privacidad, límites, atribución y comprobaciones previas a publicación.

## 1.17.0
- Matriz de correspondencias revisable por empresa.
- Campos de trazabilidad en evidencias, riesgos y auditorías.
