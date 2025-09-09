# 🔐 Configuración de Secrets

## ⚠️ IMPORTANTE: Seguridad
**NUNCA** subas archivos `.env` o valores reales de credenciales al repositorio.

## 📋 Secrets Requeridos

### Para GitHub Actions:
Ve a: `https://github.com/evelynruch/dex/settings/secrets/actions`

Agrega estos secrets:
- `LOGIN_USERNAME` - Usuario para login
- `LOGIN_PASSWORD` - Contraseña para login  
- `BASE_URL` - URL base del sitio a testear

### Para desarrollo local:

1. **Copia el archivo de ejemplo:**
   ```bash
   cp env.example .env
   ```

2. **Edita `.env` con tus valores reales:**
   ```bash
   LOGIN_USERNAME=tu_usuario_real
   LOGIN_PASSWORD=tu_contraseña_real
   BASE_URL=https://tu-sitio-real.com
   ```

3. **Verifica la configuración:**
   ```bash
   npm run check-secrets
   ```

## 🧪 Comandos de Testing

```bash
# Verificar secrets (sin mostrar valores)
npm run check-secrets

# Ejecutar tests con verificación de secrets
npm run test:with-check

# Ejecutar tests normalmente
npm test
```

## 🚨 Reglas de Seguridad

1. ✅ **SÍ hacer:**
   - Usar variables de entorno
   - Configurar secrets en GitHub
   - Usar archivos `.env` localmente
   - Verificar configuración antes de tests

2. ❌ **NO hacer:**
   - Subir archivos `.env` al repositorio
   - Hardcodear credenciales en el código
   - Mostrar valores reales en logs
   - Compartir secrets por chat/email

## 🔍 Verificación

El script `check-secrets.js` verifica que todos los secrets estén configurados sin exponer los valores reales.
