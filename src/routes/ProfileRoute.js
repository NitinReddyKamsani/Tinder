const express = require('express');
const Profilerouter = express.Router();
const {userAuth} = require('../middlewares/auth');


Profilerouter.get("/profile", userAuth,async(req,res)=>{

    try{
    const user = req.user;
    res.send(user);
    }
    catch(err){
        res.status(404).send("User not found");
    }
        })

module.exports = Profilerouter;