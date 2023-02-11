const express = require("express");
const {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  getByMonth,
} = require("../controller/expenses");

const router = express.Router();

router.get("/:month", getByMonth);
router.get("/", getExpenses);
router.post("/", addExpense);
router.put("/", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
