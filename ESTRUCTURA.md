# Estructura del Proyecto SIPTEC Frontend

SIPTEC Frontend es una aplicación web pura (**HTML5, CSS3 y JavaScript Vanilla**), sin dependencias de Node.js ni pnpm.

Se puede abrir directamente haciendo doble clic en cualquiera de sus archivos `.html` o mediante cualquier servidor estático (Live Server, Apache, Nginx o directamente desde el navegador).

```txt
SIPTEC-frontend/
├── index.html                  # Pantalla de Login / Acceso principal (100% Maquetada)
├── config.js                   # Configuración global (URL API Java http://localhost:8080)
├── pages/                      # Páginas HTML completas e independientes
│   ├── dashboard.html          # Panel de control (Métricas, Gráficos CSS y Actividad)
│   ├── inventory.html          # Inventario (Tabla completa + Modales Agregar/Editar/Eliminar)
│   ├── loans.html              # Préstamos (Pestañas ITR/CFP + Panel de Aprobación/Rechazo)
│   ├── returns.html            # Devoluciones (Tarjetas de entrega + Modales de Daño/Devolver)
│   ├── users.html              # Gestión de usuarios (Tabla + Modales de creación/edición)
│   ├── reports.html            # Reportes técnicos (Visor modal + Exportaciones TXT/PDF/CSV/Excel)
│   ├── history.html            # Historial consolidado (Auditoría + Exportaciones)
│   └── settings.html           # Configuración (Tema claro/oscuro, Perfil y Test de API)
├── controllers/                # Controladores de UI y eventos
│   ├── auth.controller.js      # Manejo del formulario de login y acceso demo
│   ├── layout.controller.js    # Barra lateral, topbar, fecha, tema, badge de conexión
│   ├── dashboard.controller.js # Sincronización de métricas en dashboard
│   ├── inventory.controller.js # Búsquedas, filtros y modales de inventario
│   ├── loans.controller.js     # Solicitudes y flujo de aprobación de préstamos
│   ├── returns.controller.js   # Procesar devoluciones y reportes de daños
│   ├── users.controller.js     # Gestión de usuarios y roles
│   ├── reports.controller.js   # Pestañas de reportes, visor modal y descargas
│   ├── history.controller.js   # Historial y exportaciones
│   └── settings.controller.js  # Ajustes de perfil, tema y URL del backend Java
├── services/                   # Capa de consumo de API Java Spring Boot
│   ├── api.service.js          # Cliente HTTP con detección de disponibilidad y fallback mock
│   ├── auth.service.js         # Endpoint /api/auth/login
│   ├── inventory.service.js    # Endpoints /api/inventory (CRUD)
│   ├── loans.service.js        # Endpoints /api/loans (Solicitudes y Estados)
│   ├── returns.service.js      # Endpoints /api/returns (Devoluciones e Incidentes)
│   ├── users.service.js        # Endpoints /api/users (Usuarios y Roles)
│   ├── reports.service.js      # Endpoints /api/reports (Reportes)
│   ├── history.service.js      # Endpoints /api/history (Historial)
│   └── mock.data.js            # Datos simulados de respaldo para Modo Maquetado (Offline)
├── css/
│   └── styles.css              # Hoja de estilos con diseño fiel a Figma (Light & Dark theme)
├── images/                     # Logotipo oficial y recursos gráficos
│   └── logo.svg
└── SIPTEC v2.0.sql             # Script SQL de la base de datos Oracle
```

## Características Principales

1. **Diseño 100% visible en el HTML**:
   - Cada archivo `.html` dentro de `pages/` es un documento completo que contiene todo su diseño visual, barras laterales, tarjetas, tablas maquetadas con datos de muestra y modales listos en el código HTML.
   - No se crean estructuras vacías desde JavaScript.

2. **Modo Maquetado (Fallback Offline)**:
   - Si la API Java en `http://localhost:8080` o la base de datos Oracle no están activas, el frontend lo detecta automáticamente y permite entrar y navegar libremente por todas las pantallas en **Modo Maquetado**, mostrando una insignia `[Modo Maquetado (Offline)]`.
   - Las acciones de prueba (agregar equipos, solicitar préstamos, reportar daños) se guardan localmente para demostraciones fluidas.

3. **Integración Directa con Backend Java**:
   - Al encender la API Java Spring Boot, el frontend se conecta automáticamente consumiendo los endpoints REST configurados en `config.js` y `services/`.
