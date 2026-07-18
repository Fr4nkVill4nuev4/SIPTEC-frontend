--------------------------------------------------
-- 1. LIMPIEZA INICIAL
--------------------------------------------------
begin
   execute immediate 'DROP TABLE AUTH_SESSION CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE RETURNS CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE REPORTES CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE HISTORIAL CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE DETALLE_PRESTAMO CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE PRESTAMO CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE INVENTARIO CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE MATERIAL CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE CATEGORIA_MATERIAL CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE AREA_MATERIAL CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE ESTADO_PRESTAMO CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE ROL_PERMISO CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE PERMISO CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE USUARIOS CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE INSTITUCIONES CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP TABLE ROLES CASCADE CONSTRAINTS';
exception
   when others then
      null;
end;
/

begin
   execute immediate 'DROP SEQUENCE SEC_AUTH_SESSION';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_RETURNS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_REPORTES';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_HISTORIAL';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_ROLES';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_USUARIOS';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_PERMISO';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_CATEGORIA';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_AREA';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_MATERIAL';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_INVENTARIO';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_ESTADO_PRESTAMO';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_PRESTAMO';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_DETALLE';
exception
   when others then
      null;
end;
/
begin
   execute immediate 'DROP SEQUENCE SEC_INSTITUCIONES';
exception
   when others then
      null;
end;
/

--------------------------------------------------
-- 2. SECUENCIAS
--------------------------------------------------
create sequence sec_roles start with 1 increment by 1;
create sequence sec_usuarios start with 1 increment by 1;
create sequence sec_permiso start with 1 increment by 1;
create sequence sec_categoria start with 1 increment by 1;
create sequence sec_area start with 1 increment by 1;
create sequence sec_material start with 1 increment by 1;
create sequence sec_inventario start with 1 increment by 1;
create sequence sec_estado_prestamo start with 1 increment by 1;
create sequence sec_prestamo start with 1 increment by 1;
create sequence sec_detalle start with 1 increment by 1;
create sequence sec_instituciones start with 1 increment by 1;
create sequence sec_historial start with 1 increment by 1;
create sequence sec_reportes start with 1 increment by 1;
create sequence sec_auth_session start with 1 increment by 1;
create sequence sec_returns start with 1 increment by 1;

--------------------------------------------------
-- 3. FUNCION HASH
--------------------------------------------------
create or replace function hash_password (
   p_password varchar2
) return varchar2 is
   v_hash varchar2(64);
begin
   select lower(standard_hash(
      p_password,
      'SHA256'
   ))
     into v_hash
     from dual;
   return v_hash;
end;
/

--------------------------------------------------
-- 4. TABLAS
--------------------------------------------------
create table roles (
   idrol     number primary key,
   nombrerol varchar2(20) unique not null
);

create table instituciones (
   idinstitucion     number primary key,
   nombreinstitucion varchar2(20) unique not null
);

create table usuarios (
   idusuario       number primary key,
   nombreusuario   varchar2(30) not null,
   apellidousuario varchar2(30) not null,
   correousuario   varchar2(60) unique not null,
   password_hash   varchar2(255) not null,
   idrol           number not null,
   idinstitucion   number not null,
   activo          number(1) default 1 not null,
   creadoen        varchar2(40) default to_char(
      systimestamp,
      'YYYY-MM-DD"T"HH24:MI:SS'
   ),
   constraint fk_usuario_rol foreign key ( idrol )
      references roles ( idrol ),
   constraint fk_usuario_institucion foreign key ( idinstitucion )
      references instituciones ( idinstitucion )
);

create table permiso (
   idpermiso     number primary key,
   nombrepermiso varchar2(50) unique not null
);

create table rol_permiso (
   idrol     number not null,
   idpermiso number not null,
   constraint pk_rol_permiso primary key ( idrol,
                                           idpermiso ),
   constraint fk_rp_rol foreign key ( idrol )
      references roles ( idrol ),
   constraint fk_rp_permiso foreign key ( idpermiso )
      references permiso ( idpermiso )
);

create table categoria_material (
   idcategoria     number primary key,
   nombrecategoria varchar2(50) unique not null
);

create table area_material (
   idarea     number primary key,
   nombrearea varchar2(50) unique not null
);

create table material (
   idmaterial          number primary key,
   nombrematerial      varchar2(50) not null,
   descripcionmaterial clob,
   idcategoria         number,
   idarea              number,
   constraint fk_categoria foreign key ( idcategoria )
      references categoria_material ( idcategoria ),
   constraint fk_area foreign key ( idarea )
      references area_material ( idarea )
);

create table inventario (
   idinventario      number primary key,
   idmaterial        number not null,
   codigoinventario  varchar2(30) unique,
   estado            varchar2(20) default 'Disponible',
   fecha_adquisicion varchar2(20),
   constraint fk_material_inv foreign key ( idmaterial )
      references material ( idmaterial )
);

create table estado_prestamo (
   idestado     number primary key,
   nombreestado varchar2(20) unique not null
);

