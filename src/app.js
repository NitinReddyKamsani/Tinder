const express = require('express');

const app = express();

const {isAdmin} = require("./middlewares/auth")

app.use("/admin",isAdmin)

app.get("/admin/getUsers",(req,res)=>{
    res.send("Users retreived");
})

app.listen(7777,()=>{
    console.log("server listening...")
});