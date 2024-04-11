const auth = require('../middleware/auth')
const { sendVerificationEmail } = require('../emails/account.js')
const express = require('express')
const User = require('../models/user')
const StudyGroup = require('../models/studygroup')
const mongoose = require('mongoose')

const router = new express.Router()


// Add a new user
router.post('/user', async (req, res) => {
  delete req.body.email_verified
  delete req.body.tokens
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()

    sendVerificationEmail(user.email, user.username, token)
    res.status(201).send(user)
  }
  catch (error) {
    res.status(400).send(error)
  }
})


router.get('/user/verification', auth, async (req, res) => {
  const user = req.user
  const token = req.token

  console.log(user)
  console.log(token)

  user.email_verified = true
  user.save()

  res.send()
})



router.post('/user/login', async (req, res) => {
  try {
    console.log(req.body.email)
    console.log(req.body.password)

    const user = await User.findByCredentials(req.body.email, req.body.password)
    console.log(user)

    if (user.email_verified === true) {
      const token = await user.generateAuthToken()
      res.status(200).send({ user, token })
    }
    else {
      res.status(401).send("Email has not been verified.")
    }
  }
  catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

router.patch('/user/logout', auth, async (req, res) => {
  const user = req.user

  try {
    user.tokens = user.tokens.filter((token) => {
      return token !== req.token
    })
    await user.save()

    res.send()
  }
  catch (e) {
    res.status(500).send()
  }
})

router.get('/user/:id', auth, async (req, res) => {
  const studyGroupID = req.params.id
  let studygroup = undefined
  if (!mongoose.isValidObjectId(studyGroupID)) {
    res.status(400).send("Invalid object id")
    return
  }
  try {
    studygroup = await StudyGroup.findById(studyGroupID)
    if (!studygroup) {
      res.status(400).send('Invalid study group id')
      return
    }
  }
  catch (e) {
    console.log(e)
    res.status(500).send('Error finding study group')
    return
  }
  
  let participants = []
  participants = studygroup.participants
  console.log("participants: " + participants)
  console.log("studygroup" + studygroup)

  try {
    const results = []
    for(let i = 0; i < participants.length; i++){
    results[i] = await User.findById(participants[i])
    console.log(results[i])
    delete results[i]._id
    }
    console.log(results)
    res.send(results)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }


})

router.get('/user/owner/:id', auth, async (req, res) => {
  const ownerID = req.params.id
  let owner = undefined
  
  if (!mongoose.isValidObjectId(ownerID)) {
    res.status(400).send("Invalid object id")
    return
  }
  try {
    owner = await User.findById(ownerID)
    if (!owner) {
      res.status(400).send('Invalid study group id')
      return
    }
  }
  catch (e) {
    console.log(e)
    res.status(500).send('Error finding study group')
    return
  }
  
  let groupowner = owner
  console.log(groupowner)

  try {
    const results = groupowner
    
    console.log(results)
    res.send(results)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }


})

module.exports = router