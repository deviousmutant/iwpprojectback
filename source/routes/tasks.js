const express = require("express")
const Task = require("../models/Task")
const {auth,authTroupeTask} = require("../auth/authorize")

const router = new express.Router()
// Create Task (troupe should come from frontend)
router.post("/tasks",auth, async(req,res)=>{
    const today = new Date()
    const newTask = new Task({
        ...req.body,
        createdDate:today 
    })
    
    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})
// All tasks of the troupes user is a part of
router.get("/tasks", auth, async (req,res) => {

    try {
        const allTasks = await Task.find({})
        allTasks.filter((eachTask)=>{
            return req.user.troupes.includes(eachTask.ownerTroupe)
        })
        if (!req.user){
            return res.status(404).send("User not found")
        }
        res.send(allTasks)
    } catch (e) {
        res.status(500).send()
    }
})

// All tasks of given troupes
router.get("/tasks/:id", auth, async (req,res) => {
        const troupeID = req.params.id
    try {
        const myTasks = await Task.find({ownerTroupe:troupeID})

        if (!req.user){
            return res.status(404).send("User not found")
        }
        res.send(myTasks)
    } catch (e) {
        res.status(500).send()
    }
})

// Get Task By ID
router.get("/tasks/one/:id",auth, async (req,res) => {
    const _id = req.params.id

    try {
        // const foundTask = await Task.findById(_id)
        const foundTask = await Task.findOne( { _id} )
        if (!foundTask){
            return res.status(404).send()
        }
        console.log(foundTask)
        res.send(foundTask)
    } catch (e) {
        res.status(500).send()
    }
})

// Update task
router.patch("/tasks/:id", auth, authTroupeTask, async (req,res) => {
    try{

        const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!updatedTask){
            return res.status(404).send()
        }
                
        res.send(updatedTask)
    } catch (e) {
        res.status(400).send(e)
    }

})

// Delete task
router.delete("/tasks/:id", auth, authTroupeTask, async (req,res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({_id:req.params.id})
        if (!deletedTask){
            return res.status(404).send()
        }
        res.send(deletedTask)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router