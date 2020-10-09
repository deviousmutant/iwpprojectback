const router = require('express').Router();
const User = require('../models/User');
const {auth, authTroupeTask} = require('../auth/authorize')
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: false })

router.post("/register", urlencodedparser, async (req, res) => {
    const newUser = new User(req.body)
    try {
        const savedUser = await newUser.save();
        const token = await newUser.generateToken()

        res.status(201).send({newUser,token})
    } catch (error) {
        res.status(400).send("Cannot receive data")
    }
})

router.post("/signin", async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()

        res.status(200).send({user,token})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post("/logout", auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        
    } catch (e){
        res.status(500).send()
    }
})

router.patch("/me",auth,async (req,res) => {
    const update = Object.keys(req.body)
    
    try {
        update.forEach((updateField) => req.user[updateField] = req.body[updateField])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        send.status(400).send(e)
    }
})

router.delete("/me",auth,async (req,res)=>{
    try{
        await req.user.remove()
        res.send()
    } catch {
        res.status(400).send()
    }
})

module.exports = router;