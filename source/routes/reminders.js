const express = require('express')
const Reminder = require('../models/Reminder')
const {auth,authTroupeReminder} = require('../auth/authorize')

const router = new express.Router()

// Create Reminder (troupe should come from frontend)
router.post("/",auth, async(req,res)=>{

    const newReminder = new Reminder(req.body)

    
    try {
        await newReminder.save()
        res.status(201).send(newReminder)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

// All reminders of the troupes user is a part of
router.get("/", auth, async (req,res) => {

    try {
        const allReminders = await Reminder.find({})
        allReminders.filter((eachReminder)=>{
            return req.user.troupes.includes(eachReminder.ownerTroupe)
        })
        if (!req.user){
            return res.status(404).send("User not found")
        }
        res.send(allReminders)
    } catch (e) {
        res.status(500).send()
    }
})


// Get Reminder By ID
router.get("/one/:id",auth, async (req,res) => {
    const _id = req.params.id

    try {
        // const foundReminder = await Reminder.findById(_id)
        const foundReminder = await Reminder.findOne( { _id} )
        if (!foundReminder){
            return res.status(404).send()
        }
        console.log(foundReminder)
        res.send(foundReminder)
    } catch (e) {
        res.status(500).send()
    }
})


// All reminders of given troupes
router.get("/:id", auth, async (req,res) => {
    const troupeID = req.params.id
try {
    const myReminders = await Reminder.find({ownerTroupe:troupeID})

    if (!req.user){
        return res.status(404).send("User not found")
    }
    res.send(myReminders)
} catch (e) {
    res.status(500).send()
}
})


// Update Reminder
router.patch("/:id", auth, authTroupeReminder, async (req,res) => {
    try{

        const updatedReminder = await Reminder.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!updatedReminder){
            return res.status(404).send()
        }
                
        res.send(updatedReminder)
    } catch (e) {
        res.status(400).send(e)
    }

})

// Delete reminder
router.delete("/:id", auth, authTroupeReminder, async (req,res) => {
    try {
        const deletedReminder = await Reminder.findOneAndDelete({_id:req.params.id})
        if (!deletedReminder){
            return res.status(404).send()
        }
        res.send(deletedReminder)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router