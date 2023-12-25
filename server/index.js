const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const port = process.env.PORT;
const app = express();
dbConnect();
app.listen(port, () => {
  console.log("app running at port", port);
});
