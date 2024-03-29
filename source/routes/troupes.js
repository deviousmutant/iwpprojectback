const router = require('express').Router();
const User = require('../models/User');
const Troupe = require('../models/Troupe');
const {auth} = require('../auth/authorize')
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
        req.user.troupes.push(newTroupe._id)
        await req.user.save()
        res.status(201).send(newTroupe)
    } catch (error) {
        res.status(400).send("Cannot Create Error")
    }
})

// Join an Existing Troupe
router.put("/join",auth,async (req,res)=>{
    try{
        // console.log(req.)
        const foundTroupe = await Troupe.findOne({troupeName:req.body.troupeName})
        // console.log(foundTroupe)
        foundTroupe["members"].push(req.user._id)
        req.user.troupes.push(foundTroupe._id)
        // console.log(foundTroupe)
        await foundTroupe.save()
        res.status(200).send(foundTroupe)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// Add a member to your troupe

router.patch("/add/:id",auth,async (req,res)=>{
    try{
        // console.log(req.)
        const foundTroupe = await Troupe.findOne({troupeName:req.body.troupeName})
        const findUser = await User.findOne({_id:req.params.id})
        // console.log(req.params.id)
        // console.log(findUser)
        foundTroupe["members"].push(findUser._id)
        findUser["troupes"].push(foundTroupe._id)
        // console.log(foundTroupe)
        await foundTroupe.save()
        await findUser.save()
        res.status(200).send({foundTroupe,addedUser:findUser})
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// View all troupes user is part of

router.get("/my-troupes", auth, async (req,res)=>{
    try{
        const allTroupes = await Troupe.find({})
        myTroupes = allTroupes.filter((troupe)=>{
            return troupe.members.includes(req.user._id)
        })
        console.log("myTroupes:"+myTroupes)

        if (!myTroupes){
            return res.status(404).send("You are not a part of any troupes")
        }
        res.send(myTroupes)
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
            return res.status(404).send("No Troupes Exist")
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

        const updateTroupe = await Troupe.findByIdAndUpdate(req.params.id,req.body,{ new: true})
        res.send(updateTroupe)
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})


module.exports = router