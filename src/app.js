const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/User")
const bcrypt = require("bcrypt")
const {validateSignUp} = require("./utils/validate")
const app = express();

app.use(express.json())

const {isAdmin} = require("./middlewares/auth")

app.use("/admin",isAdmin)

//inserting a user dynmaically 
app.post("/signup",async(req,res)=>{
    try {
    
        //validating the data
        validateSignUp(req)

        //encrypting password
        const {firstName,lastName,email,age,about,skills,gender,password} = req.body;

        const passwordHash = awaitbcrypt.hash(password,10)
    
        const user = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            age,
            about,
            skills,
            gender
        })
    
        await user.save();
        res.send("User details saved")
    }
    catch(err){
        res.status(400).send(err.message)
    }
    })

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



