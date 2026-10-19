# Contribuir a Lion GRC Nexus

¡Gracias por tu interés en mejorar el proyecto! Este documento explica cómo
colaborar de forma ordenada.

## Antes de empezar

- Abre una **issue** describiendo qué quieres cambiar y por qué, antes de
  ponerte a programar. Así evitamos trabajo duplicado.
- Para cambios del catálogo, coordina con
  [heindall92](https://github.com/heindall92) (autor de Rosetta Multinorma),
  ya que el catálogo deriva de su proyecto.

## Tipos de contribución

### Cambios del catálogo (`app/catalog.js`)
- Aporta la fuente oficial, la versión y la justificación de cada correspondencia.
- Marca claramente si la equivalencia es total (peso 1.0), parcial (0.5) o
  informativa (0).
- Mantén estos cambios separados de los cambios de interfaz en commits distintos.
- Idealmente, sincroniza con el `data/` de Rosetta en lugar de editar
  `catalog.js` directamente.

### Cambios de interfaz (`app/app.js`, `app/panel.js`, `assets/app.css`)
- Mantén el foco de la herramienta: gestión GRC, no presentación ni marketing.
- Respeta el contraste WCAG AA en ambos temas (claro y oscuro).
- Ejecuta `node tools/contrast.py` para verificar accesibilidad visual.

### Tests (`tests/engine.test.js`)
- Añade un test por cada comportamiento nuevo del motor.
- Los tests deben pasar con `node --test tests/engine.test.js` sin modificar
  nada más.

## Flujo de trabajo

1. Crea una rama desde `main` con nombre descriptivo:
   `feature/import-soa-excel` o `fix/ens-dimension-calc`
2. Haz commits pequeños y descriptivos.
3. Ejecuta los tests y el build antes de abrir un PR:
   ```bash
   node --test tests/engine.test.js
   node tools/build.js
   ```
4. Abre un **Pull Request** hacia `main` describiendo qué cambia y por qué.
5. Actualiza `CHANGELOG.md` con la entrada correspondiente.

## Lo que no aceptamos

- Telemetría, llamadas externas o dependencias de ejecución no documentadas.
- Datos reales de clientes en issues, PRs o commits.
- Cambios que eliminen la atribución a Rosetta Multinorma o la licencia GPL v2.
- Funcionalidades que requieran servidor o account externo (el modelo local-first
  es una decisión de diseño, no una limitación técnica).

## Licencia

Al contribuir aceptas que tu código se distribuya bajo GNU GPL v2.0,
la misma licencia del proyecto.
