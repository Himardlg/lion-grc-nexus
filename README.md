# 🦁 Lion GRC Nexus

**Herramienta local-first de gestión de cumplimiento multinorma (GRC)**

Lion GRC Nexus permite a organizaciones evaluar, planificar y hacer seguimiento
de su postura de cumplimiento frente a las principales normativas de seguridad,
todo desde el navegador, sin servidor y sin enviar datos a ningún sitio.

---

## ¿Qué hace?

- Gestiona múltiples empresas/proyectos de forma independiente
- Evalúa controles de seguridad con niveles de madurez (0–5)
- Calcula automáticamente la cobertura de cada normativa
- Identifica gaps y genera planes de acción priorizados
- Declara aplicabilidad (SoA) por norma
- Exporta a Excel e informe imprimible
- Funciona 100% en el navegador — los datos nunca salen del dispositivo

## Normativas incluidas

| Norma | Requisitos |
|---|---|
| ENS · RD 311/2022 | 77 |
| ISO/IEC 27001:2022 | 118 |
| NIS2 · Directiva 2022/2555 | 59 |
| ISO/IEC 42001:2023 | 65 |

115 controles unificados · 549 correspondencias ponderadas

---

## Cómo usarlo

Abre `dist/nexus.html` en cualquier navegador moderno. No requiere instalación
ni conexión a internet.

---

## Basado en Rosetta Multinorma

El catálogo de controles, requisitos y correspondencias ponderadas que alimenta
el motor de Nexus está construido sobre **Rosetta Multinorma**, desarrollado por
[heindall92](https://github.com/heindall92).

Rosetta es el proyecto de referencia que resuelve el problema de mapear
requisitos entre normas de forma rigurosa y trazable. Sin ese trabajo,
Nexus no tendría la base de datos de calidad que tiene.

- 🔗 Repositorio Rosetta: https://github.com/heindall92/rosetta_multinorma
- 🌐 Demo Rosetta: https://heindall92.github.io/rosetta_multinorma/

---

## Desarrollo

Este proyecto se desarrolla en colaboración con el autor de Rosetta Multinorma.

```
nexus/
├── app/          # Lógica principal (app.js, panel.js, catalog.js)
├── assets/       # Estilos (app.css)
├── dist/         # Build listo para usar (nexus.html)
├── tests/        # Tests del motor (26 tests)
├── tools/        # Build, validación y auditoría de contraste
└── docs/         # Documentación técnica
```

### Ejecutar tests

```bash
node --test tests/engine.test.js
```

### Construir

```bash
node tools/build.js
```

---

## Licencia

GNU General Public License v2.0 — ver [LICENSE](LICENSE)

El catálogo está derivado de Rosetta Multinorma (GPL v2).
Ver [NOTICE.md](NOTICE.md) para atribución completa.
