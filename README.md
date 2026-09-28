# ColdWheels

<p align="center">
  <img
    src="frontend/public/img/footer/volkswagen-fox-mk1-footer.png"
    alt="ColdWheels"
    width="100%"
  />
</p>

ColdWheels es una tienda web de vehículos a escala 1:64 orientada a coleccionistas y aficionados al mundo del automóvil.

El proyecto combina una experiencia de compra sencilla con una identidad visual inspirada en la cultura automovilística, el racing urbano y la estética de los garajes de principios de los años 2000.

ColdWheels ha sido desarrollado como proyecto final del programa Full Stack Developer de 4Geeks Academy.

## ¿Qué puedes hacer?

Como usuario puedes:

- Explorar el catálogo de vehículos.
- Filtrar los productos por categoría.
- Consultar el detalle de cada vehículo.
- Añadir productos al carrito y modificar sus cantidades.
- Registrarte e iniciar sesión.
- Realizar compras como invitado o como usuario registrado.
- Consultar tus pedidos si tienes una cuenta.
- Cambiar tu email o contraseña.
- Consultar los productos disponibles y su stock.
- Trabajar con precios en EUR y USD.

## Tecnologías

### Frontend

- React
- Vite
- React Router
- Bootstrap
- CSS

### Backend

- Python
- Flask
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Migrate
- SQLite

### Testing y calidad

- Pytest
- ESLint
- Prettier

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/Doomiish/ColdWheels-TFG.git
cd ColdWheels-TFG
```

### 2. Preparar el backend

Desde la carpeta `backend`:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Configurar la variable necesaria para ejecutar Flask:

```powershell
$env:JWT_SECRET_KEY="coldwheels-dev-secret"
$env:FLASK_APP="app:create_app"
```

### 3. Cargar los productos iniciales

Con el entorno virtual del backend activo:

```powershell
python seed_products.py
```

Esto carga los 20 productos iniciales del catálogo en la base de datos SQLite.

### 4. Ejecutar el backend

```powershell
flask run
```

El backend quedará disponible en:

```
http://127.0.0.1:5000
```

### 5. Preparar y ejecutar el frontend

En una nueva terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite mostrará la dirección local del frontend, normalmente:

```
http://localhost:5173
```

### Ejecución habitual

Una vez realizada la instalación inicial, para volver a ejecutar el proyecto solamente es necesario:

**Backend**

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:JWT_SECRET_KEY="coldwheels-dev-secret"
$env:FLASK_APP="app:create_app"
flask run
```

**Frontend**

```powershell
cd frontend
npm run dev
```

## Tests y validación

Para ejecutar los tests del backend:

```powershell
cd backend
pytest
```

Para comprobar el frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Estado de la última validación:

- 47 tests de backend superados.
- ESLint sin errores.
- Build de producción completado correctamente.

## Documentación

La documentación técnica de la arquitectura del proyecto se encuentra en:

`docs/ARCHITECTURE.md`

Este documento describe la estructura de la aplicación, el flujo de datos, las principales decisiones arquitectónicas y las reglas de negocio relevantes.

## Estado del proyecto

ColdWheels es el proyecto final desarrollado para el programa Full Stack Developer de 4Geeks Academy.

La implementación incluye el catálogo, autenticación, carrito, checkout, gestión de stock, pedidos y la interfaz completa de usuario.

## Autor

Agustín Mendez (https://github.com/Doomiish)
