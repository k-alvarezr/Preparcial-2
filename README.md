# 🐘 Base de datos con Docker

Se usa un contenedor Docker con PostgreSQL.

1. Crear el contenedor:

En PowerShell / terminal de VS Code (Windows), en una sola línea:

docker run --name prep-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=preparcial_db -p 5432:5432 -d postgres:16

2. Verificar que está corriendo: 
docker ps


# 🗄️ Migraciones y seed SQL

Los scripts están en la carpeta sql/:

sql/migrations/001_schema.sql → crea tablas users, roles, users_roles.

sql/seed/seed_users_roles.sql → inserta usuarios y roles de prueba.

Ejecutar desde la raíz del proyecto (backend):

# Migraciones (estructura)
docker exec -i prep-db psql -U postgres -d preparcial_db < .\sql\migrations\001_schema.sql

# Seed (usuarios y roles probados)
docker exec -i prep-db psql -U postgres -d preparcial_db < .\sql\seed\seed_users_roles.sql


# 👤 Usuarios de prueba

Después de ejecutar el seed:

-Admins

test@example.com / secreto123

admin2@example.com / secreto123

-Usuarios normales

user2@example.com / clave123

user3@example.com / clave123


# 🔐 Autenticación

Todos los endpoints protegidos usan JWT tipo Bearer:

Authorization: Bearer <access_token>

El access_token se obtiene llamando a POST /auth/login.


# 🧾 Endpoints principales

Todos los endpoints que requieren autenticación deben incluir el header:
Authorization: Bearer <access_token>

-Auth

POST /auth/register
Registra un nuevo usuario.

POST /auth/login
Devuelve un access_token (JWT) para usar en los demás endpoints.

-Users

GET /users/me
Devuelve el perfil del usuario autenticado.

GET /users (solo rol admin)
Lista todos los usuarios (sin campo password).

PATCH /users/:id/roles (solo rol admin)
Asigna uno o varios roles a un usuario.

-Roles

POST /roles (solo rol admin)
Crea un nuevo rol.

GET /roles (solo rol admin)
Lista todos los roles.


# 📝 Notas

-Las contraseñas se almacenan hasheadas con bcrypt.

-Los tokens JWT expiran según JWT_EXPIRES_IN (por defecto 120s).