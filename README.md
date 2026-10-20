# Nexus GRC Lion

<p align="center">
  <img src="assets/lion-mark.png" alt="Nexus GRC Lion" width="120"/>
</p>

<p align="center">
  <b>Herramienta local de apoyo GRC multinorma</b><br/>
  Implanta un control una vez y comprueba qué cubre en cada norma: ENS, ISO/IEC 27001, NIS2, ISO/IEC 42001 y DORA.<br/>
  Corre en el navegador · los datos no salen del dispositivo.
</p>

<p align="center">
  <a href="LICENSE"><img alt="Licencia GPLv2" src="https://img.shields.io/badge/LICENCIA-GPLv2-4169A1?style=flat"/></a>
  <img alt="ENS RD 311/2022" src="https://img.shields.io/badge/ENS-RD%20311%2F2022-1d1d1f?style=flat"/>
  <img alt="ISO/IEC 27001:2022" src="https://img.shields.io/badge/ISO%2FIEC-27001%3A2022-1d1d1f?style=flat"/>
  <img alt="NIS2" src="https://img.shields.io/badge/NIS2-2022%2F2555-1d1d1f?style=flat"/>
  <img alt="ISO/IEC 42001:2023" src="https://img.shields.io/badge/ISO%2FIEC-42001%3A2023-1d1d1f?style=flat"/>
  <img alt="DORA" src="https://img.shields.io/badge/DORA-2022%2F2554-1d1d1f?style=flat"/>
  <br/>
  <img alt="UI ES/EN" src="https://img.shields.io/badge/UI-ES%20%2F%20EN-feca06?style=flat&labelColor=1d1d1f"/>
  <img alt="Local-first" src="https://img.shields.io/badge/datos-local--first-2E8B57?style=flat"/>
  <img alt="Sin dependencias" src="https://img.shields.io/badge/dependencias-0-2E8B57?style=flat"/>
  <img alt="Iconos Lucide" src="https://img.shields.io/badge/iconos-Lucide-1d1d1f?style=flat"/>
  <img alt="Versión" src="https://img.shields.io/badge/versión-1.19.2-1d1d1f?style=flat"/>
</p>

<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/readme/panel-dark.png">
  <img src="docs/img/readme/panel-light.png" alt="Panel multinorma de Nexus GRC Lion con la empresa de ejemplo" width="100%"/>
</picture>
</p>

---

## Intro

<p align="center">
  <a href="https://github.com/Himardlg/lion-grc-nexus/blob/rama_heindall92/assets/intro.mp4">
    <img src="docs/img/readme/intro-preview.gif" alt="Intro Nexus GRC Lion — vista previa animada" width="880"/>
  </a>
</p>

<p align="center">
  <b><a href="https://github.com/Himardlg/lion-grc-nexus/raw/rama_heindall92/assets/intro.mp4">Ver o descargar el vídeo completo (MP4)</a></b><br/>
  <sub>En el repo: <code>assets/intro.mp4</code> · ~10 s · marca Lion</sub>
</p>

---

## Índice

