# GRC Nexus 1.19.1

**Herramienta local de apoyo al trabajo GRC**: evaluación multinorma, madurez, riesgos, evidencias, auditorías, correspondencias requisito–control y planes de acción.

> **Estado del producto:** versión candidata para publicación y pruebas de usuario. No es una plataforma certificadora ni un dictamen jurídico. Antes de usarla en un cliente, valida el catálogo y cada correspondencia contra la fuente oficial vigente y el alcance concreto.

## Inicio rápido

- **Sin instalación:** abre `index.html` con un navegador moderno.
- **Versión autocontenida:** abre `dist/nexus.html`.
- **Pruebas automatizadas:** requiere Node.js y ejecuta `npm test`.
- **Reconstruir el HTML autocontenido:** `npm run build`.

## Funcionalidades

- Empresas y proyectos separados en el mismo navegador.
- Selección de marcos y evaluación de requisitos/controles.
- Seis niveles orientativos de madurez, con criterios descriptivos.
- Panel multinorma, comparador, matriz de correspondencias revisable y exportación CSV.
- Riesgos, evidencias, auditorías y acciones correctivas.
- Exportación/importación por empresa y respaldo completo de todos los proyectos.
- Temas claro/oscuro y ajustes de experiencia.
- Validación y normalización de datos importados; neutralización de HTML en vistas y fórmulas CSV.

## Privacidad y límites operativos

- La aplicación no requiere cuenta ni servidor: los datos de trabajo se almacenan en `localStorage` del navegador.
- No hay sincronización entre usuarios o dispositivos. Los datos pueden perderse si se borra el almacenamiento del navegador o se cambia de perfil/dispositivo.
- Exporta periódicamente un respaldo completo y guárdalo en una ubicación segura. El archivo puede contener información sensible de la organización.
- No adjuntes contraseñas, secretos, datos personales innecesarios ni evidencias confidenciales; registra referencias a un repositorio controlado cuando sea posible.
- La aplicación no cifra por sí misma el almacenamiento local ni los archivos de respaldo. Protege el equipo y el respaldo con los controles adecuados.

## Método y cautelas de cumplimiento

Las correspondencias entre controles unificados y requisitos normativos son una ayuda de análisis. Un control común puede cubrir solo parte de un requisito; una puntuación o estado de control no demuestra automáticamente conformidad, certificación ni cumplimiento legal. Revisa especialmente los requisitos con plazos, destinatarios, excepciones, roles o evidencias específicas.

Las recomendaciones de aplicabilidad son orientativas y no sustituyen la determinación jurídica del alcance. Los textos y referencias de las normas deben verificarse frente a sus fuentes oficiales y versiones vigentes. Los textos íntegros de normas protegidas no se reproducen en el catálogo.

## Marcos referenciados

- ISO/IEC 27001:2022 — [fuente oficial ISO](https://www.iso.org/standard/27001)
- ISO/IEC 42001:2023 — [fuente oficial ISO](https://www.iso.org/standard/42001)
- Esquema Nacional de Seguridad, Real Decreto 311/2022 — [BOE](https://www.boe.es/eli/es/rd/2022/05/03/311)
- Directiva NIS2, (UE) 2022/2555 — [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2022/2555/oj?locale=es)
- DORA, Reglamento (UE) 2022/2554 — [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2022/2554/oj?locale=es)

## Pruebas y calidad

`npm test` ejecuta pruebas del motor y comprobaciones estructurales de catálogo, vistas, importaciones, madurez, exportación y casos sin empresas. Estas comprobaciones no sustituyen una prueba manual de navegador, accesibilidad con tecnología asistiva ni revisión independiente del contenido normativo.

Antes de anunciar una versión estable, prueba al menos: crear/editar/eliminar empresa; evaluar requisitos; guardar y reabrir; exportar/importar empresa; exportar/restaurar respaldo completo; probar una importación inválida; navegar con teclado; revisar en Chrome y Edge; verificar impresión e informes; y comprobar que no se envían datos a terceros.

## Licencia y atribución

Este proyecto incorpora y adapta partes del catálogo multinorma de [Rosetta Multinorma](https://github.com/heindall92/rosetta_multinorma), cuyo repositorio declara **GNU GPL v2.0**. Se incluye la licencia GPL-2.0 y una nota de atribución. La distribución de esta versión derivada debe respetar las condiciones de la licencia; conserva el código fuente y los avisos correspondientes.

Los nombres y textos de las normas pertenecen a sus respectivos titulares. GRC Nexus no está afiliado ni respaldado por ISO, CCN, la Comisión Europea ni otros organismos referenciados.

## Historial

Consulta [CHANGELOG.md](CHANGELOG.md). Resumen de la 1.19.1: detalle de requisito completo (todas las capacidades, equivalencias y nivel ENS), escapado sistemático de textos y corrección de la pantalla inicial configurable.
