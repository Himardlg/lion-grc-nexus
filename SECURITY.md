# Seguridad y tratamiento de datos — Lion GRC Nexus

## Modelo de seguridad

Lion GRC Nexus es una aplicación estática que corre completamente en el
navegador. No tiene servidor, autenticación, cifrado propio, control de acceso
multiusuario ni sincronización en la nube.

**Los datos se almacenan únicamente en `localStorage` del navegador del usuario.**
No se envía ningún dato a servidores externos. No hay telemetría ni analítica.

## Limitaciones que debes conocer

- Cualquier persona con acceso al mismo perfil de navegador puede ver y
  modificar los datos guardados.
- `localStorage` no está cifrado. No almacenes contraseñas, tokens, claves
  privadas ni secretos.
- Evita guardar documentos confidenciales completos; usa referencias a
  repositorios con control de acceso propio.
- Los ficheros de respaldo (JSON) contienen todos los datos en texto plano.
  Guárdalos en una ubicación segura.

## Uso seguro recomendado

- Protege el equipo y el perfil del navegador con contraseña.
- Haz copias de seguridad periódicas desde la pantalla de Configuración.
- Verifica que puedes restaurar el respaldo antes de necesitarlo.
- Revisa cualquier archivo JSON importado antes de restaurarlo — no importes
  ficheros de fuentes no confiables.
- En entornos corporativos, considera usar un perfil de navegador dedicado.

## Reporte de vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, abre una issue **privada** en
el repositorio (GitHub permite marcarlas como confidenciales) o contacta
directamente con los mantenedores antes de hacer cualquier divulgación pública.

No incluyas datos de clientes, secretos ni información sensible en issues
públicas.

## Alcance

Esta política aplica al código de Lion GRC Nexus. Para vulnerabilidades
relacionadas con el catálogo derivado de Rosetta Multinorma, contacta también
con [heindall92](https://github.com/heindall92).
