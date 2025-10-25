SuperGame Vivid - PNG Edition (UI Moderna)
=========================================

Descripción:
- Plantilla WebGL con UI moderna y fondo 3D animado (partículas).
- Todas las texturas en formato PNG dentro de /assets.
- Menú de inicio, HUD y pantalla final con opciones para reiniciar o compartir.
- Código optimizado y verificado para evitar errores de carga.

Cómo probar:
1. Descomprime y abre un servidor local desde la carpeta del proyecto:
   - `python -m http.server 8000`
   - o `npx http-server`
2. Visita http://localhost:8000
3. Rellena tu nombre y presiona Iniciar. Haz click en el terreno para mover al jugador y recolectar 5 cristales.

Notas:
- Para producción, empaqueta con Vite y hospeda assets localmente. CDN usado para módulos Three.js (unpkg).
- Si quieres que genere un build Vite + package.json, dímelo y lo agrego.
