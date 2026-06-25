# Tienda de Hardware

Sistema de gestión (CRUD) para una tienda de componentes de PC, con autenticación, roles y manejo de errores. Desarrollado como Trabajo Práctico — Sprints 1, 2 y 3.

## Descripción

Permite listar, crear, editar y eliminar productos de hardware (placas de video, procesadores, memorias RAM, periféricos, etc.), con un sistema de usuarios y roles que restringe quién puede gestionar productos y usuarios.

## Tecnologías utilizadas

**Backend:**
- Node.js + Express 5
- Prisma ORM 6 + MySQL
- JWT (jsonwebtoken) para autenticación
- BCrypt (bcryptjs) para hash de contraseñas

**Frontend:**
- HTML5, CSS3, JavaScript Vanilla (sin frameworks)
- localStorage para persistencia de sesión



## Instalación

### 1. Clonar el repositorio

```bash
[git clone <URL_DEL_REPO>](https://github.com/AcostaUlices/productos-app-sprint1.git)
cd productos-app-sprint1
```

### 2. Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en `backend` con:

```env
DATABASE_URL="mysql://root:TU_CONTRASEÑA@localhost:3306/productos_db" (Aclaracion en esta parte no pongo mi contraseña y solo doy un ejemplo de lo que se tendria que poner)
JWT_SECRET="tu_frase_secreta_larga_y_dificil_de_adivinar" (Mismo caso que el anterior)
```

Aplicar las migraciones:

```bash
npx prisma migrate dev
```

### 3. Crear el primer usuario SUPERADMIN

Por seguridad, no existe ninguna ruta pública para crear un SUPERADMIN. El primer usuario con ese rol se asigna manualmente:

1. Registrar un usuario normal desde `POST /auth/register` (Thunder Client o desde la app)
2. En MySQL Workbench, ejecutar:
```sql
UPDATE Usuario SET rol = 'SUPERADMIN' WHERE email = 'tu_email@ejemplo.com';
```

### 4. Frontend

No requiere instalación de dependencias.

## Ejecución

### Backend

```bash
cd backend
npm run dev
```

Disponible en `http://localhost:3000`

### Frontend

Abrir `frontend/login.html` con Live Server (extensión de VS Code).

## Roles del sistema

| Rol | Permisos |
|---|---|
| USUARIO | Solo puede ver el catálogo de productos |
| ADMIN | Puede crear, editar y eliminar productos |
| SUPERADMIN | Todo lo de ADMIN + gestionar usuarios (cambiar rol, eliminar). No puede ser modificado ni eliminado por otro SUPERADMIN |

## Endpoints de la API

### Productos

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|--------------|
| GET | /productos | Público | Listar productos |
| GET | /productos/:id | Público | Obtener un producto |
| POST | /productos | ADMIN / SUPERADMIN | Crear producto |
| PUT | /productos/:id | ADMIN / SUPERADMIN | Editar producto |
| DELETE | /productos/:id | ADMIN / SUPERADMIN | Eliminar producto |

### Autenticación

| Método | Ruta | Descripción |
|--------|------|--------------|
| POST | /auth/register | Registrar un nuevo usuario |
| POST | /auth/login | Iniciar sesión, devuelve un JWT |

### Usuarios (gestión)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|--------------|
| GET | /usuarios | SUPERADMIN | Listar usuarios |
| PUT | /usuarios/:id/rol | SUPERADMIN | Cambiar rol (ADMIN o USUARIO únicamente) |
| DELETE | /usuarios/:id | SUPERADMIN | Eliminar usuario |

## Manejo de errores

El backend centraliza el manejo de errores con clases personalizadas (`ValidationError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`), todas heredando de `AppError`, procesadas por un middleware único (`errorHandler.js`) que devuelve siempre un formato JSON consistente:

```json
{
  "error": "NombreDelError",
  "mensaje": "Descripción legible del problema"

}
```

## Autor

Ulices Mateo Acosta
=======
