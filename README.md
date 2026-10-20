# Nexus GRC Lion

<p align="center">
  <img src="assets/lion-mark.png" alt="Nexus GRC Lion" width="96"/>
</p>

<p align="center">
  <b>Herramienta local de apoyo GRC multinorma</b> — evaluación, madurez, riesgos, evidencias, auditorías, correspondencias requisito–control y planes de acción.<br/>
  Corre en el navegador; los datos se quedan en el dispositivo (<code>localStorage</code>).
</p>

<p align="center">
  <img alt="Licencia GPLv2" src="https://img.shields.io/badge/LICENCIA-GPLv2-4169A1?style=flat"/>
  <img alt="UI ES/EN" src="https://img.shields.io/badge/UI-ES%20%2F%20EN-f3bc25?style=flat&labelColor=1d1d1f"/>
  <img alt="Local-first" src="https://img.shields.io/badge/datos-local--first-2E8B57?style=flat"/>
  <img alt="Iconos Lucide" src="https://img.shields.io/badge/iconos-Lucide-F56565?style=flat"/>
  <img alt="Versión" src="https://img.shields.io/badge/versión-1.19.2-1d1d1f?style=flat"/>
</p>

---

## Intro

<p align="center">
  <a href="assets/intro.mp4">
    <img src="docs/img/readme/intro-poster.png" alt="Intro cinematográfica Nexus GRC Lion" width="880"/>
  </a>
</p>

<p align="center">
  <video src="assets/intro.mp4" controls playsinline muted poster="docs/img/readme/intro-poster.png" width="880">
    Tu navegador no reproduce el vídeo embebido. Ábrelo aquí: <a href="assets/intro.mp4">assets/intro.mp4</a>
  </video>
</p>

<p align="center"><sub>Intro de marca Lion (vídeo en el repositorio). En móvil el fondo hace fundido negro → amarillo alineado con el vídeo.</sub></p>

<p align="center">
  <img src="docs/img/readme/intro-mid.png" alt="Fotograma del león geométrico en la intro" width="720"/>
</p>

---

## Capturas

<p align="center">
  <img src="docs/img/readme/panel-desktop.png" alt="Panel multinorma en escritorio" width="880"/>
</p>

<p align="center"><sub>Escritorio — panel multinorma, marca Lion y acento amarillo.</sub></p>

<p align="center">
  <img src="docs/img/readme/panel-mobile.png" alt="Panel multinorma en móvil (390px)" width="390"/>
</p>

<p align="center"><sub>Móvil (~390 px) — barra inferior, menú hamburguesa y panel adaptado.</sub></p>

---

## Quién hace qué

Trabajo en paralelo, sin pisar la misma zona del código. Referencia de reparto:

| Persona | GitHub | Encargo |
|--------|--------|---------|
| **Yoandy Ramirez Delgado** | [`heindall92`](https://github.com/heindall92) | **Diseño, UX/UI y marca Lion** — tipografía y materiales, acento amarillo, logo/favicon, intro, responsive móvil (390 px), shell lateral, iconografía Lucide, alineación visual con Rosetta. También **catálogo / sincronización** derivada de Rosetta Multinorma cuando toque actualizar mapeos. |
| **Himardlg** | [`Himardlg`](https://github.com/Himardlg) | **Funcionalidades GRC y producto** — empresas/proyectos, motor de cobertura y madurez, SoA, riesgos, evidencias, auditorías, planes de acción, export/import y respaldos, buscador, informes y nuevas capacidades de negocio. |

### En esta rama (`rama_heindall92`)

Aportación de **Yoandy / heindall92** para revisión (sin tocar `main` hasta el merge):

- Marca **Nexus GRC Lion** (logo, favicon, intro)
- Acento amarillo de producto (sustituye el verde de marca)
- Intro con fundido negro→amarillo en móvil
- Ajustes de UI móvil y shell
- README con vídeo, capturas y roles

### Origen del motor / catálogo

El catálogo unificado y las correspondencias iniciales se basan parcialmente en [Rosetta Multinorma](https://github.com/heindall92/rosetta_multinorma) (**GPL-2.0**, heindall92). Ver `LICENSE` y `NOTICE.md`.

---

> **Estado:** versión candidata para pruebas. No es una plataforma certificadora ni un dictamen jurídico. Valida el catálogo y cada correspondencia contra la fuente oficial vigente.

## Inicio rápido

- **Sin instalación:** abre `index.html` con un navegador moderno (mejor servirla en local: `npx serve`).
- **Versión autocontenida:** abre `dist/nexus.html`.
- **Pruebas:** `npm test` (requiere Node.js).
- **Rebuild autocontenido:** `npm run build`.

## Funcionalidades

- Empresas y proyectos separados en el mismo navegador
- Selección de marcos y evaluación de requisitos/controles
- Niveles orientativos de madurez
- Panel multinorma, comparador, matriz de correspondencias y CSV
- Riesgos, evidencias, auditorías y acciones
- Exportación/importación y respaldo completo
- Tema claro/oscuro e interfaz ES/EN (chrome del menú)

## Privacidad y límites

- Sin cuenta ni servidor: datos en `localStorage`
- Sin sincronización entre dispositivos
- Exporta respaldos de forma periódica; no guardes secretos ni datos personales innecesarios en la app
- La app no cifra el almacenamiento local por sí misma

## Marcos referenciados

- ISO/IEC 27001:2022 — [ISO](https://www.iso.org/standard/27001)
- ISO/IEC 42001:2023 — [ISO](https://www.iso.org/standard/42001)
- ENS, RD 311/2022 — [BOE](https://www.boe.es/eli/es/rd/2022/05/03/311)
- NIS2, (UE) 2022/2555 — [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2022/2555/oj?locale=es)
- DORA, (UE) 2022/2554 — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2022/2554/oj?locale=es)

## Licencia

GNU GPL v2 — ver `LICENSE`. Historial en [CHANGELOG.md](CHANGELOG.md).
