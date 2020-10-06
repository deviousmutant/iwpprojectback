const router = require('express').Router();
const User = require('../models/User');
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: false })

router.post("/register", urlencodedparser, async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const savedUser = await newUser.save();
        res.status(201).send("Success!")
        console.log(savedUser);
    } catch (error) {
        res.status(400).send("Cannot receive data")
    }
})

module.exports = router;