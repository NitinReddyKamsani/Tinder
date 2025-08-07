const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const Userrouter = express.Router();

Userrouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{

        const loggedIn = req.user;
        const user = await connectionRequest.find({
            toConnectionId : loggedIn._id,
            status : "interested",
        }).populate(["fromConnectionId"],"firstName lastName age skills about gender");
        res.json({message : "All the users appear here",user});
    }
    catch(err){
        throw new Error("No interests found");
    }
})

module.exports = Userrouter;