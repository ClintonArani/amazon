CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- Foreign key referencing the users table
    total_price DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME,
    isDeleted BIT DEFAULT 0,
    CONSTRAINT fk_user_order FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE orders
ADD order_status VARCHAR(50) DEFAULT 'pending';