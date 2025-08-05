const express = require('express');
const Requestrouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/User")

Requestrouter.post("/sendconnectionrequest", userAuth, (req,res)=>{

    const user = req.user;
    res.send(user.firstName + " sent you connection request" );
})

Requestrouter.post("/request/send/:status/:toid",userAuth,async(req,res)=>{
    try{
        const fromId = req.user._id;
        const toId = req.params.toid;
        const status = req.params.status;

        const toUser = await User.findById(toId);
        if(!toUser){
            res.status(404).json({message:"User not found"});
        }

        const allowedUpdates = ["ignored","interested"];
        if(!allowedUpdates.includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }
        const idExists = await ConnectionRequest.findOne({
            fromConnectionId : fromId,
            toConnectionId : toId
        })
        const reverseConection = await ConnectionRequest.findOne({
            fromConnectionId : toId,
            toConnectionId : fromId
        })
        if(idExists) {
            return res.status(400).json({message:"Request already sent"})
        }
        if(reverseConection){
            return res.status(400).json({message:"You cant send invite,please accept if interested"});
        }

        const Request = new ConnectionRequest({

            fromConnectionId : fromId,
            toConnectionId : toId,
            status : status
        })
        const data = await Request.save();
        res.json({
            message : "Request sent succesfully",
            data,
        })

        ConnectionRequest.pre("save",function(){
            if(ConnectionRequest.fromConnectionId.equals(ConnectionRequest.toConnectionId)){
                throw new Error("You cant send request to yourself");
            }
            next();
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = Requestrouter;