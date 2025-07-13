# =================================
# DOCKERFILE ULTRA-SIMPLE PARA COOLIFY
# Template HTML Est?tico
# =================================

FROM node:18-alpine

# Informaci?n del maintainer
LABEL maintainer="xuli70"
LABEL description="Aplicaci?n de prueba para verificar que todo funciona"
LABEL version="1.0.0"

# Establecer directorio de trabajo
WORKDIR /app

# Instalar Caddy (servidor web optimizado para Coolify)
RUN apk add --no-cache caddy

# Copiar todos los archivos de la aplicaci?n
COPY . .

# Crear Caddyfile optimizado para Coolify
RUN echo -e ":${PORT:-8080} {\n\
    # Directorio ra?z\n\
    root * /app\n\
    \n\
    # Servidor de archivos est?ticos\n\
    file_server\n\
    \n\
    # SPA fallback (redirige todo a index.html)\n\
    try_files {path} /index.html\n\
    \n\
    # Compresi?n autom?tica\n\
    encode gzip\n\
    \n\
    # Headers de seguridad\n\
    header / {\n\
        # Prevenir clickjacking\n\
        X-Frame-Options \"DENY\"\n\
        \n\
        # Prevenir MIME sniffing\n\
        X-Content-Type-Options \"nosniff\"\n\
        \n\
        # Protecci?n XSS\n\
        X-XSS-Protection \"1; mode=block\"\n\
        \n\
        # Pol?tica de referrer\n\
        Referrer-Policy \"strict-origin-when-cross-origin\"\n\
        \n\
        # Content Security Policy b?sica\n\
        Content-Security-Policy \"default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; font-src 'self' https: data:; img-src 'self' https: data: blob:;\"\n\
    }\n\
    \n\
    # Cache para assets est?ticos\n\
    header /assets/* {\n\
        Cache-Control \"public, max-age=31536000, immutable\"\n\
    }\n\
    \n\
    # Cache para CSS y JS\n\
    header *.css {\n\
        Cache-Control \"public, max-age=86400\"\n\
    }\n\
    \n\
    header *.js {\n\
        Cache-Control \"public, max-age=86400\"\n\
    }\n\
    \n\
    # Cache para im?genes\n\
    header *.{png,jpg,jpeg,gif,ico,svg,webp} {\n\
        Cache-Control \"public, max-age=604800\"\n\
    }\n\
    \n\
    # Headers CORS para desarrollo (opcional)\n\
    header / {\n\
        Access-Control-Allow-Origin \"*\"\n\
        Access-Control-Allow-Methods \"GET, POST, OPTIONS\"\n\
        Access-Control-Allow-Headers \"Content-Type\"\n\
    }\n\
    \n\
    # Log de acceso (opcional, para debugging)\n\
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
# NOTAS DE DEPLOYMENT:
# 
# 1. Este Dockerfile est? optimizado para Coolify
# 2. Puerto 8080 es OBLIGATORIO para Coolify
# 3. Caddy maneja HTTPS autom?ticamente en Coolify
# 4. Health check incluido para monitoring
# 5. Headers de seguridad configurados
# 6. Compresi?n gzip autom?tica
# 7. Cache optimizado para performance
# 
# Para usar en Coolify:
# - Build Pack: Dockerfile
# - Port: 8080 (autom?tico)
# - Health Check: / (autom?tico)
# =================================