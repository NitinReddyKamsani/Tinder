const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema({

    fromConnectionId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toConnectionId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status :{
        type : String,
        required : true,
        enum : {
            values : ["ignore","interested","accepted","rejected"],
            message : `${values} is not supported`,
        }
    },
    
},
{
    timestamps : true
})