create table prestamo (
   idprestamo  number primary key,
   idusuario   number,
   fechainicio varchar2(20) not null,
   fechafin    varchar2(20) not null,
   estado      number,
   creadoen    varchar2(40) default to_char(
      systimestamp,
      'YYYY-MM-DD"T"HH24:MI:SS'
   ),
   constraint fk_prestamo_usuario foreign key ( idusuario )
      references usuarios ( idusuario ),
   constraint fk_prestamo_estado foreign key ( estado )
      references estado_prestamo ( idestado )
);

create table detalle_prestamo (
   iddetalle    number primary key,
   idprestamo   number,
   idinventario number,
   cantidad     number default 1 check ( cantidad > 0 ),
   constraint fk_detalle_prestamo foreign key ( idprestamo )
      references prestamo ( idprestamo ),
   constraint fk_detalle_inventario foreign key ( idinventario )
      references inventario ( idinventario )
);

create table historial (
   idhistorial      number primary key,
   idinventario     number,
   idusuario        number,
   codigoinventario varchar2(30),
   nombrematerial   varchar2(80),
   fechainicio      varchar2(20),
   fechafin         varchar2(20),
   nombreusuario    varchar2(80),
   estado           varchar2(20),
   creadoen         varchar2(40) default to_char(
      systimestamp,
      'YYYY-MM-DD"T"HH24:MI:SS'
   )
);

create table reportes (
   idreporte   number primary key,
   tiporeporte varchar2(40) not null,
   titulo      varchar2(120) not null,
   descripcion varchar2(500) not null,
   contenido   clob,
   generadopor number,
   estado      varchar2(20) default 'Generado' not null,
   creadoen    varchar2(40) default to_char(
      systimestamp,
      'YYYY-MM-DD"T"HH24:MI:SS'
   ),
   constraint fk_reporte_usuario foreign key ( generadopor )
      references usuarios ( idusuario )
);

create table auth_session (
   idsession number primary key,
   token     varchar2(128) unique not null,
   userid    number not null,
   expiresat number not null,
   constraint fk_session_usuario foreign key ( userid )
      references usuarios ( idusuario )
);

create table returns (
   id              number primary key,
   prestamoid      number,
   fechadevolucion varchar2(20),
   observacion     varchar2(500)
);

--------------------------------------------------
-- 5. DATOS INICIALES
--------------------------------------------------
insert into roles values
   ( sec_roles.nextval,
     'ADMINISTRADOR' );
insert into roles values
   ( sec_roles.nextval,
     'EMPLEADO' );
insert into roles values
   ( sec_roles.nextval,
     'IT' );

insert into instituciones values
   ( sec_instituciones.nextval,
     'ITR' );
insert into instituciones values
   ( sec_instituciones.nextval,
     'CFP' );

insert into permiso values
   ( sec_permiso.nextval,
     'crear_usuario' );
insert into permiso values
   ( sec_permiso.nextval,
     'editar_usuario' );
insert into permiso values
   ( sec_permiso.nextval,
     'eliminar_usuario' );
insert into permiso values
   ( sec_permiso.nextval,
     'ver_inventario' );
insert into permiso values
   ( sec_permiso.nextval,
     'agregar_equipo' );
insert into permiso values
   ( sec_permiso.nextval,
     'editar_equipo' );
insert into permiso values
   ( sec_permiso.nextval,
     'actualizar_estado_equipo' );
insert into permiso values
   ( sec_permiso.nextval,
     'solicitar_prestamo' );
insert into permiso values
   ( sec_permiso.nextval,
     'aprobar_prestamo' );
insert into permiso values
   ( sec_permiso.nextval,
     'rechazar_prestamo' );
insert into permiso values
   ( sec_permiso.nextval,
     'reportar_danio' );
insert into permiso values
   ( sec_permiso.nextval,
     'subir_imagen_reporte' );

insert into rol_permiso
   select r.idrol,
          p.idpermiso
     from roles r,
          permiso p
    where r.nombrerol = 'ADMINISTRADOR';

insert into rol_permiso
   select r.idrol,
          p.idpermiso
     from roles r,
          permiso p
    where r.nombrerol = 'EMPLEADO'
      and p.nombrepermiso in ( 'ver_inventario',
                               'solicitar_prestamo',
                               'reportar_danio',
                               'subir_imagen_reporte' );

insert into rol_permiso
   select r.idrol,
          p.idpermiso
     from roles r,
          permiso p
    where r.nombrerol = 'IT'
      and p.nombrepermiso in ( 'ver_inventario',
                               'agregar_equipo',
                               'editar_equipo',
                               'actualizar_estado_equipo',
                               'reportar_danio' );

insert into categoria_material values
   ( sec_categoria.nextval,
     'Electronico' );
insert into categoria_material values
   ( sec_categoria.nextval,
     'Mecanico' );
insert into categoria_material values
   ( sec_categoria.nextval,
     'Material de apoyo' );
