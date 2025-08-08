const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");
const Userrouter = express.Router();

Userrouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{

        const loggedIn = req.user;
        const user = await connectionRequest.find({
            toConnectionId : loggedIn._id,
            status : "interested",
        })
        .populate(["fromConnectionId"],"firstName lastName age skills about gender");
        res.json({message : "All the users appear here",user});
    }
    catch(err){
        throw new Error("No interests found");
    }
})

Userrouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedIn = req.user;
        const user = await connectionRequest.find({
          $or : [
            { toConnectionId : loggedIn._id,status : "accepted"},
            { fromConnectionId : loggedIn._id,status : "accepted"},
          ]
    }).populate("fromConnectionId","firstName lastName age skills about gender")
    .populate("toConnectionId","firstName lastName age skills about gender");


    const otherUsers = user.map((conn)=>{
        if(String(conn.fromConnectionId._id) === String(loggedIn._id)){
            return conn.toConnectionId;
        }
        else{
            return conn.fromConnectionId;
        }
    })

    res.json({message : "All the users appear here",otherUsers});

}
    catch(err){
        throw new Error("No connections found");
    }
})

Userrouter.get("/feed",userAuth,async(req,res)=>{

    try {
        const loggedIn = req.user;
      
        // Get all users
        const users = await User.find();
      
        // Filter out the logged-in user
        let feedUsers = users.filter(user => user._id.toString() !== loggedIn._id.toString());

        //find all the connected users
        const connections = await connectionRequest.find({

            $or : [{
                fromConnectionId : loggedIn._id,
                status : {$in : ["accepted","interested","ignored","rejected"]}
            },
            {
                toConnectionId : loggedIn._id,
                status : {$in : ["accepted","interested","ignored","rejected"]}
            }
        
        ]
        })

       const connectionSet = new Set();
       connections.forEach((conn)=>{

            connectionSet.add(String(conn.fromConnectionId._id));
            connectionSet.add(String(conn.toConnectionId._id));
        })
        feedUsers = feedUsers.filter(user=> !connectionSet.has(String(user._id)));
        res.json({message : "All the users appear here",feedUsers});
      
      } catch (err) {
        throw new Error("No users found");
      }

})

module.exports = Userrouter;