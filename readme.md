# SIPTEC

Sistema web para control de inventario, prestamos, devoluciones y reportes de herramientas del area tecnica.

SIPTEC esta construido con HTML, CSS, Bootstrap, JavaScript vanilla y un backend en Java Spring Boot con Maven. La base de datos se trabaja con Oracle SQL Developer.

## Tabla de contenido

- [Descripcion](#descripcion)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalacion](#instalacion)
- [Ejecucion](#ejecucion)
- [Credenciales demo](#credenciales-demo)
- [Roles y permisos](#roles-y-permisos)
- [Base de datos](#base-de-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API principal](#api-principal)
- [Exportaciones](#exportaciones)
- [Solucion de problemas](#solucion-de-problemas)

## Descripcion

SIPTEC permite administrar herramientas y equipos de una institucion tecnica. Su objetivo es reemplazar controles manuales por un sistema con trazabilidad, roles de usuario y reportes exportables.

Funciones principales:

- Inicio de sesion con roles.
- Registro y edicion de usuarios.
- Control de inventario.
- Solicitud de prestamos.
- Aprobacion o rechazo de prestamos por administrador.
- Registro de devoluciones.
- Reporte de danos.
- Reportes exportables.
- Historial de movimientos.
- Restricciones de acceso por rol.

## Tecnologias

- HTML5
- CSS3
- Bootstrap 5
- Bootstrap Icons
- JavaScript vanilla
- Java 17
- Spring Boot
- Maven
- Oracle Database
- Oracle SQL Developer

## Requisitos

- Java JDK 17 o superior
- Maven o Maven Wrapper
- IntelliJ IDEA
- Oracle SQL Developer
- Conexion a Oracle Database configurada

## Instalacion

Clona o abre el proyecto en tu equipo:

```bash
cd SIPTEC
```

Sincroniza las dependencias Maven desde IntelliJ IDEA:

- Abre el proyecto desde la carpeta donde esta el `pom.xml`.
- Click derecho sobre `pom.xml`.
- Selecciona `Add as Maven Project` si IntelliJ no lo detecta.
- En la ventana Maven, presiona `Reload All Maven Projects`.

O desde terminal:

```bash
mvn clean install
```

## Ejecucion

Modo desarrollo con Maven:

```bash
mvn spring-boot:run
```

Si usas Maven Wrapper:

```bash
./mvnw spring-boot:run
```

Por defecto el sistema intenta iniciar en:

```txt
Frontend:
http://localhost:4174/index.html

Backend Java:
http://localhost:8080
```

Si el puerto `4174` esta ocupado, el servidor intenta usar el siguiente puerto disponible, por ejemplo `4175`.

## Credenciales demo

| Rol | Correo | Contrasena |
| --- | --- | --- |
| Administrador | `admin@correo.com` | `admin123` |
| Empleado | `marco@siptec.edu` | `empleado123` |
| IT | `it@siptec.edu` | `it123` |

## Roles y permisos

### Administrador

Puede:

- Ver panel de control.
- Crear y editar usuarios.
- Administrar inventario.
- Ver prestamos.
- Aprobar y rechazar prestamos.
- Registrar devoluciones.
- Ver historial.
- Ver y exportar reportes.
- Cambiar configuracion visual.

### Empleado

Puede:

- Ver inventario disponible.
- Solicitar prestamos.
- Ver sus propios prestamos.
- Ver sus propias devoluciones pendientes.
- Reportar danos de sus propios prestamos.
- Ver sus propios reportes.

No puede:

- Ver datos de otros empleados.
- Ver datos del administrador.
- Aprobar o rechazar prestamos.
- Administrar inventario.
- Administrar usuarios.

### IT

Puede:

- Ver y administrar inventario.
- Ver reportes.
- Acceder a configuracion y cerrar sesion.

No puede:

- Ver prestamos.
- Ver devoluciones.
- Ver historial.
- Aprobar prestamos.
- Rechazar prestamos.
- Ver usuarios.
- Ver el panel de control si contiene datos operativos.

Estas restricciones se aplican en frontend y backend. Aunque un usuario intente llamar la API manualmente, el servidor devuelve `403` cuando el rol no tiene permiso.

## Base de datos

La base de datos se administra con Oracle SQL Developer y Oracle Database.

La conexion debe configurarse desde:

```txt
src/main/resources/application.properties
```

El esquema base esta documentado en:

```txt
SIPTEC v2.0.sql
```

El archivo SQL usa sintaxis Oracle, por ejemplo:

- `CREATE SEQUENCE`
- `VARCHAR2`
- `NUMBER`
- `CREATE OR REPLACE TRIGGER`
- `STANDARD_HASH`

Tablas principales:

- `roles`
- `instituciones`
- `usuarios`
- `permiso`
- `rol_permiso`
- `categoria_material`
- `area_material`
- `material`
- `inventario`
- `estado_prestamo`
- `prestamo`
- `detalle_prestamo`
- `historial`
- `reportes`

Notas:

- `prestamo` y `detalle_prestamo` siguen el modelo de SIPTEC v2.0.
- `reportes` e `historial` se agregan para cubrir funciones de la plataforma.
- `usuarios.activo` permite activar o desactivar cuentas.
- El limite de prestamo de maximo 1 mes se valida desde el servicio.

## Estructura del proyecto

```txt
SIPTEC/
|-- index.html
|-- styles.css
|-- server.js
|-- package.json
|-- pnpm-lock.yaml
|-- readme.md
|-- ESTRUCTURA.md
|-- SIPTEC v2.0.sql
|-- images/
|-- pages/
|   |-- dashboard.html
|   |-- inventory.html
|   |-- loans.html
|   |-- returns.html
|   |-- users.html
|   |-- reports.html
|   |-- history.html
|   `-- settings.html
```

Documentacion detallada de estructura:

```txt
ESTRUCTURA.md
```

## Arquitectura

### Frontend

Archivos principales:

- `index.html`: estructura principal, login, sidebar, topbar y modales.
- `src/main.js`: arranque de la aplicacion y eventos globales.
- `src/api/`: consumo de API Java.
- `src/views/`: render de cada vista.
- `src/utils/`: plantillas, exportaciones, tema y utilidades.
- `styles.css`: estilos generales, modo oscuro, skeleton loading e IBM Plex Sans.
- `pages/`: vistas parciales cargadas dinamicamente.

### Backend

El backend se desarrolla con Java Spring Boot y Maven.

Capas principales:

- `Controller`: expone endpoints HTTP.
- `Service`: contiene la logica de negocio.
- `Repository`: acceso a datos.
- `Entity`: mapeo de tablas de Oracle.
- `DTO`: datos de entrada y salida.
- `Response`: respuestas especificas por modulo.

## API principal

Todas las rutas protegidas requieren token Bearer:

```txt
Authorization: Bearer <token>
```

### Autenticacion

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| POST | `/api/auth/login` | Inicia sesion. |
| POST | `/api/auth/logout` | Cierra sesion. |
| GET | `/api/auth/me` | Obtiene usuario actual. |

### Usuarios

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/users` | Lista usuarios. Empleado solo recibe su usuario. |
| POST | `/api/users` | Crea usuario. Solo administrador. |
| PATCH | `/api/users/:id` | Edita usuario. Solo administrador. |
| PATCH | `/api/users/:id/toggle` | Activa/desactiva usuario. Solo administrador. |

### Inventario

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/inventory` | Lista inventario. Empleado solo ve disponibles. |
| POST | `/api/inventory` | Crea herramienta. Administrador e IT. |
| PATCH | `/api/inventory/:id` | Edita herramienta. Administrador e IT. |
| PATCH | `/api/inventory/:id/status` | Cambia estado. Administrador e IT. |
| DELETE | `/api/inventory/:id` | Elimina herramienta. Administrador e IT. |

### Prestamos

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/loans` | Lista prestamos. No permitido para IT. |
| POST | `/api/loans` | Crea solicitud de prestamo. |
| PATCH | `/api/loans/:id` | Aprueba o rechaza. Solo administrador. |

### Devoluciones

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/returns` | Lista devoluciones. No permitido para IT. |
| PATCH | `/api/returns/:id` | Registra devolucion o dano. No permitido para IT. |

### Reportes

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/reports` | Lista reportes segun rol. |
| POST | `/api/reports` | Crea reporte. |
| DELETE | `/api/reports/:id` | Elimina reporte permitido. |

### Historial

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/history` | Lista historial. No permitido para IT. |

## Exportaciones

Reportes e historial pueden exportarse como:

- TXT
- PDF
- CSV
- Excel

El PDF se abre como vista imprimible del navegador. Desde ahi se puede elegir `Guardar como PDF`.

## Skeleton loading

La aplicacion muestra un esqueleto de carga mientras cambia de pagina o espera datos. Esto mejora la experiencia cuando la API tarda en responder.

## Fuente

La interfaz usa:

```txt
IBM Plex Sans
```

Se carga desde Google Fonts en `index.html` y se aplica globalmente desde `styles.css`.

## Solucion de problemas

### El puerto esta ocupado

Si ves algo como:

```txt
EADDRINUSE: address already in use :::4174
```

Puedes:

- Cerrar la terminal anterior donde corria el servidor.
- Revisar procesos activos de Node.

En Windows PowerShell:

```powershell
Get-Process node
```

Para detener procesos Node si estas seguro:

```powershell
Get-Process node | Stop-Process
```

### No se actualiza la UI

Si el navegador sigue mostrando una version vieja:

- Presiona `Ctrl + F5`.
- Cierra sesion e inicia sesion de nuevo.
- Verifica que `index.html` cargue los archivos de `src/`:

```html
<script src="src/main.js"></script>
```

### Error de permisos

Si recibes `403`, el rol no tiene permiso para esa accion. Ejemplo:

- IT no puede ver prestamos, devoluciones ni historial.
- IT no puede aprobar ni rechazar prestamos.
- Empleado no puede ver datos de otros usuarios.

### Base de datos

Si necesitas reiniciar o modificar la base, usa Oracle SQL Developer y ejecuta los scripts necesarios sobre tu esquema Oracle.

Revisa la conexion en:

```txt
src/main/resources/application.properties
```

## Comandos utiles

Compilar backend:

```bash
mvn compile
```

Ejecutar backend:

```bash
mvn spring-boot:run
```

## Estado actual

El proyecto cuenta con:

- UI funcional con Bootstrap.
- Backend modular con Java Spring Boot Maven.
- Base de datos Oracle administrada con Oracle SQL Developer.
- Roles y permisos por backend y frontend.
- Exportacion de reportes e historial.
- Skeleton loading.
- Fuente IBM Plex Sans.
