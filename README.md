# 4A00EZ62 Backend-kehitys

## Backend Development - Final Project

## Money API

This is a simple api for tracking expenses.
render url: https://tamk-2022-syksy-backend-money-api.onrender.com/api/expenses

### Running locally

- Git clone
- Create a local mysql database:

```
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
```

- Create .env -file in root with your mysql data:

```
HOST=''
DBUSERNAME=''
PASSWORD=''
DATABASE='expenses'
PORT=5000
```

- Npm install
- Node index.js
- Api is live on: Localhost:5000/api/expenses

### Api endpoints

Localhost:5000/api/expenses

- Get
- Post
- Delete
- Put
- Get/month (january,february...)

Sorting results with query strings:

- Get?shop=Prisma
- Get?category=Food
- Get?created=1
- Get?cost=0

### Tests

- Npm run test

### Other stuff

- Localhost.rest - test api endpoints
- openApi.yaml - openapi documentation file
- server.rest - test api endpoints of render deployment

### Self evaluation

- A. Solution Design: 12 Solution partially planned out
- B. Execution: 30 Backend is deployed to a hosting service, reachable and responds correctly to API requests
- C. Requirements Satisfaction: 20 Backend implementation satisfies requirements completely and correctly
- D. Coding Style: 12 Well-formatted, understandable code; appropriate use of language capabilities
- E. Documentation: Concise, meaningful, well- formatted API and README documentation
