// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "journal_db",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Endpoint to fetch journals data
app.get("/journals", (req, res) => {
  const query = "SELECT * FROM journals";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching journals: " + err.message);
      res.status(500).send("Error fetching journals");
      return;
    }
    res.json(result); // Send the result as JSON response
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
