# Contribuir a GRC Nexus

1. Abre una incidencia describiendo el problema, el resultado esperado y los pasos para reproducirlo. No publiques datos reales de clientes.
2. Para cambios del catálogo, aporta la fuente oficial, la versión y la justificación de cada correspondencia. Marca claramente las equivalencias totales, parciales e informativas.
3. Mantén los cambios de interfaz separados de los cambios del catálogo cuando sea posible.
4. Ejecuta `npm test` y `npm run build` antes de enviar cambios.
5. Actualiza `CHANGELOG.md` y la documentación cuando cambie el comportamiento de la aplicación.
6. No añadas telemetría, llamadas externas ni dependencias de ejecución sin documentarlo de forma explícita.
7. Respeta la licencia GPL-2.0 y conserva la atribución al proyecto del que deriva el catálogo.

## Sincronizar el catálogo con Rosetta

`app/catalog.js` se genera desde `src/data/catalog.json` de [Rosetta Multinorma](https://github.com/heindall92/rosetta_multinorma) (GPL v2); no se edita a mano.

```bash
node tools/sync-catalog.js ../rosetta_multinorma            # regenera app/catalog.js
node tools/sync-catalog.js ../rosetta_multinorma --dry-run  # resumen de cambios, sin escribir
node tools/sync-catalog.js ../rosetta_multinorma --check    # CI: código 1 si hay diferencias
```

La ruta también puede darse con `ROSETTA_DIR`. Tras regenerar, ejecuta `npm test` y `node tools/build.js`.

## Estructura del código

`app/app.js` y `app/panel.js` se han dividido en módulos pequeños. Son scripts clásicos (sin ES modules), así que la app sigue funcionando al abrir `index.html` por `file://`. El orden de carga lo fija `index.html`, y lo siguen `tools/build.js` (genera `dist/nexus.html`), `tools/check.js` y los tests:

- `app/icons.js`, `app/catalog.js`: iconos Lucide y catálogo Rosetta (generado con `tools/sync-catalog.js`).
- `app/engine/`: `model.js` (normas, requisitos, integración del catálogo), `state.js` (localStorage), `scoring.js` (cobertura y prioridades), `ens.js` (nivel ENS por dimensión), `coherence.js` (migración y coherencia).
- `app/views/`: `shell.js` (estructura, sidebar y enrutado), `pages.js` (vistas principales), `panel.js`, `plan.js`, `wizard.js`, `search.js`, `compare.js`, `inicio.js`, `informe.js`, `detail-req.js` y `bottom-menu.js`.
- `app/export/`: `excel.js` (.xlsx) y `backup.js` (copias e importación/exportación).
- `app/actions.js` (acciones de usuario) y `app/boot.js` (arranque; siempre el último).

Para añadir un módulo, crea el archivo y añade su `<script src>` en `index.html` en el orden adecuado.
