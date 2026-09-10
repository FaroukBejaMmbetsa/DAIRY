INSERT INTO suppliers (supplier_name)
VALUES ('Dairy Equipment Supplies');

INSERT INTO spare_parts (part_name, quantity, reorder_level, supplier_id)
VALUES ('Milk pump seal', 10, 3, 1);

SELECT * FROM spare_parts;

DELETE FROM spare_parts
WHERE spare_part_id = 1;