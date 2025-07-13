const mongoose = require('mongoose');

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

    },
    password : {
        type : "String",
        required : true,
        unique : true

    },
    about : {
        type : "String",
        required : true,
        default : "User"
    },
    skills : {
        type : [String],
    },
    gender : {
        type :  "String",
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender")
            }
            else{
                console.log(value) ;
            }
        }
    }

},{
    timestamps : true
})

module.exports = mongoose.model("User", userSchema);