USE dairy_management;

-- Add sale information to existing cows.
ALTER TABLE cows
    ADD COLUMN price DECIMAL(12,2) NULL AFTER status,
    ADD COLUMN available_for_sale BOOLEAN NOT NULL DEFAULT FALSE AFTER price;

-- Catalogue for milk, yoghurt, cheese, butter, and future dairy products.
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(12,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_path VARCHAR(255),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (price >= 0),
    CHECK (stock_quantity >= 0)
);

-- One order represents one checkout attempt by one signed-in user.
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_prompt_amount DECIMAL(12,2) NOT NULL DEFAULT 1.00,
    phone_number VARCHAR(30) NOT NULL,
    status ENUM('Pending', 'Paid', 'Failed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL,
    CHECK (total_amount >= 0),
    CHECK (payment_prompt_amount > 0)
);

-- The products or cows included in an order.
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    cow_id INT NULL,
    item_name VARCHAR(120) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    line_total DECIMAL(12,2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE SET NULL,
    FOREIGN KEY (cow_id) REFERENCES cows(cow_id)
        ON DELETE SET NULL,
    CHECK (quantity > 0),
    CHECK (unit_price >= 0)
);

-- Payment records for the future Daraja/M-Pesa integration.
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    provider VARCHAR(30) NOT NULL DEFAULT 'M-Pesa',
    checkout_request_id VARCHAR(100),
    receipt_number VARCHAR(100),
    status ENUM('Requested', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'Requested',
    transaction_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    CHECK (amount > 0)
);

-- Starter catalogue records for the customer pages.
INSERT INTO products
    (product_name, category, description, price, unit, stock_quantity)
VALUES
    ('Fresh milk', 'Milk', 'Chilled farm milk, bottled fresh.', 120.00, 'per litre', 0),
    ('Natural yoghurt', 'Yoghurt', 'Smooth, lightly cultured yoghurt.', 180.00, 'per 500 ml', 0),
    ('Farmhouse cheese', 'Cheese', 'Firm, creamy farmhouse cheese.', 850.00, 'per 500 g', 0),
    ('Cream butter', 'Butter', 'Rich churned butter.', 480.00, 'per 250 g', 0)
ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    description = VALUES(description),
    price = VALUES(price),
    unit = VALUES(unit);
