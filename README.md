# Catálogo de Productos — Semillero WPOSS

Taller 01 — Catálogo de productos con componentes.

Proyecto desarrollado como parte del Semillero WPOSS, utilizando Angular 17.

## Requisitos

- Node.js 20 LTS o superior
- Angular CLI 17
- npm
- Git

## Descripción

Este proyecto implementa un catálogo de productos utilizando componentes standalone de Angular.

La aplicación cuenta con dos vistas según el rol:

- **Customer:** muestra los productos mediante tarjetas.
- **Admin:** muestra los productos mediante una tabla.

Los productos utilizados actualmente son datos simulados.

## Conceptos implementados

1. Componentes standalone
2. `@Input({ required: true })`
3. `@Output()` y `EventEmitter`
4. Signals
5. `computed()`
6. Filtro por categoría
7. Vista Admin / Customer
8. `*ngIf`
9. `*ngFor`
10. `*ngSwitch`
11. `trackBy`
12. Comunicación entre componentes padre e hijo
13. Carrito de productos

## Instalación

Clonar el repositorio:

# Instalación

Clonar el repositorio
1. git clone URL_DEL_REPOSITORIO
2. cd catalogo-semillero
3. npm install

Ejecutar el proyecto
1. ng serve 
