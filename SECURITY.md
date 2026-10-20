# Seguridad y tratamiento de datos

## Modelo de seguridad

GRC Nexus es una aplicación estática local. No tiene autenticación de servidor, cifrado propio, control de acceso multiusuario, sincronización ni repositorio documental centralizado. Cualquier persona con acceso al mismo perfil de navegador puede acceder a los datos guardados en ese perfil.

## Uso seguro

- No guardes contraseñas, tokens, claves privadas ni secretos.
- Evita almacenar documentos confidenciales completos; utiliza referencias a repositorios con control de acceso.
- Protege el equipo, el perfil del navegador y los ficheros de respaldo.
- Haz copias de seguridad periódicas y verifica que puedes restaurarlas.
- Revisa cualquier archivo JSON importado antes de restaurarlo.

## Reporte de incidencias

Antes de una publicación pública, configura un canal de contacto de seguridad en el repositorio. No incluyas datos de clientes, secretos ni información sensible en incidencias públicas.
