// Express boilerplate:
const express = require("express");
const cors = require("cors");
const expensesRouter = require("./routes/expenses");

const app = express();
// Cors middleware: allow cross-resource sharing
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK");
});
app.use("/api/expenses/", expensesRouter);

module.exports = app;
