const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const Task = require("../models/Task.js")
const User = require("../models/User.js")
const Idea = require("../models/Idea.js")
const Reminder = require("../models/Reminder.js")



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

const authTroupeTask = async function (req,res,next) {

    try{
        console.log("task id:",req.params.id)
        console.log("req.user.troupes:"+req.user.troupes)
        const userTroupe = req.user.troupes
        console.log("userTroupe:",userTroupe)
        const taskTroupe = await Task.findById(req.params.id,'ownerTroupe')
        console.log("taskTroupe:",taskTroupe)
        if (!userTroupe.includes(taskTroupe.ownerTroupe.toString())){
            throw new Error("You cannot access this Task since you are not a part of its troupe")
        }
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send("You cannot access this Task since you are not a part of its troupe")
    }
}

const authTroupeIdea = async function (req,res,next) {

    try{
        // console.log("req.user:"+req.user)
        const userTroupe = req.user.troupes
        // console.log("userTroupe:",userTroupe)
        const ideaTroupe = await Idea.findById(req.params.id,'ownerTroupe')
        // console.log("ideaTroupe:",ideaTroupe)
        if (!userTroupe.includes(ideaTroupe.ownerTroupe.toString())){
            throw new Error()
        }
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send("You cannot access this Idea since you are not a part of its troupe")
    }
}

const authTroupeReminder = async function (req,res,next) {

    try{
        // console.log("reminder id:",req.params.id)
        // console.log("req.user.troupes:"+req.user.troupes)
        const userTroupe = req.user.troupes
        // console.log("userTroupe:",userTroupe)
        const reminderTroupe = await Reminder.findById(req.params.id)
        // console.log("reminderTroupe:",reminderTroupe)
        if (!userTroupe.includes(reminderTroupe.ownerTroupe.toString())){
            throw new Error()
        }
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send("You cannot access this Reminder since you are not a part of its troupe")
    }
}

module.exports = {
    auth,
    authTroupeTask,
    authTroupeIdea,
    authTroupeReminder
}
