const jwt = require("jsonwebtoken")
const User = require("../models/User.js")


// The following function acts to authenticate a request from the client. The client will send the requesting user's login token (web token) as the 'authorization' header.
// This header has in it the token to be authorized. This authorization is done with jwt verify() and if it is verified, then the request is granted

const auth = async function (req,res,next) {

    try{
        const token = req.header("Authorization").replace("Bearer ","")

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne( { _id: decoded._id, "tokens.token":token })
        
        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send("Please authenticate")
    }
}

// const authTroupe = async function (req,res,next) {

//     try{
//         const token = req.header("Authorization").replace("Bearer ","")

//         const decoded = jwt.verify(token,process.env.JWT_SECRET)
//         const user = await Employee.findOne( { _id: decoded._id, "tokens.token":token })
        
//         if(!user) {
//             throw new Error()
//         }

//         req.token = token
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//         res.status(401).send("Please authenticate")
//     }
// }

module.exports = auth
