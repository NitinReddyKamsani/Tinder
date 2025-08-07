const jwt = require('jsonwebtoken');
const User = require("../models/User");


const isAdmin = (req,res,next)=>{
    console.log("checking auth");

    const token = "xyz";
    const isAdminToken = token;
    if(isAdminToken !== token){
    
        res.status(401).send("Unauthorized admin")
    }
    else {
        next();
    }
};

const userAuth = async (req,res,next)=>{

    try{
           const {token} = req.cookies;
            if(!token){
                return res.status(401).send("invalid token");
            }

            const decodedMsg = await jwt.verify(token,"Nitin@29");
            const {_id} = decodedMsg;

            const user = await User.findById(_id);
            if(!user) {
                res.send("User not found");
            }
            
            req.user = user;
            next();          
}catch (err){
    res.send(err.message);
}
}
module.exports =  {
    isAdmin,
    userAuth
}