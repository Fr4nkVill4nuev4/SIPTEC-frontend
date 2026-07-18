# Estructura de archivos de SIPTEC

SIPTEC queda dividido en dos partes:

- Frontend HTML/CSS/JS vanilla en `D:\Escritorio\SIPTEC`.
- Backend Java Spring Boot Maven en `C:\Users\frank\IdeaProjects\SPITEC\SPITEC`.

El backend Java es el unico que maneja API, sesiones, permisos y base de datos.

```txt
SIPTEC/
|-- index.html
|-- styles.css
|-- server.js
|-- package.json
|-- readme.md
|-- ESTRUCTURA.md
|-- SIPTEC v2.0.sql
|-- images/
`-- pages/
```

## Frontend

### `server.js`
Servidor estatico opcional para abrir el frontend:

```bash
node server.js
```

No contiene rutas API ni logica de base de datos.

### `src/main.js`
Arranca la aplicacion y registra eventos globales.

### `src/`
Controla el navegador con funciones separadas al estilo del repo de tareas:

- lee formularios
- valida datos
- consume el backend Java con `fetch`
- actualiza tablas y vistas
- muestra mensajes

La API base es:

```txt
http://localhost:8080
```

## Backend Java

El backend Spring Boot conserva la estructura por modulo:

```txt
SPITEC/
`-- src/main/java/SPITEC/
    |-- Auth/
    |-- Usuarios/
    |-- Inventario/
    |-- Prestamo/
    |-- Returns/
    |-- Reportes/
    |-- Historial/
    |-- Roles/
    |-- Permiso/
    |-- Instituciones/
    |-- Materiales/
    |-- CategoriaMaterial/
    |-- AreaMaterial/
    |-- EstadoPrestamo/
    `-- DetallePrestamo/
```

Cada modulo mantiene el patron:

- `Controller`
- `Service`
- `Repository`
- `Entity`
- `DTO`

## Base de datos

La unica base usada es Oracle con el script:

```txt
D:\Escritorio\SIPTEC\SIPTEC v2.0.sql
C:\Users\frank\IdeaProjects\SPITEC\SPITEC\src\main\resources\siptec-oracle.sql
```

No se usa SQLite ni H2.
