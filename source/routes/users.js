const router = require('express').Router();
const User = require('../models/User');
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: false })

router.post("/register", urlencodedparser, async (req, res) => {
    const newUser = new User(req.body)
    try {
        const savedUser = await newUser.save();
        res.status(201).send(newUser)
    } catch (error) {
        res.status(400).send("Cannot receive data")
    }
})

module.exports = router;