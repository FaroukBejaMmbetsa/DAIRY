CREATE DATABASE IF NOT EXISTS dairy_management;
USE dairy_management;

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);