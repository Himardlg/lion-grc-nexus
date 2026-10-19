# Lista de comprobación para publicar Lion GRC Nexus

Ejecuta esta lista antes de cada release y marca cada punto.

## 🔧 Funcionalidad básica

- [ ] Crear, editar y eliminar empresa de prueba
- [ ] Wizard de creación completo (5 pasos)
- [ ] Evaluar controles y verificar que la cobertura se calcula correctamente
- [ ] Crear acciones, evidencias, riesgos y auditorías
- [ ] Exportar e importar empresa — comprobar que no se mezclan datos
- [ ] Exportar respaldo completo, restaurarlo y verificar todas las empresas
- [ ] Probar restauración con fichero corrupto y con fichero >10 MB
- [ ] Comprobar empresa de demo (datos precargados y cobertura > 0)

## 📤 Exportaciones

- [ ] Exportar Excel (4 hojas: Resumen, Requisitos, Capacidades, Plan de acción)
- [ ] Exportar informe imprimible (sin errores de consola)
- [ ] Exportar CSV desde panel

## ✅ Calidad

- [ ] `node --test tests/engine.test.js` — todos los tests en verde
- [ ] `node tools/build.js` — build sin errores, tamaño razonable (<300 KB)
- [ ] `node tools/check.js` — validación de catálogo sin errores
- [ ] Consola del navegador sin errores en las pantallas principales
- [ ] Probar en Chrome y Edge escritorio
- [ ] Comprobar una vista en móvil (responsive)

## ♿ Accesibilidad

- [ ] Navegación completa con teclado (Tab, Enter, Esc)
- [ ] Foco visible en todos los elementos interactivos
- [ ] Zoom al 200% sin pérdida de contenido
- [ ] Sin fallos WCAG AA en tema claro ni oscuro

## 📋 Normativa y atribución

- [ ] Versión actualizada en `package.json`, `CHANGELOG.md` y UI (`app.js`)
- [ ] `CHANGELOG.md` con todas las entradas de la versión
- [ ] `NOTICE.md` con atribución correcta a Rosetta Multinorma / heindall92
- [ ] Licencia GPL v2 conservada en todos los ficheros fuente
- [ ] No se presentan métricas como certificación ni dictamen jurídico

## 🚀 Publicación

- [ ] Tag de git con el número de versión (`v1.x.x`)
- [ ] `dist/nexus.html` generado y probado como fichero standalone
- [ ] Código fuente disponible (obligación GPL v2)
