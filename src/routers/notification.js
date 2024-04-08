const express = require('express') 
const router = express.Router() 
const mongoose = require('mongoose')
const Notification = require('../models/notification')
const auth = require('../middleware/auth')
const User = require('../models/user')


router.post('/notification', auth, async (req, res) => { 
    const user = req.user 
    const receiverID = req.body.receiver
    let receiver = await User.findById(receiverID)
    try {
        const notification = new Notification({
            ...req.body,
            sender: user._id
        })
       
        await notification.save()
        let arr = []
        arr = receiver.notifications
        arr[0] = notification.id
        receiver.notifications = arr
        await receiver.save()
        console.log(receiver.notifications)
        //console.log(arr[0])
        res.status(201).send()
    }
    catch (error) {
        console.log(error)
        res.status(400).send()
    }

}) 

module.exports = router