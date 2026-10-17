CREATE SEQUENCE invoice_number_seq START 1;

CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) NOT NULL UNIQUE,
    quotation_id BIGINT NOT NULL UNIQUE REFERENCES quotations(id),
    quotation_number VARCHAR(30) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(150),
    location VARCHAR(200) NOT NULL,
    service VARCHAR(100) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL,
    discount NUMERIC(14,2) NOT NULL DEFAULT 0,
    gst_percent NUMERIC(5,2) NOT NULL,
    gst_amount NUMERIC(14,2) NOT NULL,
    total NUMERIC(14,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ISSUED',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL,
    description VARCHAR(300) NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(20),
    unit_price NUMERIC(14,2) NOT NULL,
    amount NUMERIC(14,2) NOT NULL
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(14,2) NOT NULL,
    method VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL,
    reference VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);