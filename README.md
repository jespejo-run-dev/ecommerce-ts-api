# E-commerce API

API REST para un sistema de e-commerce desarrollada con Node.js, TypeScript, Express y TypeORM.

## Características

- Autenticación de usuarios (registro y login)
- Gestión de productos con sistema de inners
- Gestión de categorías
- Gestión de marcas
- Roles de usuario (admin y cliente)
- Validaciones de datos
- Manejo de errores
- Base de datos PostgreSQL

## Requisitos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd ecommerce
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env en la raíz del proyecto:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=ecommerce
JWT_SECRET=tu_secreto_jwt
```

4. Iniciar la aplicación:
```bash
npm run dev
```

## Endpoints

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "nickname": "usuario1",
    "businessName": "Mi Empresa",
    "rut": "12345678-9",
    "phone": "+56912345678",
    "businessType": "retail"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "123456"
}
```

#### Cambio de Contraseña
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
    "currentPassword": "123456",
    "newPassword": "nueva123"
}
```

### Productos

#### Crear Producto
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Producto Ejemplo",
    "description": "Descripción del producto",
    "price": 1000,
    "stock": 100,
    "sku": "SKU123",
    "slug": "producto-ejemplo",
    "status": "active",
    "innerQuantity": 10,
    "categoryId": "id-categoria",
    "brandId": "id-marca",
    "image": "url-imagen"
}
```

### Categorías

#### Crear Categoría
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Categoría Ejemplo",
    "description": "Descripción de la categoría",
    "slug": "categoria-ejemplo",
    "parentId": "id-categoria-padre"
}
```

### Marcas

#### Crear Marca
```http
POST /api/brands
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Marca Ejemplo",
    "description": "Descripción de la marca",
    "slug": "marca-ejemplo",
    "logo": "url-logo"
}
```

## Estructura del Proyecto

```
src/
├── application/
│   ├── services/
│   └── useCases/
├── domain/
│   ├── entities/
│   └── repositories/
├── infrastructure/
│   ├── controllers/
│   ├── middleware/
│   ├── persistence/
│   │   ├── entities/
│   │   └── repositories/
│   └── routes/
└── index.ts
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta las pruebas

## Tecnologías Utilizadas

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT para autenticación
- bcrypt para encriptación de contraseñas


## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 