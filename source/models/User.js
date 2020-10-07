const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
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
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},{
    "timestamps":true
})



userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}



userSchema.methods.generateToken = async function () {
    const findUser = this
    const token = jwt.sign({ _id:findUser._id.toString(), troupes:findUser.troupes }, process.env.JWT_SECRET)
    
    // console.log(findUser)
    findUser.tokens = findUser.tokens.concat({ token })
    
    await findUser.save()
    return token

}


userSchema.statics.findByCredentials = async (email, password) => {
    const findUser = await User.findOne({ email })
    // console.log(findUser)
    if(!findUser) {
        throw new Error ("Login Error!")
    }
    const isMatch = await bcrypt.compare(password, findUser.password)

    if(!isMatch) {
        throw new Error("Login Error!")
    }
    return findUser

}

userSchema.pre("save", async function(next) {
    const user = this
    // console.log("this prints before saving")

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()

})

const User = mongoose.model("User", userSchema);
module.exports = User;