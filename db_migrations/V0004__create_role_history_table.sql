CREATE TABLE IF NOT EXISTS role_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    old_role VARCHAR(50) NOT NULL,
    new_role VARCHAR(50) NOT NULL,
    changed_by_admin_id INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

CREATE INDEX idx_role_history_user_id ON role_history(user_id);
CREATE INDEX idx_role_history_changed_at ON role_history(changed_at DESC);