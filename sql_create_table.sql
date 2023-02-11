CREATE DATABASE expenses;

USE expenses;

CREATE TABLE expenses(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  cost DECIMAL(8,2) DEFAULT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  shop VARCHAR(50),
  category VARCHAR(50)
);

INSERT INTO expenses VALUES(
  1, 100.00, NOW(), 'Prisma', 'Food'
);
INSERT INTO expenses VALUES(
  2, 50.50, "2022-12-23", 'Prisma', 'Food'
);
INSERT INTO expenses VALUES(
  3, 20.95, "2022-12-23", 'Prisma', 'Toys'
);
INSERT INTO expenses VALUES(
  4, 30.00, NOW(), 'Tokmanni', 'Toys'
);
INSERT INTO expenses VALUES(
  5, 60.00, NOW(), 'Tokmanni', 'Toys'
);
INSERT INTO expenses VALUES(
  6, 50.00, NOW(), 'Car fix', 'Car maintenance'
);