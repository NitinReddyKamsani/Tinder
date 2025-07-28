const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/User")
const bcrypt = require("bcrypt")
const {validateSignUp} = require("./utils/validate")
const app = express();
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth")


app.use(express.json())
app.use(cookieParser())


const {isAdmin} = require("./middlewares/auth")

app.use("/admin",isAdmin)

//inserting a user dynmaically 

//login api 


//retreving the users
app.get("/admin/getUsers",(req,res)=>{

    try {
    res.send("Users retreived");

    }
    catch(err){
        res.status(500).send("Unexpected error occured");
    }
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

app.post("/sendconnectionrequest", userAuth, (req,res)=>{

    const user = req.user;
    res.send(user.firstName + " sent you connection request" );

}
)


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
app.patch("/users", async (req, res) => {
    const { userId, ...data } = req.body;

    const allowedUpdates = ["firstName", "lastName", "age", "password", "about", "skills", "gender"];
    const updateKeys = Object.keys(data);
    const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidUpdate) {
        return res.status(400).send({ error: "Invalid update fields" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.send({ message: "User updated successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Server error" });
    }
});

connectDB().then(()=>{
console.log("Database connected successfully")
app.listen(7777,()=>{
    console.log("server listening...")
});
}
)
.catch(err => console.log(err));



