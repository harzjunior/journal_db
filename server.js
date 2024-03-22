require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("./config");

// Create Express app
const app = express();

const port = config.port;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

//================================================Middleware================================================

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Perform your authentication check here
  const isLoggedIn = true; /* your authentication check here */

  if (isLoggedIn) {
    next(); // User is authenticated, proceed to the next middleware/route
  } else {
    res.status(401).send("Unauthorized"); // User is not authenticated
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  // Check if the user is authenticated
  if (req.user && req.user.role === "Admin") {
    // User is an admin, proceed to the next middleware/route
    next();
  } else {
    // User is not an admin, send a 403 Forbidden status
    res.status(403).send("Access Forbidden: Admin privileges required");
  }
};
//================================================journals================================================

// Apply the middleware to the routes that require authentication
app.use("/journals", isAuthenticated);
// app.use("/journals", verifyToken);

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

// Apply the isAdmin middleware to the routes that require admin privileges
app.post("/approve-user/:userId", isAdmin, (req, res) => {
  // Handle approving user logic here
  const userId = req.params.userId; // Extract userId from request parameters

  // An SQL query to update the user's status in the database
  const query = "UPDATE users SET status = 'approved' WHERE user_id = ?";
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error approving user:", error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log(`User with ID ${userId} approved successfully.`);
      // Log the action in the user_action table
      const logQuery =
        "INSERT INTO user_action (user_id, action, timestamp) VALUES (?, ?, NOW())";
      db.query(logQuery, [userId, "approve"], (logError, logResults) => {
        if (logError) {
          console.error("Error logging user action:", logError);
          // Consider handling the error in a better way, e.g., retrying or logging to a file
        }
      });
      res.status(200).send("User approved successfully");
    }
  });
});

app.post("/disapprove-user/:userId", isAdmin, (req, res) => {
  const userId = req.params.userId; // Extract userId from request parameters

  // An SQL query to update the user's status in the database
  const query = "UPDATE users SET status = 'disapproved' WHERE user_id = ?";
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error disapproving user:", error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log(`User with ID ${userId} disapproved successfully.`);
      // Log the action in the user_action table
      const logQuery =
        "INSERT INTO user_action (user_id, action, timestamp) VALUES (?, ?, NOW())";
      db.query(logQuery, [userId, "disapprove"], (logError, logResults) => {
        if (logError) {
          console.error("Error logging user action:", logError);
          // Consider handling the error in a better way, e.g., retrying or logging to a file
        }
      });
      res.status(200).send("User disapproved successfully");
    }
  });
});

//===============================================register=================================================
// this route to handle the user registration
app.post("/register", (req, res) => {
  console.log("Registration request received");

  const { registerUsername, registerPassword, registerEmail, registerRole } =
    req.body;

  const hashedPassword = bcrypt.hashSync(registerPassword, 10); // Hash the password

  // Insert user into the users table
  const insertUserQuery =
    "INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)";
  db.query(
    insertUserQuery,
    [registerUsername, hashedPassword, registerEmail, registerRole],
    (error, results) => {
      if (error) {
        console.error("Error registering user in MySQL:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "User registered successfully" });
      }
    }
  );
});

//===============================================login=================================================

// this route to handle the user login
app.post("/login", (req, res) => {
  const { loginUsername, loginPassword } = req.body;

  // Retrieve user from the users table based on the provided username
  const selectUserQuery = "SELECT * FROM users WHERE username = ? LIMIT 1";
  db.query(selectUserQuery, [loginUsername], (error, results) => {
    if (error) {
      console.error("Error querying user in MySQL:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Check if the user exists
      if (results.length === 1) {
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(
          loginPassword,
          user.password
        );

        if (isPasswordValid) {
          // Password is correct, generate and return a JWT token
          const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
            expiresIn: "1h", // You can adjust the expiration time
          });
          // res.json({ token });
          res.json({ token, username: user.username }); // Send token and username to the client
        } else {
          // Password is incorrect
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        // User not found
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });
});

//===============================================post Journal=================================================

// this route to handle the POST request for adding a new journal
app.post("/journals", (req, res) => {
  const { title, totalPages, rating, isbn, publishedDate, publisher } =
    req.body;
  const query =
    "INSERT INTO journals (journal_title, journal_total_page, rating, isbn, published_date, publisher_id) VALUES (?, ?, ?, ?, ?, ?)";

  // Execute the query
  db.query(
    query,
    [title, totalPages, rating, isbn, publishedDate, publisher],
    (error, results) => {
      if (error) {
        console.error("Error adding new journal to MySQL:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Retrieve the updated journal list
        const selectQuery = "SELECT * FROM journals";
        db.query(selectQuery, (selectError, selectResults) => {
          if (selectError) {
            console.error("Error fetching data from MySQL:", selectError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.json(selectResults);
          }
        });
      }
    }
  );
});

//===============================================users=================================================

// Define a route to handle GET requests to fetch users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";

  // Query the database to fetch user data
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching user data from MySQL:", error);
      res.status(500).send("Internal Server Error");
    } else {
      // Send the fetched user data as a JSON response
      res.json(results);
    }
  });
});

//===============================================users action=================================================

// Handle POST requests to log user actions
app.post("/log-user-action", (req, res) => {
  const { userId, action } = req.body;

  // Insert the user action into the user_actions table
  const query =
    "INSERT INTO user_actions (user_id, action, timestamp) VALUES (?, ?, NOW())";
  db.query(query, [userId, action], (error, results) => {
    if (error) {
      console.error("Error logging user action:", error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log(
        `User action ${action} for user with ID ${userId} logged successfully.`
      );
      res.status(200).send("User action logged successfully");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running`);
});
