const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    troupes: [{
        type: String
    }]
},{
    "timestamps":true
})

module.exports = mongoose.model("User", userSchema);