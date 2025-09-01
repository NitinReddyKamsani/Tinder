const express = require('express');
const connectDB = require("./config/database")
const User = require("./models/User")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const http = require('http');
const initializeSocket = require('./utils/socket');


app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));

require('dotenv').config()


app.use(express.json())
app.use(cookieParser())



const Authrouter = require("./routes/authRoute")
const Profilerouter = require("./routes/ProfileRoute")
const Requestrouter = require("./routes/requestRoute");
const Userrouter = require('./routes/userRoute');
const chatRouter = require('./routes/chatRoute');



app.use("/",Authrouter);
app.use("/",Profilerouter);
app.use("/",Requestrouter);
app.use("/",Userrouter);
app.use("/",chatRouter);

const server = http.createServer(app);

initializeSocket(server);

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
server.listen(7777,()=>{
    console.log("server listening on port 7777...")
});
}
)
.catch(err => console.log(err));



