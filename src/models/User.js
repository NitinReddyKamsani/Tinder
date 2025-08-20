const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    age: {
      type: Number,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 30,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid Email");
        }
      }
    },
    password: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password : " + value);
        }
      }
    },
    about: {
      type: String,
      default: "User",
      maxLength: 200
    },
    skills: {
      type: [String],
      maxLength: 10
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      }
    },
    photo: {
      type: String,
      default: "https://example.com/default-profile.png"
    }
  }, {
    timestamps: true
  });
  
userSchema.methods.getJWT = async function () {

    const user = this;
    const token = await jwt.sign({ _id : user._id },"Nitin@29",{
        expiresIn : "7d"
    })

    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password,user.password);
    return isMatch;
}

module.exports = mongoose.model("User", userSchema);