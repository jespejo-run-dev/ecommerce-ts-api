# Documentación de la API

## API de Categorías
```http
GET http://localhost:3000/api/categories
GET http://localhost:3000/api/categories/{categoryId}
POST http://localhost:3000/api/categories
{
    "name": "Nombre de la Categoría",
    "description": "Descripción de la Categoría"
}
PATCH http://localhost:3000/api/categories/{categoryId}
{
    "name": "Nombre Actualizado",
    "description": "Descripción Actualizada"
}
DELETE http://localhost:3000/api/categories/{categoryId}
```

## API de Productos
```http
GET http://localhost:3000/api/products
GET http://localhost:3000/api/products/{productId}
POST http://localhost:3000/api/products
{
    "name": "Nombre del Producto",
    "description": "Descripción del Producto",
    "price": 29.99,
    "sku": "PROD-001",
    "slug": "nombre-del-producto",
    "status": "activo",
    "innerQuantity": 12,
    "categoryId": "uuid-categoria",
    "brandId": "uuid-marca"
}
PATCH http://localhost:3000/api/products/{productId}
DELETE http://localhost:3000/api/products/{productId}
GET http://localhost:3000/api/products/category/{categoryId}
```

## API de Variantes de Productos
```http
GET http://localhost:3000/api/products/{productId}/variants
POST http://localhost:3000/api/products/{productId}/variants
{
    "sku": "PROD-VAR-001",
    "stock": 24,
    "attributes": {
        "color": "Rojo",
        "size": "L"
    },
    "price": 29.99
}
PATCH http://localhost:3000/api/products/{productId}/variants/{variantId}
DELETE http://localhost:3000/api/products/{productId}/variants/{variantId}
```

## API de Marcas
```http
GET http://localhost:3000/api/brands
GET http://localhost:3000/api/brands/{brandId}
POST http://localhost:3000/api/brands
{
    "name": "Nombre de la Marca",
    "description": "Descripción de la Marca"
}
PATCH http://localhost:3000/api/brands/{brandId}
DELETE http://localhost:3000/api/brands/{brandId}
```

## API de Autenticación
```http
POST http://localhost:3000/api/auth/register
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "name": "Nombre del Usuario"
}

POST http://localhost:3000/api/auth/login
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

## API del Carrito
```http
GET http://localhost:3000/api/cart
POST http://localhost:3000/api/cart/items
{
    "productId": "uuid-producto",
    "quantity": 1,
    "variantId": "uuid-variante" // opcional
}
DELETE http://localhost:3000/api/cart/items/{itemId}
PATCH http://localhost:3000/api/cart/items/{itemId}
{
    "quantity": 2
}
```

## API de Direcciones
```http
GET http://localhost:3000/api/addresses
GET http://localhost:3000/api/addresses/{addressId}
POST http://localhost:3000/api/addresses
{
    "street": "123 Calle Principal",
    "city": "Nombre de la Ciudad",
    "state": "Nombre del Estado",
    "country": "Nombre del País",
    "zipCode": "12345",
    "isDefault": true
}
PATCH http://localhost:3000/api/addresses/{addressId}
DELETE http://localhost:3000/api/addresses/{addressId}
```

## Autenticación
La mayoría de los endpoints (excepto login y registro) requieren un encabezado de autorización:
```http
Authorization: Bearer {jwt_token}
```

## Códigos de Respuesta
- 200 : Éxito
- 201 : Creado exitosamente
- 204 : Eliminado exitosamente
- 400 : Solicitud incorrecta
- 401 : No autorizado
- 403 : Prohibido
- 404 : Recurso no encontrado
- 500 : Error del servidor

