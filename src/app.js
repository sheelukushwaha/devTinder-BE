const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json())

// ------------------- CREATE (POST) -------------------
// Endpoint: Signup a new user
app.post("/signup", async (req, res) => {
    const user = new User(req?.body); // Create a new User object from request body
    try {
        await user.save(); // Save user to database
        res.send("User added successfully!")
    } catch (error) {
        // Return error if validation or DB save fails
        res.status(400).send("Error saving user data:", error.message)
    }
});

// ------------------- READ (GET) -------------------
// Get a single user by emailId
app.get("/user", async (req, res) => {
    const email = req?.body?.emailId; // Extract email from request body
    try {
        const user = await User.find({ emailId: email }); // Find user(s) by email
        if (user.length === 0) {
            // If no user found
            res.status(404).send("User not found");
        }
        // Return user(s)
        res.send(user);
    } catch (error) {
        res.status(400).send("Something went wrong", error);
    }
});

// Get all users (feed)
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({}); // Get all users
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.json(users); // Return all users in JSON
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message });
    }
});

// ------------------- DELETE -------------------
// Delete user from database by userId
app.delete("/user", async (req, res) => {
    const userId = req.body.userId; // Extract userId from request body
    try {
        const user = await User.findByIdAndDelete(userId); 
        res.send("User deleted successfully!", user);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message });
    }
})

// ------------------- UPDATE (PATCH) -------------------
// Update specific fields of a user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId; // Extract userId
    const data = req.body; // Updated data
    try {
        // Find user by ID and update with new data
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after" });
        res.send("User updated successfully!", user);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message });
    }
})

// ------------------- UPDATE USER BY EMAIL (PATCH) -------------------
app.patch("/user/:emailId", async (req, res) => {
    const email = req.params.emailId; // Get emailId from route parameter
    const updateData = req.body;      // Data to update

    try {
        const user = await User.findOneAndUpdate(
            { emailId: email },       // Match condition
            updateData,               // Fields to update
            { new: true }             // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully!", user });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message });
    }
});

// ------------------- CONNECT DB & START SERVER -------------------
connectDB().then(() => {
    console.log("connection for database established!");
    app.listen(7777, () => { console.log("server listening on 7777") });
}).catch(err => {
    console.error("database cannot be connected!!"); 
})