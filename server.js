const app = require("./app");
const mongoose = require("mongoose");

//suppose db password is incorrect
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((obj) => console.log("DB connection successful!"))
  .catch((err) => console.log("failed connecting:", err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//suppose we used console.log(x) where x was not defined .
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    //server.close() tell server to complete all ongoing task b4 we exit our process .
    process.exit(1);
  });
});
