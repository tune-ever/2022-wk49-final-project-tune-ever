const { findByMonth } = require("../model/expenses");
const expenses = require("../model/expenses");
const Joi = require("joi");

const getExpenses = async (req, res) => {
  try {
    const response = await expenses.findAll(req.query);

    if (response) {
      res.send(response);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

// Post -> returns 201 status
const addExpense = async (req, res) => {
  // Joi validation : schema
  const schema = Joi.object({
    cost: Joi.number().required(),
    shop: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
  });

  // Validate:
  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // req body contains data to insert into db:
  const expense = {
    cost: req.body.cost,
    shop: req.body.shop,
    category: req.body.category,
  };
  try {
    const response = await expenses.addNew(expense);
    if (response) {
      expense.id = response.insertId;
      res.status(201).send(expense);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const response = await expenses.delete(parseInt(req.params.id));
    // Check response affected rows: zero means id didnt exist in db:
    if (response.affectedRows === 0) {
      res.status(404).send("Not Found");
      return;
    }
    if (response) {
      res.send("Expense deleted");
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const updateExpense = async (req, res) => {
  // Joi validation : schema
  const schema = Joi.object({
    id: Joi.number().min(1).required(),
    cost: Joi.number().required(),
    shop: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
  });

  // Validate:
  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // req body contains data to insert into db:
  // and id because this is put:
  const expense = {
    id: req.body.id,
    cost: req.body.cost,
    shop: req.body.shop,
    category: req.body.category,
  };
  try {
    const response = await expenses.update(expense);
    // Check affectedrows = did we update anything?
    if (response.affectedRows === 0) {
      res.status(404).send("Not Found");
      return;
    }
    if (response) {
      res.send(expense);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const getByMonth = async (req, res) => {
  // Convert the month to a number first: 01-12
  const month = req.params.month;
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "october",
    "august",
    "november",
    "september",
    "december",
  ];
  let monthNumber = months.indexOf(month);
  const response = await findByMonth(monthNumber + 1);
  if (response) {
    res.send(response);
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  getByMonth,
};
