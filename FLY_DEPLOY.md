# 🚀 Guía de Deploy en Fly.io

## 📋 Prerrequisitos

1. **Instalar Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login en Fly.io:**
   ```bash
   fly auth login
   ```

## 🎯 Deploy Rápido

1. **Inicializar la app (solo la primera vez):**
   ```bash
   cd LaPremier_Server
   fly launch
   ```
   - Cuando pregunte si quieres usar un Dockerfile existente: **Sí**
   - Cuando pregunte el nombre de la app: `lapremier-server` (o el que prefieras)
   - Cuando pregunte la región: Elige la más cercana (por ejemplo: `mad` para Madrid)

2. **Configurar variables de entorno:**
   ```bash
   fly secrets set MONGODB_URI="tu-connection-string"
   fly secrets set JWT_SECRET="tu-secret-key-super-segura"
   fly secrets set GEMINI_API_KEY="tu-gemini-key"  # Opcional
   fly secrets set TMDB_API_KEY="tu-tmdb-key"      # Opcional
   fly secrets set CORS_ORIGIN="https://tu-frontend.com"  # Opcional
   ```

3. **Desplegar:**
   ```bash
   fly deploy
   ```

4. **Ver logs:**
   ```bash
   fly logs
   ```

5. **Verificar que funciona:**
   ```bash
   fly open /health
   ```

## ⚙️ Configuración Actual

- **Puerto:** 8080 (configurado en fly.toml)
- **Health Check:** `/health` (verifica cada 30s)
- **Auto Sleep:** ✅ Activado (se apaga cuando no hay tráfico)
- **Auto Start:** ✅ Activado (se despierta con la primera petición)
- **Recursos:** 256MB RAM, 1 CPU compartido (gratis)

## 🔄 Comandos Útiles

```bash
# Ver estado de la app
fly status

# Ver logs en tiempo real
fly logs

# Escalar recursos (si necesitas más)
fly scale vm shared-cpu-1x --memory 512  # Esto puede costar dinero

# Abrir la app en el navegador
fly open

# SSH a la máquina
fly ssh console

# Ver todas las apps
fly apps list
```

## 💰 Plan Gratuito

- ✅ App se apaga automáticamente cuando no hay tráfico
- ✅ Se despierta automáticamente (cold start ~2-5 segundos)
- ✅ 3 VMs compartidas gratis
- ✅ 160GB de ancho de banda/mes
- ⚠️ Si excedes los recursos gratuitos, puede haber costos

## 🐛 Troubleshooting

### Build falla por Puppeteer
- El Dockerfile ya está optimizado para usar Chromium del sistema
- Si falla, verifica que las dependencias del sistema se instalen correctamente

### La app no responde
- Verifica que `/health` responda: `fly open /health`
- Revisa logs: `fly logs`
- Verifica variables de entorno: `fly secrets list`

### Cold start lento
- Normal en plan gratis (2-5 segundos)
- La primera petición después de dormir tarda más
- Considera un ping periódico si necesitas que siempre esté activa

### Error de memoria
- Si necesitas más memoria, puedes escalar: `fly scale vm shared-cpu-1x --memory 512`
- Esto puede incurrir en costos si excedes el plan gratuito

