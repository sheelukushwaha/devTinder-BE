const express = require("express");

const app = express();

app.use("/test", (req, res)=> {
    res.send("hello")
});

app.use("/", (req, res)=> {
    res.send("test")
});

app.listen(7777, ()=> {
    console.log("server listening on 7777");
});