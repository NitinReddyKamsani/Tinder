const express = require('express');
const Requestrouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/User");

// Route 1: Basic test route
Requestrouter.post("/sendconnectionrequest", userAuth, (req, res) => {
    const user = req.user;
    res.send(`${user.firstName} sent you a connection request`);
});

// Route 2: Actual connection request logic
Requestrouter.post("/request/send/:status/:toid", userAuth, async (req, res) => {
    try {
        const fromId = req.user._id;
        const toId = req.params.toid;
        const status = req.params.status;

        // Validation 1: Check if user exists
        const toUser = await User.findById(toId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validation 2: Check for valid status
        const allowedUpdates = ["ignored", "interested"];
        if (!allowedUpdates.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Validation 3: Check for duplicate or reverse request
        const idExists = await ConnectionRequest.findOne({
            fromConnectionId: fromId,
            toConnectionId: toId
        });

        const reverseConnection = await ConnectionRequest.findOne({
            fromConnectionId: toId,
            toConnectionId: fromId
        });

        if (idExists) {
            return res.status(400).json({ message: "Request already sent" });
        }

        if (reverseConnection) {
            return res.status(400).json({ message: "You can't send an invite, please accept if interested" });
        }

        // Validation 4: Can't send request to self
        if (fromId.toString() === toId.toString()) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        // Create new request
        const request = new ConnectionRequest({
            fromConnectionId: fromId,
            toConnectionId: toId,
            status: status
        });

        const data = await request.save();

        if (status === "interested") {
            return res.json({
                message: "Request sent successfully",
                data,
            });
        } else if (status === "ignored") {
            return res.json({
                message: "User ignored you",
                data,
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }


});

Requestrouter.post("/request/review/:status/:id",userAuth,async(req,res)=>{

    try{

        const status = req.params;
        const fromId = req.user._id;
        const toId = req.params.id;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status");  
        }
        
        const user = await User.findOne({
            _id : fromId,
            id : toId,
            status : "interested",
        
        })
        if(!user){
            return res.status(404).send("User not found");
        }
        return res.send("Accepted the user request");

    }catch(err){
        throw new Error("Bad request");
    }

})

module.exports = Requestrouter;
