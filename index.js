const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`Backend is listening on port ${PORT}`);
});
