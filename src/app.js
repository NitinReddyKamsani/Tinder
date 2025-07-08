const express = require('express');

const connectDB = require("./config/database")

const User = require("./models/User")

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

app.post("/signup",async(req,res)=>{

    const user = new User({

        firstName : "Nitin Reddy",
        lastName : "Kamsani",
        email : "xyz@gmail.com",
        password : "xyz",

    })

    await user.save();
    res.send("User details saved")
}
)



connectDB().then(()=>{
console.log("Database connected successfully")
app.listen(7777,()=>{
    console.log("server listening...")
});
}
)
.catch(err => console.log(err));



