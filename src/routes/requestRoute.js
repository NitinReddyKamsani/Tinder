const express = require('express');
const Requestrouter = express.Router();
const {userAuth} = require('../middlewares/auth');

Requestrouter.post("/sendconnectionrequest", userAuth, (req,res)=>{

    const user = req.user;
    res.send(user.firstName + " sent you connection request" );

}
)

module.exports = Requestrouter;