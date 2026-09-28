# ColdWheels — Architecture

## 1. Scope

Este documento describe la arquitectura y las principales decisiones técnicas de ColdWheels.

El proyecto está dividido en un frontend desarrollado con React y un backend desarrollado con Flask. El backend proporciona una API REST que gestiona autenticación, productos, checkout y pedidos.

La aplicación utiliza SQLite como base de datos local.

## 2. Architecture overview

La comunicación principal de la aplicación sigue esta estructura:

```
React
  ↓
API REST Flask
  ↓
Routes
  ↓
Services
  ↓
SQLAlchemy
  ↓
SQLite
```

Las rutas reciben las peticiones HTTP y delegan la lógica de negocio a los servicios. Los servicios trabajan con los modelos SQLAlchemy y la base de datos.

El frontend mantiene la presentación, navegación, estado de autenticación y estado del carrito.

## 3. Frontend

El frontend está desarrollado con React y Vite.

Sus principales responsabilidades son:

- Mostrar el catálogo y los detalles de los productos.
- Gestionar la navegación mediante React Router.
- Gestionar la autenticación del usuario.
- Gestionar el carrito mediante React Context.
- Mantener el carrito en `sessionStorage`.
- Realizar las peticiones a la API.
- Mostrar los estados y errores de la aplicación.
- Gestionar el flujo de checkout.

El carrito no se almacena en la base de datos. Se mantiene en la sesión del navegador y se envía al backend durante el checkout.

El token de autenticación también se mantiene en `sessionStorage`.

## 4. Backend

El backend utiliza Flask y está organizado principalmente en:

```
backend/app/
├── routes/
├── services/
├── models.py
├── serializers.py
├── errors.py
├── extensions.py
├── config.py
└── money.py
```

### Routes

Las rutas exponen la API HTTP y delegan la lógica de negocio a los servicios.

Principales grupos de endpoints:

```
/api/auth
/api/products
/api/checkout
/api/sales
```

### Services

Los servicios contienen la lógica de negocio y evitan concentrarla directamente en las rutas.

Entre ellos se encuentran los servicios relacionados con:

- autenticación
- productos
- checkout
- pedidos
- auditoría

### SQLAlchemy

SQLAlchemy se utiliza como ORM para trabajar con SQLite.

La aplicación no utiliza Repository Pattern. Los servicios trabajan directamente con los modelos SQLAlchemy.

## 5. Data model

El modelo de datos está compuesto por seis entidades principales:

```
User
Product
Sale
SaleItem
AuditInformation
AuditError
```

### User

Representa a los usuarios registrados.

Contiene:

- email
- contraseña almacenada mediante hash
- nombre
- apellido
- fecha de creación

Un usuario puede tener múltiples pedidos.

### Product

Representa los vehículos disponibles en el catálogo.

Contiene:

- marca
- modelo
- año
- imagen
- precio en EUR
- stock
- fecha de creación

Los productos no tienen variantes.

### Sale

Representa un pedido realizado mediante checkout.

Puede estar asociado a un usuario registrado o corresponder a una compra como invitado.

Contiene:

- número de pedido
- usuario, cuando corresponde
- datos del invitado, cuando corresponde
- moneda
- tipo de cambio
- subtotal
- impuestos
- total
- fecha de creación

### SaleItem

Representa cada producto incluido en un pedido.

Además de la relación con `Product`, almacena una copia de los datos comerciales utilizados en la venta, como marca, modelo, año, imagen, cantidad y precios.

Esto permite conservar la información utilizada en el pedido aunque los datos actuales del producto cambien posteriormente.

### AuditInformation

Registra operaciones relevantes realizadas correctamente.

### AuditError

Registra determinados errores producidos durante operaciones de negocio.

## 6. Authentication

La autenticación utiliza JWT mediante Flask-JWT-Extended.

El flujo general es:

```
Login
  ↓
Backend valida credenciales
  ↓
JWT
  ↓
Frontend guarda el token en sessionStorage
  ↓
Petición autenticada
  ↓
Backend valida JWT
```

Las contraseñas no se almacenan directamente. El modelo `User` utiliza hashing para almacenarlas y posteriormente comprobarlas.

La variable `JWT_SECRET_KEY` es necesaria para ejecutar el backend fuera del entorno de tests.

## 7. Checkout

ColdWheels dispone de dos endpoints de checkout:

