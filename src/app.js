const express = require('express');

const app = express();

const {isAdmin} = require("./middlewares/auth")

app.use("/admin",isAdmin)

app.get("/admin/getUsers",(req,res)=>{

    try {

    throw new error("hfief")
    res.send("Users retreived");

    }
    catch(err){
        res.status(500).send("Unexpected error occured");
    }
})

app.listen(7777,()=>{
    console.log("server listening...")
});