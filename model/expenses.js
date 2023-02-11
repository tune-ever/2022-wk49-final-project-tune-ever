const connection = require("../db/connection");

const expenses = {
  findAll: sortObject =>
    new Promise((resolve, reject) => {
      // 4 kinds of SORTS from query string:
      let sortRow = Object.keys(sortObject)[0];
      let sortCriteria = Object.values(sortObject)[0];
      if (sortRow === "shop") {
        let sqlQuery =
          "SELECT * FROM expenses ORDER BY CASE WHEN shop = ? THEN 1 ELSE 2 END;";
        connection.query(sqlQuery, sortCriteria, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } else if (sortRow === "category") {
        let sqlQuery =
          "SELECT * FROM expenses ORDER BY CASE WHEN category = ? THEN 1 ELSE 2 END;";
        connection.query(sqlQuery, sortCriteria, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } else if (sortRow === "cost") {
        let sqlQuery;

        // Ascending or descending order?
        sortCriteria == 1
          ? (sqlQuery = "SELECT * FROM expenses ORDER BY cost DESC;")
          : (sqlQuery = "SELECT * FROM expenses ORDER BY cost;");
        connection.query(sqlQuery, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } else if (sortRow === "created") {
        let sqlQuery;

        // Ascending or descending order?
        sortCriteria == 1
          ? (sqlQuery = "SELECT * FROM expenses ORDER BY created DESC;")
          : (sqlQuery = "SELECT * FROM expenses ORDER BY created;");

        connection.query(sqlQuery, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } else {
        connection.query("SELECT * FROM expenses;", (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      }
    }),
  findByMonth: month =>
    new Promise((resolve, reject) => {
      // Find by month:
      connection.query(
        "SELECT * FROM expenses WHERE MONTH(created) = ?;",
        month,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
  // expense json object:
  addNew: expense =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO expenses SET ?", expense, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }),
  delete: id =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM expenses WHERE id = ${id}`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
  update: expense =>
    new Promise((resolve, reject) => {
      // Expense object contains all the data we want to insert to db:
      const updateQuery =
        "UPDATE expenses SET cost = ?, shop = ?, category = ? WHERE id = ?;";
      connection.query(
        updateQuery,
        [expense.cost, expense.shop, expense.category, expense.id],
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
};

module.exports = expenses;
