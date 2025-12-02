# InaYoga Trail Running - API de E-commerce

API RESTful desarrollada con Node.js y Express para una tienda online de ropa y accesorios deportivos especializada en trail running.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación de Endpoints](#-documentación-de-endpoints)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Modelos de Datos](#-modelos-de-datos)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Arquitectura](#-arquitectura)

---

## ✨ Características

- **Gestión de Productos**: CRUD completo de productos con paginación, filtros y ordenamiento
- **Sistema de Carritos**: Creación y gestión de carritos de compra
- **Autenticación JWT**: Sistema seguro de autenticación con Passport.js
- **Autorización por Roles**: Control de acceso basado en roles (admin, user)
- **Sistema de Tickets**: Generación de tickets de compra con manejo de stock
- **Gestión de Stock**: Verificación y actualización automática de stock en compras
- **Recuperación de Contraseña**: Sistema de reset de contraseña por email
- **Upload de Imágenes**: Soporte para subir imágenes de productos (Multer)
- **Paginación Avanzada**: Sistema de paginación con links de navegación

---

## 🛠 Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: Passport.js, JWT (JSON Web Tokens)
- **Seguridad**: bcrypt para hash de contraseñas
- **Upload de Archivos**: Multer
- **Email**: Nodemailer
- **Templates**: Handlebars (para vistas)
- **WebSockets**: Socket.io (para productos en tiempo real)

---

## 📦 Requisitos

- Node.js (v18 o superior recomendado)
- MongoDB (Atlas o instancia local)
- npm o yarn

---

## 🚀 Instalación

1. **Clona el repositorio:**
   
   git clone https://github.com/pepeluquet/backend-entrega.git
   cd backend-entrega
   2. **Instala las dependencias:**
  
   npm install
   3. **Crea un archivo `.env` en la raíz del proyecto:**
   
   PORT=8080
   MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_db
   JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
   MAILING_USER=tu_email@gmail.com
   MAILING_PASS=tu_password_de_aplicacion
   NODE_ENV=development
   
4. **Inicia el servidor:**
   node index.js
      El servidor estará disponible en `http://localhost:8080`

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `PORT` | Puerto del servidor | No | 8080 |
| `MONGO_URL` | URL de conexión a MongoDB | Sí | - |
| `JWT_SECRET` | Secreto para firmar JWT | Sí | - |
| `MAILING_USER` | Email para envío de correos | No | - |
| `MAILING_PASS` | Password del email | No | - |
| `NODE_ENV` | Entorno de ejecución | No | development |

---

## 📁 Estructura del Proyecto

```
backend-entrega/
├── src/
│   ├── config/          # Configuración (DB, Passport, etc.)
│   ├── controllers/     # Controladores de rutas
│   ├── dao/             # Data Access Object (acceso a datos)
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos de Mongoose
│   ├── repositories/    # Repositorios (capa de abstracción)
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   │   └── dto/         # Data Transfer Objects
│   ├── utils/           # Utilidades (auth, uploaders)
│   ├── views/           # Templates Handlebars
│   ├── public/          # Archivos estáticos
│   └── app.js           # Configuración de Express
├── data/                # Archivos JSON (si se usa persistencia en archivo)
├── index.js             # Punto de entrada
├── package.json
└── README.md
```

---

## 📚 Documentación de Endpoints

### 🔐 Sesiones y Autenticación

#### `POST /api/sessions/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 30,
  "password": "password123"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": { ... }
}
```

---

#### `POST /api/sessions/login`
Inicia sesión y obtiene token JWT.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta (200):**
```json
{
  "status": "success",
  "message": "Sesión iniciada correctamente",
  "user": {
    "id": "...",
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user"
  }
}
```

**Nota:** El token se guarda automáticamente en una cookie `currentUser`.

---

#### `GET /api/sessions/current`
Obtiene información del usuario autenticado.

**Headers:** Cookie con token JWT

**Respuesta (200):**
```json
{
  "status": "success",
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "role": "user"
  }
}
```

---

#### `GET /api/sessions/admin`
Verifica acceso de administrador.

**Headers:** Cookie con token JWT (rol admin requerido)

**Respuesta (200):**
```json
{
  "status": "success",
  "message": "Acceso admin concedido",
  "user": { ... }
}
```

---

#### `POST /api/sessions/forgot-password`
Solicita reset de contraseña.

**Body:**
```json
{
  "email": "juan@example.com"
}
```

---

#### `POST /api/sessions/reset-password`
Restablece la contraseña con token.

**Body:**
```json
{
  "token": "token_jwt_recibido_por_email",
  "newPassword": "nueva_password123"
}
```

---

### 📦 Productos

#### `GET /api/products`
Obtiene todos los productos con paginación y filtros.

**Query Parameters:**
- `limit` (number): Productos por página (default: 10)
- `page` (number): Número de página (default: 1)
- `query` (string): Filtro por categoría o status (true/false)
- `sort` (string): Ordenamiento por precio (`asc` o `desc`)

**Ejemplo:**
```
GET /api/products?limit=5&page=1&query=Electrónica&sort=asc
```

**Respuesta (200):**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 10,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?page=2&limit=5"
}
```

