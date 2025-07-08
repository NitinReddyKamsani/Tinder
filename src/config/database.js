const {uri} = require("../../constants")
const mongoose = require('mongoose');

async function connectDB() {

<<<<<<< HEAD
    await mongoose.connect("uri");
=======
    await mongoose.connect(uri);
>>>>>>> acf8be7 ( creating user schema and apis)
}

module.exports = connectDB
