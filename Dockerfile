# =================================
# DOCKERFILE ULTRA-SIMPLE PARA COOLIFY
# Template HTML Est?tico - SIMPLIFICADO
# =================================

FROM node:18-alpine

# Informaci?n del maintainer
LABEL maintainer="xuli70"
LABEL description="Aplicaci?n de prueba para verificar que todo funciona"
LABEL version="1.0.2"

# Establecer directorio de trabajo
WORKDIR /app

# Instalar Caddy (servidor web optimizado para Coolify)
RUN apk add --no-cache caddy

# Copiar todos los archivos de la aplicaci?n
COPY . .

# Crear Caddyfile ULTRA-SIMPLE para Coolify (SIN HEADERS COMPLEJOS)
RUN echo -e ":${PORT:-8080} {\n\
    root * /app\n\
    file_server\n\
    try_files {path} /index.html\n\
    encode gzip\n\
    log {\n\
        output stdout\n\
        format console\n\
    }\n\
}" > /app/Caddyfile

# Exponer puerto 8080 (REQUERIDO por Coolify)
EXPOSE 8080

# Health check para Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Comando de inicio
CMD ["caddy", "run", "--config", "/app/Caddyfile", "--adapter", "caddyfile"]

# =================================
# CHANGELOG:
# v1.0.2 - SIMPLIFICADO: Eliminados TODOS los headers complejos
# - Solo configuraci?n b?sica: root, file_server, try_files, gzip, log
# - Sin headers de seguridad (Coolify los maneja)
# - Sin cache headers (innecesarios para prueba)
# - M?xima compatibilidad con Caddy
# =================================