---

#### `GET /api/products/:pid`
Obtiene un producto por ID.

**Respuesta (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "title": "Producto",
    "description": "...",
    "price": 99.99,
    "stock": 50,
    ...
  }
}
```

---

#### `POST /api/products`
Crea un nuevo producto. **Requiere autenticación y rol admin.**

**Headers:**
- Cookie con token JWT (admin)

**Body (JSON):**
```json
{
  "title": "Nuevo Producto",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 99.99,
  "stock": 50,
  "category": "Electrónica",
  "status": true,
  "thumbnails": []
}
```

**Body (Form-data con imágenes):**
- `title`: "Nuevo Producto"
- `description`: "..."
- `code`: "PROD001"
- `price`: 99.99
- `stock`: 50
- `category`: "Electrónica"
- `status`: true
- `thumbnails`: [archivos de imagen]

**Respuesta (201):**
```json
{
  "status": "success",
  "data": { ... }
}
```

---

#### `PUT /api/products/:pid`
Actualiza un producto. **Requiere autenticación y rol admin.**

**Headers:**
- Cookie con token JWT (admin)

**Body:**
```json
{
  "title": "Producto Actualizado",
  "price": 149.99,
  "stock": 75
}
```

**Nota:** Solo envía los campos que deseas actualizar.

---

#### `DELETE /api/products/:pid`
Elimina un producto. **Requiere autenticación y rol admin.**

**Headers:**
- Cookie con token JWT (admin)

**Respuesta (200):**
```json
{
  "status": "success",
  "message": "Producto eliminado correctamente",
  "data": { ... }
}
```

---

### 🛒 Carritos

#### `POST /api/carts`
Crea un nuevo carrito.

**Body:**
```json
{
  "userId": "user_id_aqui"
}
```

**O si estás autenticado:**
```json
{}
```
(El userId se toma del token JWT)

**Respuesta (201):**
```json
{
  "_id": "...",
  "userId": "...",
  "products": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

#### `GET /api/carts/:cid/products`
Obtiene los productos de un carrito.

**Respuesta (200):**
```json
[
  {
    "productId": { ... },
    "quantity": 2,
    "title": "...",
    "price": 99.99
  },
  ...
]
```

---

#### `POST /api/carts/:cid/products/:pid`
Agrega un producto al carrito.

**Body (opcional):**
```json
{
  "quantity": 2
}
```

Si no se envía quantity, se agrega 1 por defecto.

**Respuesta (200):**
```json
{
  "status": "success",
  "cart": { ... }
}
```

---

#### `PUT /api/carts/:cid/products/:pid`
Actualiza la cantidad de un producto en el carrito.

**Body:**
```json
{
  "quantity": 5
}
```

---

#### `DELETE /api/carts/:cid/products/:pid`
Elimina un producto del carrito.

---

#### `PUT /api/carts/:cid`
Reemplaza todos los productos del carrito.

**Body:**
```json
{
  "products": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
      "quantity": 1
    }
  ]
}
```

---

#### `DELETE /api/carts/:cid`
Vacía completamente el carrito.

---

#### `POST /api/carts/:cid/purchase`
Finaliza la compra del carrito. **Requiere autenticación.**

**Headers:**
- Cookie con token JWT

**Body (opcional si estás autenticado):**
```json
{
  "purchaser": "email@example.com"
}
```

**Respuesta (200):**
```json
{
  "status": "success",
  "ticket": {
    "code": "abc123...",
    "purchase_datetime": "2024-01-15T10:30:00.000Z",
    "amount": 299.98,
    "purchaser": "email@example.com",
    "status": "completed"
  },
  "purchasedProducts": [
    {
      "productId": "...",
      "title": "Producto 1",
      "quantity": 2,
      "price": 99.99,
      "subtotal": 199.98
    }
  ],
  "failedProducts": [],
  "message": "Compra completada. 2 producto(s) comprado(s). 0 producto(s) sin stock suficiente."
}
```

**Nota:** 
- Verifica el stock de cada producto
- Actualiza el stock automáticamente
- Crea un ticket con los productos comprados
- Si hay productos sin stock, los deja en el carrito
- Si todo se compró, vacía el carrito

---

## 🔒 Autenticación y Autorización

### Autenticación JWT

La API utiliza JWT (JSON Web Tokens) para autenticación. El token se guarda en una cookie llamada `currentUser`.

**Flujo:**
1. Usuario hace login en `/api/sessions/login`
2. El servidor genera un JWT y lo guarda en cookie
3. Las peticiones siguientes incluyen automáticamente la cookie
4. El middleware de Passport valida el token

### Roles

- **user**: Usuario regular (por defecto)
- **admin**: Administrador con acceso a CRUD de productos

### Endpoints Protegidos

- `POST /api/products` - Solo admin
- `PUT /api/products/:pid` - Solo admin
- `DELETE /api/products/:pid` - Solo admin
- `POST /api/carts/:cid/purchase` - Requiere autenticación

---

## 📊 Modelos de Datos

### User
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  age: Number,
  password: String (required, hasheado),
  role: String (default: 'user'),
  cart: ObjectId (ref: 'Cart'),
  createdAt: Date
}
```

### Product
```javascript
{
  title: String (required),
  description: String (required),
  code: String (required, unique),
  price: Number (required),
  stock: Number (required),
  category: String (required),
  thumbnails: [String],
  status: Boolean (default: true)
}
```

### Cart
```javascript
{
  userId: ObjectId (required, ref: 'User'),
  products: [{
    productId: ObjectId (required, ref: 'Product'),
    title: String,
    quantity: Number (required, default: 1),
    price: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket
```javascript
{
  code: String (required, unique, auto-generado),
  purchase_datetime: Date (default: now),
  amount: Number (required, min: 0),
  purchaser: String (required),
  products: [{
    productId: ObjectId (ref: 'Product'),
    title: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  status: String (enum: ['completed', 'partial', 'failed']),
  failedProducts: [{
    productId: ObjectId,
    title: String,
    requestedQuantity: Number,
    availableStock: Number,
    reason: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear un producto (Admin)

```bash
# 1. Login como admin
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Crear producto
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Zapatillas Trail",
    "description": "Zapatillas para trail running",
    "code": "ZAP001",
    "price": 129.99,
    "stock": 50,
    "category": "Calzado",
    "status": true
  }'
```

### Ejemplo 2: Agregar producto al carrito y comprar

```bash
# 1. Crear carrito
curl -X POST http://localhost:8080/api/carts \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_id_aqui"}'

# 2. Agregar producto
curl -X POST http://localhost:8080/api/carts/CART_ID/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'

# 3. Finalizar compra (requiere login)
curl -X POST http://localhost:8080/api/carts/CART_ID/purchase \
  -b cookies.txt
```

---

## 🏗 Arquitectura

El proyecto sigue una arquitectura en capas:

1. **Routes**: Define los endpoints y middlewares
2. **Controllers**: Maneja las peticiones HTTP y respuestas
3. **Services**: Contiene la lógica de negocio
4. **DAO (Data Access Object)**: Acceso a la base de datos
5. **Models**: Esquemas de Mongoose

**Patrones utilizados:**
- Repository Pattern (en algunos módulos)
- DTO (Data Transfer Objects) para transferencia de datos
- Dependency Injection para servicios y DAOs

---

## 🧪 Testing con Postman

### Configuración de Postman

1. **Habilitar cookies automáticas:**
   - Settings → General → "Send cookies automatically"

2. **Colección de ejemplo:**
   - Importa las rutas desde el archivo de colección
   - O crea manualmente las peticiones siguiendo la documentación

### Flujo de Testing Recomendado

1. **Registro de usuario:**
   ```
   POST /api/sessions/register
   ```

2. **Login:**
   ```
   POST /api/sessions/login
   ```
   (Guarda automáticamente la cookie)

3. **Crear producto (admin):**
   ```
   POST /api/products
   ```
   (Requiere cookie de admin)

4. **Crear carrito:**
   ```
   POST /api/carts
   ```

5. **Agregar productos:**
   ```
   POST /api/carts/:cid/products/:pid
   ```

6. **Finalizar compra:**
   ```
   POST /api/carts/:cid/purchase
   ```

---

## 📝 Notas Adicionales

- El sistema de tickets maneja automáticamente compras parciales cuando hay productos sin stock
- Los productos sin stock se mantienen en el carrito para futuras compras
- El stock se actualiza automáticamente al finalizar una compra
- Las imágenes de productos se guardan en `public/images/`
- El token JWT expira después de 24 horas

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👤 Autor

**Pepe Luquet**
- GitHub: [@pepeluquet](https://github.com/pepeluquet)

---

## 🙏 Agradecimientos

- Coderhouse - Programación Backend II
- Comunidad de desarrolladores

---

¡Gracias por usar InaYoga Trail Running API! 🏃‍♂️ 