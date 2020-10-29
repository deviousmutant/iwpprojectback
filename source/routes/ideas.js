const express = require("express")
const Idea = require("../models/Idea")
const {auth,authTroupeIdea} = require("../auth/authorize")

const multer = require("multer")
const sharp = require("sharp")


const router = new express.Router()

const thumbnail = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Upload Proper File"))
        }
        cb(undefined,true)
    }
})


// Create Idea (troupe should come from frontend)
router.post("/",auth, thumbnail.single("image"), async(req,res)=>{
    
    const newIdea = new Idea(req.body)

    try {
        const binaryEncodedDataOfImage = await sharp(req.file.buffer).resize({ height: 250, width: 250}).png().toBuffer()
        newIdea.image = binaryEncodedDataOfImage
        await newIdea.save()
        res.status(201).send(newIdea)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})


// All ideas of the troupes user is a part of
router.get("/", auth, async (req,res) => {

    try {
        const allIdeas = await Idea.find({})
        allIdeas.filter((eachIdea)=>{
            return req.user.troupes.includes(eachIdea.ownerTroupe)
        })
        if (!req.user){
            return res.status(404).send("User not found")
        }
        res.send(allIdeas)
    } catch (e) {
        res.status(500).send()
    }
})

// All ideas of given troupes
router.get("/:id", auth, async (req,res) => {
    const troupeID = req.params.id
try {
    const myIdeas = await Idea.find({ownerTroupe:troupeID})

    if (!req.user){
        return res.status(404).send("User not found")
    }
    res.send(myIdeas)
} catch (e) {
    res.status(500).send()
}
})

// Get Idea By ID
router.get("/one/:id",auth, async (req,res) => {
    const _id = req.params.id

    try {

        const foundIdea = await Idea.findOne( { _id} )
        if (!foundIdea){
            return res.status(404).send()
        }
        console.log(foundIdea)
        res.send(foundIdea)
    } catch (e) {
        res.status(500).send()
    }
})
// Update task
router.patch("/:id", auth, authTroupeIdea, async (req,res) => {
    try{

        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!updatedIdea){
            return res.status(404).send()
        }
                
        res.send(updatedIdea)
    } catch (e) {
        res.status(400).send(e)
    }

})

// Delete Idea
router.delete("/:id", auth, async (req,res) => {
    try {
        const deletedIdea = await Idea.findOneAndDelete({_id:req.params.id})
        if (!deletedIdea){
            return res.status(404).send()
        }
        res.send(deletedIdea)
    } catch (e) {
        res.status(500).send()
    }
})

// Get image

// Get Idea By ID
router.get("/image/:id",auth, async (req,res) => {
    const _id = req.params.id

    try {

        const foundIdea = await Idea.findOne( { _id} )
        if (!foundIdea || !foundIdea.image){
            return res.status(404).send()
        }

        res.set("Content-Type","image/png")
        res.send(foundIdea.image)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router