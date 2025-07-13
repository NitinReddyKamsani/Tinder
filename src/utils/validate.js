const validator = require("validator");

const validateSignUp = (req)=>{

    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Please enter every field");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }

}

module.exports = {
    validateSignUp,
}