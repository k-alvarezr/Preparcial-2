🐘 Base de datos con Docker

Se usa un contenedor Docker con PostgreSQL.

--Crear el contenedor:

  -En PowerShell / terminal de VS Code (Windows) en una sola línea:
    docker run --name prep-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=preparcial_db -p 5432:5432 -d postgres:16


  -Verificar que está corriendo:
    docker ps


--Ejecutar el script dentro del contenedor

  -Copiar el archivo al contenedor (o montarlo) y luego:
    docker exec -i prep-db psql -U postgres -d preparcial_db < .\sql\migrations\001_schema.sql
    docker exec -i prep-db psql -U postgres -d preparcial_db < .\sql\seed\seed_users_roles.sql

------------------------------------------------------------------------------------------------------------------------------------------    
🧾 Endpoints
-Headers:
  Authorization: Bearer <access_token>
