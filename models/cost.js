const mongoose = require('mongoose');

const costScheme = new mongoose.Schema({
    mail: {
        type:String,
        required:true
    },
    category: {
        type:String,
        required:true
    },
    cost: {
        type:Number,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default: Date.now()
    }
});

module.exports = mongoose.model('cost', costScheme);