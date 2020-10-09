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

// userSchema.pre("save", async function(next) {
//     const task = this
//     // console.log("this prints before saving")
//     const troupe = await Troupe.
//     if (user.isModified("password")) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }
    
//     next()

// })

const Task = mongoose.model("Task",taskSchema)

module.exports = Task