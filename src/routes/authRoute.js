const express = require('express');
const {validateSignUp} = require("../utils/validate")
const User = require('../models/User');
const bcrypt = require("bcrypt");
const Authrouter = express.Router();



Authrouter.post("/signup",async(req,res)=>{
    try {
    
        //validating the data
        validateSignUp(req)

        //encrypting password
        const {firstName,lastName,email,age,about,skills,gender,password} = req.body;

        const existingUser = await User.findOne({email})
        if(existingUser) {
            throw new Error("User already exists")
        }
        
        const passwordHash = await bcrypt.hash(password,10)
    
        const user = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            age,
            about,
            skills,
            gender
        })
    
        await user.save();
        res.send("User details saved")
    }
    catch(err){
        res.status(400).send(err.message)
    }
    })

    Authrouter.post("/login", async(req,res)=>{

        const {email,password}= req.body;
    
        const user = await User.findOne({email});
        if(!user) {
                throw new Error("Invalid email or password")
        }
        const isPasswordMatch = await user.validatePassword(password);
    
        if(isPasswordMatch) {
    
            //create JWT token
            const token = await user.getJWT();
        
            //send the token in the cookie
            res.cookie("token",token);
            res.send("Login successful");
           
        }
        else {
            throw new Error("Invalid password");
        }
    })

Authrouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now())
    })
    res.send("Logout successful");
})
    
module.exports = Authrouter;