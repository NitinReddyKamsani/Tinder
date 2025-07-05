const express = require('express');

const app = express();

app.get("/",(req,res)=>{
    res.send("Hello World")
});

app.get("/test",(req,res)=>{
    res.send("Test")
});

app.listen(7777,()=>{
    console.log("server listening...")
});