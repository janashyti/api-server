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
        arr.push(notification.id) 
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


router.get('/notification/:id', auth, async (req, res) => {
    let userID = req.params.id
    let user
    
    if (!mongoose.isValidObjectId(userID)) {
      res.status(400).send("Invalid object id")
      return
    }
    try {
      user = await User.findById(userID)
      if (!user) {
        res.status(400).send('Invalid study group id')
        return
      }
    }
    catch (e) {
      console.log(e)
      res.status(500).send('Error finding study group')
      return
    }
  
    try {
      const notificationArray = user.notifications
      console.log(notificationArray)
      console.log(notificationArray[0])
      const results = []
      for(let i = 0; i < notificationArray.length; i++){
        results[i] = await Notification.findById(notificationArray[i])
      }
      
      console.log(results)
      res.send(results)
    } catch (e) {
      console.log(e)
      res.status(500).send()
    }
  
})  

module.exports = router