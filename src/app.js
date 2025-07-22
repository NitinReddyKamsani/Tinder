const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/User")
const bcrypt = require("bcrypt")
const {validateSignUp} = require("./utils/validate")
const app = express();
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');

app.use(express.json())
app.use(cookieParser())


const {isAdmin} = require("./middlewares/auth")

app.use("/admin",isAdmin)

//inserting a user dynmaically 
app.post("/signup",async(req,res)=>{
    try {
    
        //validating the data
        validateSignUp(req)

        //encrypting password
        const {firstName,lastName,email,age,about,skills,gender,password} = req.body;

        const existingUser = await User.findOne({email})
        if(existingUser) {
            throw new Error("User already exists")
        }
        
        const passwordHash = await bcrypt.hash(password,10)
    
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

//login api 
app.post("/login", async(req,res)=>{

    const {email,password}= req.body;

    const user = await User.findOne({email});
    if(!user) {
            throw new Error("Invalid email or password")
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password);

    if(isPasswordMatch) {

        //create JWT token
        const token = await jwt.sign({_id : user._id},"Nitin@29");
    
        //send the token in the cookie
        res.cookie("token",token);
        res.send("Login successful");
       
    }
    else {
        throw new Error("Invalid password");
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


app.get("/profile", async(req,res)=>{

    const cookies = req.cookies;

    const {token} = cookies;

    const decoded = await jwt.verify(token,"Nitin@29");

    const {_id} = decoded;

    const user = await User.findById(_id);
    if(!token){
        res.send("Invalid token");
    }

    res.send(user);
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



