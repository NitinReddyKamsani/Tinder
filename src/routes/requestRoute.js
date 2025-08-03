const express = require('express');
const Requestrouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

Requestrouter.post("/sendconnectionrequest", userAuth, (req,res)=>{

    const user = req.user;
    res.send(user.firstName + " sent you connection request" );
})

Requestrouter.post("/request/send/:status/:toid",userAuth,async(req,res)=>{
    try{
        const fromId = req.user._id;
        const toId = req.params.toid;
        const status = req.params.status;

        const allowedUpdates = ["ignored","interested"];
        if(!allowedUpdates.includes(status)){
            return res.status(400).json({message:"Invalid status"});
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
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = Requestrouter;