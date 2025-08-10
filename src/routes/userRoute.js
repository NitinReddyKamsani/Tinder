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

Userrouter.get("/feed", userAuth, async (req, res) => {
    try {
      const loggedIn = req.user;
  
      const connections = await connectionRequest.find({
        $or : [
          {fromConnectionId : loggedIn._id},
          {toConnectionId : loggedIn._id}
        ]
      })

      const hideUsers = new Set();
      connections.forEach((req)=>{
        hideUsers.add(String(req.fromConnectionId));
        hideUsers.add(String(req.toConnectionId));
      
      })

      const users = await User.find({

        $and : [
        {_id : {$nin : Array.from(hideUsers)}},
        {_id : {$ne : loggedIn._id}}

       ]

      }).select("firstName lastName age skills about gender");
    
      res.json({ message: "All the users appear here", users });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "No users found" });
    }
  });
  
module.exports = Userrouter;