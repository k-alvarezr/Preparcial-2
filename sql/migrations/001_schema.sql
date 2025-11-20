-- ============================================================================
--  ESTRUCTURA DE LA BD: users, roles, users_roles
-- ============================================================================

-- Asume que ya estás dentro de la BD preparcial_db
-- CREATE DATABASE preparcial_db;
-- \c preparcial_db;  -- (en psql)

-- Extensión para UUID (necesaria para uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla roles
CREATE TABLE IF NOT EXISTS roles (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name   VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,  -- hash bcrypt
    name        VARCHAR(255) NOT NULL,
    phone       VARCHAR(50),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla intermedia muchos-a-muchos users_roles
CREATE TABLE IF NOT EXISTS users_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_role
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);