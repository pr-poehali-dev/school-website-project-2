-- Добавление нового администратора
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@club.school', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Главный администратор', 'admin')
ON CONFLICT (email) DO NOTHING;