- [Qué es](#qué-es)
- [Origen y autoría](#origen-y-autoría)
- [Características](#características)
- [Capturas](#capturas)
- [Arquitectura](#arquitectura)
- [Cómo se usa](#cómo-se-usa)
- [Desarrollo y pruebas](#desarrollo-y-pruebas)
- [Versiones](#versiones)
- [Hoja de ruta](#hoja-de-ruta)
- [Quién hace qué](#quién-hace-qué)
- [Atribución y licencia](#atribución-y-licencia)

## Qué es

Nexus GRC Lion es una aplicación web local-first para evaluar el cumplimiento de varias normas a la vez. Trabaja con **controles unificados** (capacidades): cada control se evalúa una sola vez y alimenta, con un peso, a los requisitos de todas las normas que lo usan. El catálogo de controles y correspondencias procede de [Rosetta Multinorma](https://github.com/heindall92/rosetta_multinorma).

No necesita servidor ni instalación: se abre `index.html` (o el archivo único `dist/nexus.html`) y los datos se guardan en el `localStorage` del navegador.

## Origen y autoría

Nexus GRC Lion es una herramienta derivada de [Rosetta Multinorma](https://github.com/heindall92/rosetta_multinorma), creada por Yoandy Ramírez Delgado ([heindall92](https://github.com/heindall92)). De Rosetta hereda el catálogo de controles unificados, el modelo de correspondencias multinorma y el enfoque local-first, bajo la licencia GNU GPL v2.

Nexus nace del interés de [Himardlg](https://github.com/Himardlg) en una versión propia adaptada a sus necesidades. heindall92 participa como autor de la herramienta original y como colaborador en Nexus, en diseño, catálogo y arquitectura.

Cualquier redistribución o publicación de Nexus, o de trabajos derivados, debe mantener la atribución a Rosetta Multinorma y a su autor, conforme a la GPL v2 y a [`NOTICE.md`](NOTICE.md).

| Persona | GitHub | Papel |
|---|---|---|
| Yoandy Ramírez Delgado | [`heindall92`](https://github.com/heindall92) | Autor de Rosetta (base) · diseño, catálogo y arquitectura |
| Himardlg | [`Himardlg`](https://github.com/Himardlg) | Dirección del proyecto Nexus · funcionalidades |

El detalle de las contribuciones está en [Quién hace qué](#quién-hace-qué).

## Características

| Área | Qué ofrece |
|---|---|
| **Empresas** | Varias organizaciones, contexto (sector, tamaño, categoría ENS por dimensión) y empresa de ejemplo. |
| **Normativa** | Recomendación de normas aplicables, biblioteca multinorma, equivalencias y comparador de normas. |
| **Requisitos y controles** | Universo consolidado de requisitos, declaración de aplicabilidad (SoA) y biblioteca de capacidades con madurez 0–5. |
| **Panel multinorma** | Cobertura global y por norma, madurez media, matriz capacidad × norma y acciones de mayor impacto. |
| **Gestión** | Plan de acción, evidencias, riesgos y auditorías vinculados a controles. |
| **Informes y exportación** | Informe imprimible, Excel (.xlsx sin dependencias), CSV, SoA y copias de seguridad JSON. |
| **Interfaz** | Español/inglés, claro/oscuro, densidad cómoda/estándar/compacta, buscador global (Ctrl K), menú inferior en móvil, `prefers-reduced-motion`. |

## Capturas

Datos de la empresa de ejemplo «TechServ · ejemplo» (en Riesgos, tres riesgos registrados desde el propio formulario). Escritorio a 1440×900 y móvil a 390×844, ambos a 2×.

### Inicio

<sub>Presentación, normas soportadas y acceso a la empresa de ejemplo.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/inicio-light.png" alt="Inicio · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/inicio-dark.png" alt="Inicio · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/inicio-mobile-light.png" alt="Inicio · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/inicio-mobile-dark.png" alt="móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Panel multinorma

<sub>Cobertura global, madurez media, cobertura por norma y acciones de mayor impacto.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/panel-light.png" alt="Panel multinorma · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/panel-dark.png" alt="Panel multinorma · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/panel-mobile-light.png" alt="Panel multinorma · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/panel-mobile-dark.png" alt="Panel multinorma · móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Requisitos

<sub>Universo consolidado de requisitos con estado de cobertura y explicación.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/requisitos-light.png" alt="Requisitos · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/requisitos-dark.png" alt="Requisitos · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/requisitos-mobile-light.png" alt="Requisitos · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/requisitos-mobile-dark.png" alt="Requisitos · móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Controles

<sub>Biblioteca de capacidades unificadas con madurez y requisitos que alimentan.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/controles-light.png" alt="Controles · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/controles-dark.png" alt="Controles · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/controles-mobile-light.png" alt="Controles · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/controles-mobile-dark.png" alt="Controles · móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Plan de acción

<sub>Acciones con responsable, fecha límite y estado.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/plan-light.png" alt="Plan de acción · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/plan-dark.png" alt="Plan de acción · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/plan-mobile-light.png" alt="Plan de acción · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/plan-mobile-dark.png" alt="Plan de acción · móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Riesgos

<sub>Registro de riesgos vinculados a controles, con impacto y probabilidad.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/riesgos-light.png" alt="Riesgos · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/riesgos-dark.png" alt="Riesgos · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/riesgos-mobile-light.png" alt="Riesgos · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/riesgos-mobile-dark.png" alt="móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Evidencias

<sub>Evidencias asociadas a cada capacidad.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/evidencias-light.png" alt="Evidencias · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/evidencias-dark.png" alt="Evidencias · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/evidencias-mobile-light.png" alt="Evidencias · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/evidencias-mobile-dark.png" alt="móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Informe imprimible

<sub>Informe de cumplimiento listo para imprimir o guardar en PDF.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/informe-light.png" alt="Informe imprimible · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/informe-dark.png" alt="Informe imprimible · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/informe-mobile-light.png" alt="Informe imprimible · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/informe-mobile-dark.png" alt="móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Mapa multinorma

<sub>Controles activos y requisitos que cubren en cada norma.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/mapa-light.png" alt="Mapa multinorma · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/mapa-dark.png" alt="Mapa multinorma · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/mapa-mobile-light.png" alt="Mapa multinorma · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/mapa-mobile-dark.png" alt="móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

### Ajustes

<sub>Idioma, tema, densidad, barra lateral y pantalla inicial.</sub>

<table>
<tr>
<td width="74%" valign="top"><img src="docs/img/readme/ajustes-light.png" alt="Ajustes · claro"/><br/><sub>Escritorio · claro</sub><br/><br/><img src="docs/img/readme/ajustes-dark.png" alt="Ajustes · oscuro"/><br/><sub>Escritorio · oscuro</sub></td>
<td width="26%" valign="top"><img src="docs/img/readme/ajustes-mobile-light.png" alt="Ajustes · móvil"/><br/><sub>Móvil 390 px · claro</sub><br/><br/><img src="docs/img/readme/ajustes-mobile-dark.png" alt="móvil oscuro"/><br/><sub>Móvil · oscuro</sub></td>
</tr>
</table>

## Arquitectura

Scripts clásicos sin dependencias (funcionan por `file://`). `index.html` fija el orden de carga; `tools/build.js` lo sigue para generar `dist/nexus.html`.

```mermaid
flowchart LR
  subgraph datos["Datos"]
    icons["app/icons.js<br/>Lucide"]
    catalog["app/catalog.js<br/>catálogo Rosetta"]
  end
  subgraph engine["app/engine/"]
    model["model.js<br/>normas · requisitos"]
    state["state.js<br/>localStorage"]
    scoring["scoring.js<br/>cobertura · prioridades"]
    ens["ens.js<br/>nivel ENS"]
    coherence["coherence.js<br/>migración · coherencia"]
  end
  subgraph views["app/views/"]
    shell["shell.js<br/>estructura · enrutado"]
    pages["pages.js y vistas<br/>panel · plan · informe · …"]
    bottom["bottom-menu.js"]
  end
  subgraph export["app/export/"]
    excel["excel.js"]
    backup["backup.js"]
  end
  actions["app/actions.js"]
  boot["app/boot.js"]
  catalog --> model --> scoring
  state --> scoring
  ens --> scoring
  scoring --> views
  views --> actions --> state
  scoring --> export
  boot --> shell
```

### Flujo de datos local-first

```mermaid
sequenceDiagram
  participant U as Usuario
  participant V as Vistas
  participant M as Motor
  participant L as localStorage
  U->>V: evalúa un control, marca SoA, crea una acción
  V->>M: actions.js actualiza la empresa activa
  M->>L: save()
  M->>V: render() recalcula cobertura por norma
  V-->>U: panel, requisitos e informe actualizados
  U->>V: exportar
  V-->>U: .xlsx · CSV · JSON (descarga local, sin red)
```

### Relación con Rosetta

```mermaid
flowchart LR
  R["Rosetta Multinorma<br/>src/data/catalog.json"] -->|node tools/sync-catalog.js| S{"validación<br/>y proyección"}
  S -->|ENS · ISO 27001 · NIS2 · ISO 42001| C["app/catalog.js"]
  S -.->|--check / --dry-run| CI["CI: código 1 si difiere"]
  C --> N["Nexus: motor y vistas"]
```

## Cómo se usa

1. Abre `index.html` en el navegador (o `dist/nexus.html`, un solo archivo para enviar o presentar).
2. Carga la empresa de ejemplo o crea la tuya y completa su contexto.
3. Elige las normas aplicables, evalúa la madurez de cada control y revisa el panel multinorma.
4. Gestiona el plan de acción, evidencias y riesgos, y exporta el informe o el Excel.

Los datos solo viven en el navegador: usa **Exportar copia** para guardarlos.

## Desarrollo y pruebas

Requiere Node.js 20 o superior. Sin dependencias.

```bash
npm test                       # pruebas del motor y de sync-catalog + check de 22 vistas
node tools/build.js            # genera dist/nexus.html
node tools/check.js            # valida el catálogo y renderiza todas las vistas
node tools/sync-catalog.js ../rosetta_multinorma --dry-run   # cambios del catálogo
```

La estructura de módulos y la guía de contribución están en [`CONTRIBUTING.md`](CONTRIBUTING.md); el motor se describe en [`docs/ENGINE.md`](docs/ENGINE.md).

## Versiones

| Versión | Fecha | Resumen |
|---|---|---|
| Sin publicar | octubre 2026 | Design System v2, responsive y densidad estándar, catálogo equivalente a Rosetta v2.3.0, `tools/sync-catalog.js` y modularización. |
| 1.19.2 | 13/10/2026 | Pantalla «Acerca de» con licencia y atribución, cabeceras GPL v2. |
| 1.19.1 | 09/10/2026 | Detalle de requisito rehecho y escapado sistemático de textos. |
| 1.19.0 | 09/10/2026 | Ver [`CHANGELOG.md`](CHANGELOG.md). |
| 1.18.0 | 09/10/2026 | Ver [`CHANGELOG.md`](CHANGELOG.md). |

Historial completo en [`CHANGELOG.md`](CHANGELOG.md).

## Hoja de ruta

| Bloque | Responsable | Contenido |
|---|---|---|
| **A · Diseño y catálogo** | heindall92 | Design System, responsive y densidad, catálogo Rosetta v2.3.0, sincronización automática del catálogo, modularización. |
| **B · Funcionalidades** | Himardlg | Importar SoA desde Excel, snapshots de cobertura, informe ejecutivo, casos de ejemplo por sector, buscador con filtros, alertas de acciones vencidas, enlace de solo lectura. |
| **C · Conjunto** | ambos | Pruebas E2E con Playwright y coordinación de versiones. |

## Quién hace qué

<table>
<tr>
<td align="center" width="50%"><a href="https://github.com/heindall92"><img src="https://github.com/heindall92.png?size=120" width="80" alt="heindall92"/><br/><b>Yoandy Ramírez Delgado</b></a><br/><code>heindall92</code><br/><sub>Autor de Rosetta (base) · diseño, catálogo y arquitectura.<br/>Diseño, UX/UI y marca Lion: Design System, intro, responsive, iconos Lucide. Catálogo y sincronización con Rosetta Multinorma.</sub></td>
<td align="center" width="50%"><a href="https://github.com/Himardlg"><img src="https://github.com/Himardlg.png?size=120" width="80" alt="Himardlg"/><br/><b>Himardlg</b></a><br/><code>Himardlg</code><br/><sub>Dirección del proyecto Nexus · funcionalidades.<br/>Funcionalidades GRC y producto: empresas, motor de cobertura y madurez, SoA, riesgos, evidencias, auditorías, planes, exportación, respaldos, buscador e informes.</sub></td>
</tr>
</table>

## Atribución y licencia

El catálogo unificado y las correspondencias se basan en [Rosetta Multinorma](https://github.com/heindall92/rosetta_multinorma), de Yoandy Ramírez Delgado (heindall92), publicado bajo GNU GPL v2. El catálogo actual equivale al contenido de Rosetta v2.3.0 (commit `e5e51f8`). Detalles en [`NOTICE.md`](NOTICE.md).

Nexus GRC Lion se distribuye bajo la **GNU General Public License v2**: ver [`LICENSE`](LICENSE).

> **Estado:** candidata a pruebas. No es certificadora ni dictamen jurídico. Valida las correspondencias contra la fuente oficial. No está afiliada a ISO, CCN, ENISA ni a la Comisión Europea.
