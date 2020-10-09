const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({

    description: {
        type: String,
        required: true,
        trim:true
    },
    completed: {
        type: Boolean,
        required: false,
        default:false
    },
    createdDate: {
        type: Date,
        required: false,
    },
    completedDate: {
        type: Date,
        required: false
    },
    ownerTroupe: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Troupe'
    }
    
})

const Task = mongoose.model("Task",taskSchema)

module.exports = Task