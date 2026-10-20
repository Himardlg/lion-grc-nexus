# Design System v2 (feature/design-v2) — Bloque A

## Lo que ya estaba hecho (y se mantiene)
- `assets/apple.css` ya define la dirección Apple: tokens `--accent` (amarillo Lion #feca06), `--surface`, `--bg`, `--text`, `--muted`, `--line`, `--fill`, materiales translúcidos, tipografía del sistema, iconos Lucide, modo claro/oscuro (`.theme-oscuro`), soporte de `prefers-reduced-motion`/`reduced-transparency`/`contrast`, sidebar e intro rediseñados.
- Pendiente detectado: sin escala de tipografía/espaciado/radios/elevación; texto secundario y de acento por debajo de 7:1 (`--muted` #6e6e73 ≈ 5:1, `--accent-ink` #8a6200 ≈ 5,4:1, `--muted` oscuro ≈ 6,3:1); todos los botones de fila en amarillo sólido (sin jerarquía); restos del verde lima antiguo (barras de cobertura #6f9a2c y halo `radial-gradient` lima en `.nexuswheel:after`).

## Cambios
- **apple.css** — nueva capa «Design System v2» al final, limitada a `.shell main` (el sidebar y la intro no se tocan):
  - Contraste ~7:1: `--muted` #4f4f54 / oscuro #b4b4b9; `--accent-ink` #6b4c00 (en oscuro sigue el amarillo); verde/naranja/rojo de estado oscurecidos (claro) o aclarados (oscuro).
  - Tokens: tipografía (`--fs-xs…--fs-3xl`), espaciado base 4 (`--sp-1…--sp-7`), radios (`--r-sm/md/lg/pill`), elevación (`--elev-1/2`), movimiento (`--ease-out`, `--dur-1/2`), anillo de foco (`--focus`).
  - Tarjetas con borde-sombra de 1px y hover sutil solo con puntero fino; chips neutros; barras de cobertura finas con pista neutra.
  - Jerarquía de botones: primario sólido acento, `.secondary` neutro relleno, nuevo `.tertiary` outline. Botones en píldora, 36px, `scale(.97)` al pulsar.
  - Foco visible unificado; inputs/selects homogéneos; estado de guardado discreto.
  - `prefers-reduced-motion`: se anulan transiciones/transform del contenido.
- **app.css** — eliminado el halo `radial-gradient` lima; barras `.pn-bar .ok/.mid` pasan a tokens (`--ds-ok`, `--ds-mid`).
- **Marcado** (solo clase): `class="tertiary"` en «Crear acción» (panel.js) y «Ver control completo» (app.js, vista Controles). Sin cambios de lógica.
- **Tests/harness**: la línea base ya fallaba (el stub de `document` no tenía `documentElement`, y el test no cargaba `app/icons.js`). Se añadió `documentElement:{}` al stub en `tests/engine.test.js` y `tools/check.js`, y `app/icons.js` a la carga del test. No cambia ninguna aserción.
- **dist/nexus.html** reconstruido con `node tools/build.js`.

No se tocaron: sidebar, intro/vídeo, catalog.js, motor ni funciones del Bloque B.

## Ajuste 2 — Menú inferior tomado de Rosetta
- **Referencia:** en Rosetta (`heindall92/rosetta_multinorma`, `src/app/03-shell.js` → `renderTabbar()` + `renderSheet()`, estilos `.tabbar`/`.sheet` en `rosetta.css`) el menú de abajo es la **barra de pestañas flotante de móvil** (4 secciones + «Más») que abre una **hoja** con una cuadrícula 3×3 de secciones, selector ES/EN, muestras de acento y un interruptor de tema.
- **Nexus (solo ≤480px, donde el sidebar ya es un cajón):**
  - Barra flotante: Inicio · Panel · Controles · Plan · Más (`aria-current` en la activa).
  - Hoja «Más»: Requisitos, Situación, Riesgos, Evidencias, Informe, Mapa, Ajustes, Ayuda (Acerca de) y Perfil, más ES/EN y un interruptor claro/oscuro. **Sin muestras de acento** (no se copia el acento de Rosetta; se usan `--accent` amarillo Lion, `--accent-faint/--accent-ink`, `--material`, `--surface`, `--line`).
  - Accesibilidad: `role="dialog"` + `aria-modal`, `aria-expanded`/`aria-controls` en «Más», foco al primer elemento al abrir, Tab atrapado dentro, Escape o tocar el fondo cierra y devuelve el foco a «Más»; interruptor `role="switch"` con `aria-checked`; se cierra al navegar.
  - `prefers-reduced-motion` (sin animación de entrada ni del interruptor), `prefers-reduced-transparency` y oculto al imprimir.
- **Escritorio:** sin cambios. El sidebar de Yoandy ya tiene su menú de perfil al pie, y la barra inferior no se muestra en escritorio para no tocarlo.
- Archivos: `app/app.js` (función `bottomMenu`, `toggleSheet`, una llamada en `view()` y el cierre en `render()`), `app/icons.js` (iconos Lucide `user`, `ellipsis`, `circle-help`), `assets/apple.css` (bloque «Menú inferior»).
