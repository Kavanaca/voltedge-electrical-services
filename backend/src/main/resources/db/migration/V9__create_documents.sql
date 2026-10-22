CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    doc_type VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    issuing_authority VARCHAR(150),
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    notes VARCHAR(1000),
    file_name VARCHAR(200),
    stored_name VARCHAR(100),
    content_type VARCHAR(50),
    file_size BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);