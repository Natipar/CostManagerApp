const mongoose = require('mongoose');

const totalCostSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('totalCosts', totalCostSchema);