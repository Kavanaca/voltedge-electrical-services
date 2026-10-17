CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(30) NOT NULL,
    daily_wage NUMERIC(10,2) NOT NULL DEFAULT 0,
    join_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE project_tasks ADD COLUMN employee_id BIGINT REFERENCES employees(id);