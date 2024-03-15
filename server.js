const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

//listening on http://localhost:3000/
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
