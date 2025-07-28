const express = require('express');

const router = express.router();

router.get("/profile", userAuth,async(req,res)=>{

    try{
    const user = req.user;
    res.send(user);
    }
    catch(err){
        res.status(404).send("User not found");
    }
        })

module.exports = router;