const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const routes = require("./routers/index.js");
const connectToDatabase = require("./middlewares/database.js");

app.use(cors());
const jwt = require("jsonwebtoken"); // To decode JWT
const jwksClient = require("jwks-rsa"); // For fetching AWS Cognito public keys
const User = require("./models/user"); // MongoDB user model
app.use(express.json());

app.use(connectToDatabase);

// Configure the JWKS client
const client = jwksClient({
  jwksUri: `https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_y7TfqTA4N/.well-known/jwks.json`,
});

// Helper function to get the public key from JWKS
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// Middleware to verify JWT token and retrieve user role
const authenticateToken = async (req, res, next) => {
  // Bypass token verification for the /pages/Login URL
  if (req.url === "/pages/Login") {
    return next();
  }
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    // Verify and decode the token using AWS Cognito's public keys
    jwt.verify(token, getKey, {}, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      // Get the username from the decoded token (Cognito typically stores it in 'username' or 'sub')
      const username = decoded.username || decoded.sub;

      if (!username) {
        return res.status(400).json({ message: "Username not found in token" });
      }

      // Query MongoDB to get the user's role
      const filterCriteria = [
        {
          $match: {
            pageName: "users",
            username: username,
          },
        },
      ];

      const userData = await getUserAndRoleByFilter(filterCriteria, req.db);
      const user = userData.user;

      // const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach user and role to request object for use in subsequent middleware/routes
      req.user = user;
      req.role = user.role;

      next(); // Proceed to the next middleware/route
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserAndRoleByFilter = async (filterCriteria, db) => {
  console.log("Fetching user and role based on filter");

  try {
    const collection = db.collection("appdata"); // Assuming the collection name is 'users'
    const user = await collection.aggregate(filterCriteria).toArray();

    if (!user || user.length === 0) {
      throw new Error("User not found with the given filter");
    }

    return {
      status: "success",
      user: user[0],
      role: user[0].role,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get("/test", (req, res) => {
  res.send("Hello from the example route!");
});
app.use("/api", authenticateToken, routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
