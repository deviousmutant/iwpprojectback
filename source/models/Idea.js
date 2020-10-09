const mongoose = require("mongoose")

const ideaSchema = mongoose.Schema({

    description: {
        type: String,
        required: true,
        trim:true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer,
        required: false
    },
    ownerTroupe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    
})



ideaSchema.methods.toJSON = function () {
    const idea = this
    const ideaObject = idea.toObject()

    delete ideaObject.image

    return ideaObject
}
const Idea = mongoose.model("Idea",ideaSchema)

module.exports = Idea