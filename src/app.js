const express = require('express');

const connectDB = require("./config/database")

const User = require("./models/User")

const app = express();

app.use(express.json())


const {isAdmin} = require("./middlewares/auth")

app.use("/admin",isAdmin)

app.get("/admin/getUsers",(req,res)=>{

    try {
    res.send("Users retreived");

    }
    catch(err){
        res.status(500).send("Unexpected error occured");
    }
})

//inserting a user dynmaically 
app.post("/signup",async(req,res)=>{

    const user = new User(req.body)

    await user.save();
    res.send("User details saved")
})


//adding a user into db
app.post("/users",async(req,res)=>{

    const user = new User(req.body);

    await user.save();
    res.send("User added")
})

//fetching users
app.get("/users",async(req,res)=>{
   // const userEmail = req.body.email;
    try{
        const user = await User.find({})
        res.send(user)
    }
    catch(err){

        res.status(404).send("User not found");
    }

})

//deleting a user by id
app.delete("/users",async(req,res)=>{

    const Id = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(Id)
        res.send(user);
    }
    catch(err){
        res.status(404).send("User not found")
    }

})

//updating a user by id
app.patch("/users",async(req,res)=>{

    const userId = req.body.userId;
    const data = req.body;

    try {

        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument : "after", //give the details after perfoming the updtae
            runValidators : true
        })
        res.send("User updated successfully");
    }
    catch(err){
        res.status(404).send("User not found")

    }
})

connectDB().then(()=>{
console.log("Database connected successfully")
app.listen(7777,()=>{
    console.log("server listening...")
});
}
)
.catch(err => console.log(err));



