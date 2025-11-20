-- ============================================================================
--  DATOS DE PRUEBA: roles + usuarios + asignación de roles
-- ============================================================================

-- Limpieza por si ya existían datos
DELETE FROM users_roles;
DELETE FROM users;
DELETE FROM roles;

-- 1. Roles de ejemplo
INSERT INTO roles (role_name, description) VALUES
  ('admin', 'Administrador del sistema'),
  ('user',  'Usuario estándar');

-- 2. Usuarios de prueba
-- Passwords ya vienen hasheadas con bcrypt (10 rounds):
--  - "secreto123" -> para usuarios admin
--  - "clave123"   -> para usuarios normales

INSERT INTO users (email, password, name, phone, is_active) VALUES
  (
    'test@example.com',
    '$2b$10$bb5Frlff44rwLcFB9e86Y.WD.I0fZFVjSNwBY1ODOBDPyuij8BQfS', -- secreto123
    'Admin Principal',
    '3001234567',
    TRUE
  ),
  (
    'admin2@example.com',
    '$2b$10$bb5Frlff44rwLcFB9e86Y.WD.I0fZFVjSNwBY1ODOBDPyuij8BQfS', -- secreto123
    'Admin Secundario',
    '3009990000',
    TRUE
  ),
  (
    'user2@example.com',
    '$2b$10$2ZgymUzfr46LxIeRbJGIFendvDHA7CfLM3nC.ADAb17JsqOBbsw9q', -- clave123
    'Usuario Normal 1',
    '3007654321',
    TRUE
  ),
  (
    'user3@example.com',
    '$2b$10$2ZgymUzfr46LxIeRbJGIFendvDHA7CfLM3nC.ADAb17JsqOBbsw9q', -- clave123
    'Usuario Normal 2',
    '3001112222',
    TRUE
  );

-- 3. Asignar roles a los usuarios
--  - test@example.com      -> admin
--  - admin2@example.com    -> admin
--  - user2@example.com     -> user
--  - user3@example.com     -> user

INSERT INTO users_roles (user_id, role_id)
VALUES
  (
    (SELECT id FROM users WHERE email = 'test@example.com'),
    (SELECT id FROM roles WHERE role_name = 'admin')
  ),
  (
    (SELECT id FROM users WHERE email = 'admin2@example.com'),
    (SELECT id FROM roles WHERE role_name = 'admin')
  ),
  (
    (SELECT id FROM users WHERE email = 'user2@example.com'),
    (SELECT id FROM roles WHERE role_name = 'user')
  ),
  (
    (SELECT id FROM users WHERE email = 'user3@example.com'),
    (SELECT id FROM roles WHERE role_name = 'user')
  );

-- ============================================================================
--  FIN DEL SCRIPT
-- ============================================================================