```
POST /api/checkout/guest
POST /api/checkout/authenticated
```

El checkout de invitado requiere:

- nombre
- apellido
- dirección
- código postal

El checkout autenticado utiliza la identidad obtenida mediante JWT.

Ambos flujos utilizan la misma lógica de negocio de checkout.

El backend valida los productos y las cantidades recibidas, comprueba el stock disponible, calcula los importes y crea el pedido.

El checkout se ejecuta dentro de una transacción de base de datos para mantener la operación como una única unidad.

## 8. Cart and stock

El carrito se gestiona exclusivamente en el frontend mediante React Context y `sessionStorage`.

No existe una entidad `Cart` en la base de datos.

El frontend limita a cinco unidades la cantidad de un mismo vehículo en el carrito.

El backend vuelve a validar las cantidades y el stock durante el checkout. Esto evita confiar únicamente en las validaciones realizadas en el navegador.

Cuando una compra se completa, el stock de los productos correspondientes se reduce dentro de la misma transacción que crea el pedido.

Los productos no se eliminan cuando llegan a stock cero. Permanecen en el catálogo, pero dejan de estar disponibles para la compra.

## 9. Money and currency

El catálogo utiliza EUR como moneda base de los productos.

El checkout permite trabajar con:

```
EUR
USD
```

El tipo de cambio utilizado para USD está definido en la lógica monetaria del backend.

Los precios de los productos incluyen el IVA correspondiente al proyecto.

Durante el checkout el backend calcula los importes de subtotal, impuestos y total, evitando utilizar como fuente de verdad los totales enviados desde el frontend.

No se almacenan datos de tarjetas ni información de pago real.

El pago utilizado en el proyecto es representativo/simulado.

No se aplican gastos de envío.

## 10. Architectural decisions

### SQLite

Se utiliza SQLite porque el proyecto está planteado como una aplicación local y académica. Permite disponer de una base de datos relacional sin añadir infraestructura externa.

### Services

La lógica de negocio se mantiene en servicios separados de las rutas para evitar que los endpoints concentren responsabilidades.

### JWT

JWT permite mantener la autenticación mediante tokens sin almacenar el estado de sesión en el servidor.

### sessionStorage

El carrito y el token de autenticación utilizan `sessionStorage`, manteniendo el estado asociado a la sesión del navegador.

### Sin Repository Pattern

No se introduce una capa de repositorios porque el proyecto no necesita una abstracción adicional sobre SQLAlchemy.

### Sin entidad Cart

El carrito es un estado temporal del frontend y no necesita persistencia en la base de datos.

### Sin entidad Payment

El proyecto no almacena pagos reales ni datos de tarjetas, por lo que no existe una entidad de pago.

### Sin Admin ni Roles

El proyecto no implementa perfiles administrativos ni un sistema de roles.

### Sin ProductVariant

Cada producto representa un vehículo único del catálogo y no existen variantes.

### Catálogo cerrado

Los productos forman parte de un catálogo definido para el proyecto. No se implementa una funcionalidad administrativa para eliminar productos.

## 11. Deliberately out of scope

Para mantener el alcance del proyecto controlado, no se han implementado:

- Panel de administración.
- Roles de usuario.
- Gestión administrativa de productos.
- Variantes de productos.
- Persistencia del carrito.
- Entidad `Cart`.
- Entidad `Payment`.
- Almacenamiento de tarjetas.
- Sistema de gastos de envío.
- Repository Pattern.
- Sistema de categorías persistidas en la base de datos.
- Sistema de auditoría de modificaciones de productos.

Estas decisiones forman parte del alcance definido para el proyecto y evitan introducir complejidad que no es necesaria para su objetivo.

## 12. Project structure

La estructura general del proyecto es:

```
ColdWheels-TFG/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── errors.py
│   │   ├── extensions.py
│   │   ├── config.py
│   │   └── money.py
│   ├── tests/
│   ├── seed_products.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── ARCHITECTURE.md
│
└── README.md
```

## 13. Testing

El backend dispone de una suite de tests automatizados mediante Pytest.

La última validación realizada obtuvo:

```
47 passed
```

El frontend se valida mediante ESLint y mediante el build de producción de Vite.

Los comandos utilizados son:

```powershell
cd backend
pytest
```

```powershell
cd frontend
npm run lint
npm run build
```

Esta documentación describe la arquitectura implementada en el estado final del proyecto.