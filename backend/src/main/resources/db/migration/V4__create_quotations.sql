CREATE SEQUENCE quotation_number_seq START 1;

CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    quotation_number VARCHAR(30) NOT NULL UNIQUE,
    enquiry_id BIGINT REFERENCES enquiries(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(150),
    location VARCHAR(200) NOT NULL,
    service VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    subtotal NUMERIC(14,2) NOT NULL,
    discount NUMERIC(14,2) NOT NULL DEFAULT 0,
    gst_percent NUMERIC(5,2) NOT NULL DEFAULT 18,
    gst_amount NUMERIC(14,2) NOT NULL,
    total NUMERIC(14,2) NOT NULL,
    valid_until DATE,
    terms TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotation_items (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL,
    description VARCHAR(300) NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(20),
    unit_price NUMERIC(14,2) NOT NULL,
    amount NUMERIC(14,2) NOT NULL
);

CREATE INDEX idx_quotation_items_quotation ON quotation_items(quotation_id);