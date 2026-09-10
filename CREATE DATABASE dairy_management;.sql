CREATE DATABASE dairy_management;
USE dairy_management;

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE spare_parts (
    spare_part_id INT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 0,
    supplier_id INT,
    CONSTRAINT chk_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_reorder_level CHECK (reorder_level >= 0),
    CONSTRAINT fk_spare_parts_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE SET NULL
);

CREATE TABLE equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE equipment_parts (
    equipment_id INT NOT NULL,
    spare_part_id INT NOT NULL,
    quantity_used INT NOT NULL DEFAULT 1,
    PRIMARY KEY (equipment_id, spare_part_id),
    CONSTRAINT chk_quantity_used CHECK (quantity_used > 0),
    FOREIGN KEY (equipment_id)
        REFERENCES equipment(equipment_id)
        ON DELETE CASCADE,
    FOREIGN KEY (spare_part_id)
        REFERENCES spare_parts(spare_part_id)
        ON DELETE CASCADE
);