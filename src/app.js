const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json())

app.post("/signup", async (req, res)=> {
    const user = new User(req?.body);
    try {
        await user.save();
        res.send("User added successfully!")
    } catch (error) {
        res.status(400).send("Error saving user data:", error.message)
    }
})

connectDB().then(()=>{
    console.log("connection for database established!");
    app.listen(7777, ()=> {console.log("server listening on 7777")});    
}).catch(err=>{
    console.error("database cannot be connected!!"); 
})

