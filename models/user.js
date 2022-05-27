const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    mail: {
        type:String,
        required:true
    },
    first_name: {
        type:String,
        required:true
    },
    last_name: {
        type:String,
        required:true
    },
    birthday: {
        type:Date,
        required:true
    },
    martial_status: {
        type: String,
        required: true
    }
    });

module.exports = mongoose.model('user', userScheme);