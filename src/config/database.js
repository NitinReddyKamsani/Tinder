
const mongoose = require('mongoose');

async function connectDB() {

    await mongoose.connect("mongodb+srv://kamsaninitinreddy:nitin29@node.leaz4bj.mongodb.net/devTinder");
}

module.exports = connectDB
