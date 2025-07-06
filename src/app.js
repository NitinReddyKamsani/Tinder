const express = require('express');

const app = express();

app.use("/user",(req,res,next)=>{
    res.send("User 1");
    next();
},

    (req,res) => {
        res.send("User 2")
    }
)

app.listen(7777,()=>{
    console.log("server listening...")
});