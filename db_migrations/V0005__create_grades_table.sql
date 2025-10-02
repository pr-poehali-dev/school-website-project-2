CREATE TABLE IF NOT EXISTS t_p84683043_school_website_proje.grades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    comment TEXT,
    graded_by INTEGER NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grades_user_id ON t_p84683043_school_website_proje.grades(user_id);
CREATE INDEX idx_grades_category ON t_p84683043_school_website_proje.grades(category);