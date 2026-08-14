# SIPTEC - Sistema de Préstamos e Inventario de Área Técnica (Frontend)

Frontend moderno en **HTML5, CSS3 y JavaScript Vanilla**, diseñado según las especificaciones de Figma y preparado para conectarse directamente a la API de **Java Spring Boot / Oracle**.

## 🚀 Inicio Rápido (Sin Node.js ni pnpm)

Este frontend no requiere dependencias ni gestores de paquetes como npm o pnpm:

1. **Abrir directamente en el navegador**:
   - Abre `index.html` para la pantalla de inicio de sesión.
   - O abre directamente cualquier archivo dentro de `pages/` (ej. `pages/dashboard.html`, `pages/inventory.html`, `pages/loans.html`, etc.) para ver el diseño completo de cada pantalla.

2. **Iniciar Sesión**:
   - **Con API Java encendida**: Ingresa con tus credenciales de base de datos.
   - **Sin API Java (Modo Maquetado)**: Haz clic en el botón **"Entrar en Modo Maquetado (Sin API)"** o usa las credenciales de demostración (`admin@correo.com` / `admin123`).

## 📁 Arquitectura del Frontend

El proyecto está organizado en 3 capas principales:

- `pages/`: Archivos HTML5 completos y autónomos con toda la estructura visual, tablas maquetadas y modales embebidos.
- `controllers/`: Lógica de interacción con la UI (eventos de clic, apertura de modales, filtros de búsqueda, selector de temas claro/oscuro).
- `services/`: Cliente HTTP (`api.service.js`) y servicios REST por módulo (`auth`, `inventory`, `loans`, `returns`, `users`, `reports`, `history`), equipados con fallback automático a `mock.data.js` cuando el backend esté fuera de línea.

## ⚙️ Configuración de la API Java

Por defecto, la API se busca en:
```txt
http://localhost:8080
```

Puedes cambiar la URL en `config.js` o directamente desde la pantalla de **Configuración** (`pages/settings.html`), donde también podrás probar la conexión en tiempo real.

## 🎨 Temas Visuales
- Soporte para **Modo Claro** y **Modo Oscuro**, intercambiable desde la pantalla de Configuración.
- Tipografía moderna **IBM Plex Sans** e iconos **Bootstrap Icons**.
