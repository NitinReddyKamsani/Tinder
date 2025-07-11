const express = require('express');

const connectDB = require("./config/database")

const User = require("./models/User")

const app = express();

app.use(express.json())


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

    const user = new User(req.body)

    await user.save();
    res.send("User details saved")
})

app.get("/users",async(req,res)=>{
   // const userEmail = req.body.email;

    try{

        console.log(userEmail)
        const user = await User.find({})
        res.send(user)
    }
    catch(err){

        res.status(404).send("User not found");
    }

})

app.delete("/users",async(req,res)=>{

    const Id = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(Id)
        res.send(user);
    }
    catch(err){

        res.status(404).send("User not found")

    }

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



