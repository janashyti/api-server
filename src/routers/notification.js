const express = require('express') 
const router = express.Router() 
const mongoose = require('mongoose')
const Notification = require('../models/notification')
const auth = require('../middleware/auth')


router.post('/notification', auth, async (req, res) => { 
    const user = req.user
    console.log(req.body) 
    
    try {
        const group = new Notification({
            ...req.body,
            sender: user._id
        })

        await group.save()
        res.status(201).send()
    }
    catch (error) {
        console.log(error)
        res.status(400).send()
    }

}) 

module.exports = router