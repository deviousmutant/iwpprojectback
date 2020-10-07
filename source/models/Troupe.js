const mongoose = require("mongoose")

const troupeSchema = mongoose.Schema({

    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
    
}, {
    timestamps: true
})

const Troupe = mongoose.model("Troupe",TroupeSchema)

module.exports = Troupe