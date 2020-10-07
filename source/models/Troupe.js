const mongoose = require("mongoose")

const troupeSchema = mongoose.Schema({
    troupeName:{
        type:String,
        required:true,
        unique:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
    
}, {
    timestamps: true
})

const Troupe = mongoose.model("Troupe",troupeSchema)

module.exports = Troupe