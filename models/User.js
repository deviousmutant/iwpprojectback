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
    troupes: {
        type: Array,
        required: false,
        max: 5,
    }
})

module.exports = mongoose.model("User", userSchema);