const {uri} = require("../../constants")
const mongoose = require('mongoose');

async function connectDB() {

    await mongoose.connect("uri");
}

module.exports = connectDB
