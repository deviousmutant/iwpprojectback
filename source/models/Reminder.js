const mongoose = require("mongoose")

const reminderSchema = mongoose.Schema({

    description: {
        type: String,
        required: true,
        trim:true
    },
    dueDate: {
        type: Date,
        required: false
    },
    ownerTroupe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    
})

const Reminder = mongoose.model("Reminder",reminderSchema)

module.exports = Reminder