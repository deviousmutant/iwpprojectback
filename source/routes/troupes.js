const router = require('express').Router();
const User = require('../models/User');
const Troupe = require('../models/Troupe');
const auth = require('../auth/authorize')
const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false })


// Create A Troupe
router.post("/create", urlencodedparser,auth, async (req, res) => {
    const newTroupe = new Troupe({
        ...req.body,
        members:[req.user.id]
    })
    try {
        await newTroupe.save();

        res.status(201).send(newTroupe)
    } catch (error) {
        res.status(400).send("Cannot receive data")
    }
})

// Join an Existing Troupe
router.put("/join",auth,async (req,res)=>{
    try{
        // console.log(req.)
        const foundTroupe = await Troupe.findOne({troupeName:req.body.troupeName})
        // console.log(foundTroupe)
        foundTroupe["members"].push(req.user._id)
        // console.log(foundTroupe)
        await foundTroupe.save()
        res.status(200).send(foundTroupe)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// View all existing troupes
router.get("/all",async (req,res)=>{
    try {
        const allTroupes = await Troupe.find({})
        if (!allTroupes){
            return res.status(404).send("No Troupes Exist in your Scope")
        }
        res.send(allTroupes)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

// Update Troupes by ID

router.patch("/:id",auth, async (req,res) => {
    try{
        // Check if the user is part of the troupe he is trying to update
        const findTroupe = await Troupe.findOne({_id:req.params.id})
        if(!findTroupe["members"].includes(req.user._id)){
            return res.status(401).send("You are not a member of this troupe")
        }
        
        const updateTroupe = await Troupe.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true})
        res.send(updateTroupe)
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})


module.exports = router