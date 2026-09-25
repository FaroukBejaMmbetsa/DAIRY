CREATE DATABASE IF NOT EXISTS dairy_management;
USE dairy_management;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150),
    email VARCHAR(255),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS milk_sales;
DROP TABLE IF EXISTS milk_production;
DROP TABLE IF EXISTS cows;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS suppliers;

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(30),
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE cows (
    cow_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_number VARCHAR(30) NOT NULL UNIQUE,
    breed VARCHAR(50),
    date_of_birth DATE,
    gender ENUM('Female', 'Male') NOT NULL,
    health_status VARCHAR(50) DEFAULT 'Healthy',
    status ENUM('Active', 'Inactive', 'Sold', 'Deceased') DEFAULT 'Active',
    price DECIMAL(12,2),
    available_for_sale BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK (price IS NULL OR price >= 0)
);

CREATE TABLE products (
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

CREATE TABLE milk_production (
    production_id INT AUTO_INCREMENT PRIMARY KEY,
    cow_id INT NOT NULL,
    production_date DATE NOT NULL,
    milking_session ENUM('Morning', 'Evening') NOT NULL,
    quantity_litres DECIMAL(10,2) NOT NULL,
    quality_grade VARCHAR(20),
    FOREIGN KEY (cow_id) REFERENCES cows(cow_id)
        ON DELETE CASCADE,
    CHECK (quantity_litres >= 0),
    UNIQUE (cow_id, production_date, milking_session)
);

CREATE TABLE milk_sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    sale_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    quantity_litres DECIMAL(10,2) NOT NULL,
    price_per_litre DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2)
        GENERATED ALWAYS AS (quantity_litres * price_per_litre) STORED,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE SET NULL,
    CHECK (quantity_litres > 0),
    CHECK (price_per_litre >= 0)
);

CREATE TABLE orders (
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

CREATE TABLE order_items (
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

CREATE TABLE payments (
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

INSERT INTO suppliers (supplier_name, phone)
VALUES ('Dairy Equipment Supplies', '0700000000');

INSERT INTO customers (customer_name, phone)
VALUES ('Local Dairy Shop', '0711111111');

INSERT INTO cows
    (tag_number, breed, date_of_birth, gender, price, available_for_sale)
VALUES
    ('COW-001', 'Friesian', '2022-05-10', 'Female', 185000.00, TRUE);

INSERT INTO products
    (product_name, category, description, price, unit, stock_quantity)
VALUES
    ('Fresh milk', 'Milk', 'Chilled farm milk, bottled fresh.', 120.00, 'per litre', 0),
    ('Natural yoghurt', 'Yoghurt', 'Smooth, lightly cultured yoghurt.', 180.00, 'per 500 ml', 0),
    ('Farmhouse cheese', 'Cheese', 'Firm, creamy farmhouse cheese.', 850.00, 'per 500 g', 0),
    ('Cream butter', 'Butter', 'Rich churned butter.', 480.00, 'per 250 g', 0);

INSERT INTO milk_production
    (cow_id, production_date, milking_session, quantity_litres, quality_grade)
VALUES
    (1, CURRENT_DATE, 'Morning', 18.50, 'A');

INSERT INTO milk_sales
    (customer_id, quantity_litres, price_per_litre)
VALUES
    (1, 10.00, 80.00);

SELECT * FROM suppliers;
SELECT * FROM cows;
SELECT * FROM milk_production;
SELECT * FROM milk_sales;