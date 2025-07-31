const express = require('express');
const Profilerouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateEdits } = require('../utils/validate');


Profilerouter.get("/profile/view", userAuth,async(req,res)=>{

    try{
    const user = req.user;
    res.send(user);
    }
    catch(err){
        res.status(404).send("User not found");
    }
        })

Profilerouter.patch("/profile/update", userAuth,async(req,res)=>{
    try{
       if(!validateEdits(req)){
        throw new Error("cant update your information");
       }
       else{
        const user = req.user;
        Object.keys(req.body).forEach((key)=> user[key]=req.body[key]);
        await user.save();
        res.send(`${user.firstName}, your profile has been updated`);
       }
    }
    catch(err){
        res.status(400).send(err.message);
    }

})
module.exports = Profilerouter;