insert into categoria_material values
   ( sec_categoria.nextval,
     'Equipo tecnico' );
insert into categoria_material values
   ( sec_categoria.nextval,
     'Equipo de medicion' );

insert into area_material values
   ( sec_area.nextval,
     'Laboratorio' );
insert into area_material values
   ( sec_area.nextval,
     'Area Tecnica' );
insert into area_material values
   ( sec_area.nextval,
     'Bodega A' );
insert into area_material values
   ( sec_area.nextval,
     'Bodega B' );
insert into area_material values
   ( sec_area.nextval,
     'Taller' );
insert into area_material values
   ( sec_area.nextval,
     'Gabinete' );
insert into area_material values
   ( sec_area.nextval,
     'Audiovisuales' );
insert into area_material values
   ( sec_area.nextval,
     'Bodega tecnica' );

insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'PENDIENTE' );
insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'APROBADO' );
insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'RECHAZADO' );
insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'ENTREGADO' );
insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'DEVUELTO' );
insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'REVISION' );
insert into estado_prestamo values
   ( sec_estado_prestamo.nextval,
     'RETRASADO' );

insert into usuarios values
   ( sec_usuarios.nextval,
     'Admin',
     'Principal',
     'admin@correo.com',
     hash_password('admin123'),
     (
        select idrol
          from roles
         where nombrerol = 'ADMINISTRADOR'
     ),
     (
        select idinstitucion
          from instituciones
         where nombreinstitucion = 'ITR'
     ),
     1,
     to_char(
        systimestamp,
        'YYYY-MM-DD"T"HH24:MI:SS'
     ) );

insert into usuarios values
   ( sec_usuarios.nextval,
     'Marco',
     'Perez',
     'marco@siptec.edu',
     hash_password('empleado123'),
     (
        select idrol
          from roles
         where nombrerol = 'EMPLEADO'
     ),
     (
        select idinstitucion
          from instituciones
         where nombreinstitucion = 'ITR'
     ),
     1,
     to_char(
        systimestamp,
        'YYYY-MM-DD"T"HH24:MI:SS'
     ) );

insert into usuarios values
   ( sec_usuarios.nextval,
     'Soporte',
     'IT',
     'it@siptec.edu',
     hash_password('it123'),
     (
        select idrol
          from roles
         where nombrerol = 'IT'
     ),
     (
        select idinstitucion
          from instituciones
         where nombreinstitucion = 'CFP'
     ),
     1,
     to_char(
        systimestamp,
        'YYYY-MM-DD"T"HH24:MI:SS'
     ) );

insert into material values
   ( sec_material.nextval,
     'Cautin',
     '',
     3,
     8 );
insert into inventario values
   ( sec_inventario.nextval,
     sec_material.currval,
     'CAA-120',
     'Disponible',
     '2026-05-12' );
insert into material values
   ( sec_material.nextval,
     'Martillo',
     '',
     2,
     5 );
insert into inventario values
   ( sec_inventario.nextval,
     sec_material.currval,
     'MRT-009',
     'Disponible',
     '2026-05-18' );
insert into material values
   ( sec_material.nextval,
     'Multimetro',
     '',
     5,
     1 );
insert into inventario values
   ( sec_inventario.nextval,
     sec_material.currval,
     'MUL-010',
     'Disponible',
     '2026-06-01' );
insert into material values
   ( sec_material.nextval,
     'Soldadora',
     '',
     4,
     2 );
insert into inventario values
   ( sec_inventario.nextval,
     sec_material.currval,
     'SOL-001',
     'Prestado',
     '2026-04-20' );
insert into material values
   ( sec_material.nextval,
     'Equipo de sonido',
     '',
     1,
     7 );
insert into inventario values
   ( sec_inventario.nextval,
     sec_material.currval,
     'EQP-065',
     'Disponible',
     '2026-03-30' );

insert into reportes values
   ( sec_reportes.nextval,
     'General',
     'Herramientas mas usadas',
     'Reporte resumido para seguimiento de inventario.',
     'Herramientas mas usadas'
     || chr(10)
     || chr(10)
     || 'Cautin, multimetro y martillo registran alta rotacion.',
     1,
     'Generado',
     to_char(
        systimestamp,
        'YYYY-MM-DD"T"HH24:MI:SS'
     ) );

--------------------------------------------------
-- 6. TRIGGER DE FECHAS
--------------------------------------------------
create or replace trigger trg_prestamo_fechas before
   insert or update on prestamo
   for each row
declare
   v_inicio date;
   v_fin    date;
begin
   v_inicio := to_date ( :new.fechainicio,
   'YYYY-MM-DD' );
   v_fin := to_date ( :new.fechafin,
   'YYYY-MM-DD' );
   if v_fin <= v_inicio then
      raise_application_error(
         -20001,
         'Fecha invalida'
      );
   end if;
   if v_fin > add_months(
      v_inicio,
      1
   ) then
      raise_application_error(
         -20002,
         'Maximo 1 mes'
      );
   end if;
end;
/

commit;