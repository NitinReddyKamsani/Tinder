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

module.exports =  {
    isAdmin
}