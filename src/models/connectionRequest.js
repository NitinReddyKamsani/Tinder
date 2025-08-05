const mongoose = require('mongoose');

const ConnectionRequest = new mongoose.Schema({

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
            values : ["ignored","interested","accepted","rejected"],
            message : `{values} is not supported`,
        }
    },
    
},
{
    timestamps : true
})

module.exports = mongoose.model("ConnectionRequest",ConnectionRequest);