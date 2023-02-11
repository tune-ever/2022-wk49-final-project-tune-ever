const { describe, expect, test, beforeAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");

describe("GET expenses endpoint", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/api/expenses").expect(200);
  });
  test("should return valid JSON", async () => {
    const response = await request(app)
      .get("/api/expenses")
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    // Check if response is array: first object has properties we want:
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          cost: expect.any(Number),
          created: expect.any(String),
          shop: expect.any(String),
          category: expect.any(String),
        }),
      ])
    );
  });
  test("should return data by month", async () => {
    // Post three expenses to db: two january and one december:
    const decemberExpense = {
      cost: 100.0,
      shop: "Ikea",
      category: "Furniture",
      created: "2022-12-23",
    };

    const januaryExpense = {
      cost: 100.0,
      shop: "Ikea",
      category: "Furniture",
      created: "2023-01-05",
    };
    const januaryExpenseTwo = {
      cost: 100.0,
      shop: "Prisma",
      category: "Food",
      created: "2023-01-05",
    };

    const januaryResponseTwo = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(januaryExpenseTwo);

    const januaryResponse = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(januaryExpense);

    const decemberResponse = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(decemberExpense);

    const response = await request(app)
      .get("/api/expenses/january")
      .set("Accept", "application/json");

    // Check that response doesn't contain december values
    expect(response.body).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          created: expect.stringContaining("-12-"),
        }),
      ])
    );
    // Also check that response contains at least one january object:
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          created: expect.stringContaining("-01-"),
        }),
      ])
    );
    // Also check that response has at least two objects:
    expect(response.body).not.toHaveLength(1);
  });
});

describe("POST expenses endpoint", () => {
  test("Should add a new expense", async () => {
    const expense = {
      cost: 100.0,
      shop: "Ikea",
      category: "Furniture",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.id).toBeTruthy();
    expect(response.body.shop).toEqual("Ikea");
    expect(response.body.cost).toEqual(100.0);
    expect(response.body.category).toEqual("Furniture");
  });
  //Validation tests:
  test("Should not allow no cost.", async () => {
    const expense = {
      shop: "Ikea",
      category: "Furniture",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"cost" is required');
  });
  test("Should not allow no shop.", async () => {
    const expense = {
      cost: 100.0,
      category: "Furniture",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" is required');
  });
  test("Should not allow no category.", async () => {
    const expense = {
      cost: 100.0,
      shop: "Ikea",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" is required');
  });
  test("Should not allow empty category.", async () => {
    const expense = {
      cost: 100.0,
      shop: "Ikea",
      category: "",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" is not allowed to be empty');
  });
  test("Should not allow empty shop.", async () => {
    const expense = {
      cost: 100.0,
      shop: "",
      category: "test",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" is not allowed to be empty');
  });
  test("shop must be a string.", async () => {
    const expense = {
      cost: 100.0,
      shop: 77,
      category: "test",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" must be a string');
  });
  test("category must be a string.", async () => {
    const expense = {
      cost: 100.0,
      shop: "test",
      category: 88,
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" must be a string');
  });
  test("cost must be a number.", async () => {
    const expense = {
      cost: "test",
      shop: "test",
      category: "test",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"cost" must be a number');
  });
});

describe("DELETE expenses endpoint", () => {
  test("should delete with specific id", async () => {
    // Insert to db first an expense
    const expense = {
      cost: 100.0,
      shop: "Ikea",
      category: "Furniture",
    };

    const response = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    // get id from res:
    const id = response.body.id;

    const deleteResponse = await request(app)
      .delete(`/api/expenses/${id}`)
      .set("Accept", "application/json");

    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.text).toEqual("Expense deleted");
  });
  test("should check if delete id exists", async () => {
    const response = await request(app)
      .delete("/api/expenses/6715819")
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
    expect(response.text).toEqual("Not Found");
  });
});

describe("PUT expenses endpoint", () => {
  // Before all send a expense with POST, to get id:
  let putId;
  beforeAll(async () => {
    const expense = {
      cost: 50,
      shop: "Test",
      category: "Testing",
    };
    const putResponse = await request(app)
      .post("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);
    putId = putResponse.body.id;
  });
  test("should update the city with specific id", async () => {
    const expense = {
      id: putId,
      cost: 100,
      shop: "Testing",
      category: "Test",
    };
    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(200);
    expect(response.body.cost).toEqual(100);
    expect(response.body.shop).toEqual("Testing");
    expect(response.body.id).toEqual(putId);
    expect(response.body.category).toEqual("Test");
  });
  test("should check if put id exists", async () => {
    // Put with wrong id:
    const expense = {
      id: 71257,
      cost: 100,
      shop: "Testing",
      category: "Test",
    };
    const response = await request(app)
      .put("/api/expenses/")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(404);
    expect(response.text).toEqual("Not Found");
  });
  //Validation tests:
  test("Should not allow no cost.", async () => {
    const expense = {
      id: 5,
      shop: "Ikea",
      category: "Furniture",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"cost" is required');
  });
  test("Should not allow no shop.", async () => {
    const expense = {
      id: 5,
      cost: 100.0,
      category: "Furniture",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" is required');
  });
  test("Should not allow no category.", async () => {
    const expense = {
      id: 5,
      cost: 100.0,
      shop: "Ikea",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" is required');
  });
  test("Should not allow empty category.", async () => {
    const expense = {
      id: 5,
      cost: 100.0,
      shop: "Ikea",
      category: "",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" is not allowed to be empty');
  });
  test("Should not allow empty shop.", async () => {
    const expense = {
      id: 5,
      cost: 100.0,
      shop: "",
      category: "test",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" is not allowed to be empty');
  });
  test("shop must be a string.", async () => {
    const expense = {
      id: 5,
      cost: 100.0,
      shop: 77,
      category: "test",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"shop" must be a string');
  });
  test("category must be a string.", async () => {
    const expense = {
      id: 5,
      cost: 100.0,
      shop: "test",
      category: 88,
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"category" must be a string');
  });
  test("cost must be a number.", async () => {
    const expense = {
      id: 5,
      cost: "test",
      shop: "test",
      category: "test",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"cost" must be a number');
  });
  test("id is required with put", async () => {
    const expense = {
      cost: 55,
      shop: "test",
      category: "test",
    };

    const response = await request(app)
      .put("/api/expenses")
      .set("Accept", "application/json")
      .send(expense);

    expect(response.status).toEqual(400);
    expect(response.text).toContain('"id" is required');
  });
});
