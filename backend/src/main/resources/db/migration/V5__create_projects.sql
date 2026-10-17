CREATE SEQUENCE project_number_seq START 1;

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    project_number VARCHAR(30) NOT NULL UNIQUE,
    quotation_id BIGINT NOT NULL UNIQUE REFERENCES quotations(id),
    quotation_number VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    location VARCHAR(200) NOT NULL,
    service VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED',
    start_date DATE,
    end_date DATE,
    contractor_name VARCHAR(150),
    budget NUMERIC(14,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    assignee VARCHAR(100),
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_tasks_project ON project_tasks(project_id);