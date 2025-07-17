const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    
    firstName : {
        type : "String",
        required : true
    },
    lastName : {
        type : "String",
        
    },
    age : {
        type : "Number",
        min : 18,
        required : true
    },
    email : {
        type : "String",
        required : true,
        unique : true,
        maxLength : 30,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid Email")
            }
        }
    },
    password : {
        type : "String",
        required : true,
        unique : true,
        validate(value){

            if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password : "  +  value)
            }
        }

    },
    about : {
        type : "String",
        required : true,
        default : "User",
        maxLength : 200,
    },
    skills : {
        type : [String],
        maxLength : 10
    },
    gender : {
        type :  "String",
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender")
            }
        }
    }

},{
    timestamps : true 
})

module.exports = mongoose.model("User", userSchema);