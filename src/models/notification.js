const mongoose = require('mongoose')
const NOTIFICATIONTYPE = require('./notificationtype')

const Schema = mongoose.Schema

const notificationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    subject: {type: String, required: true},
    body: {type: String, required: true},
    is_read: {type: Boolean, required: true},
    notification_type: {type: String, enum: NOTIFICATIONTYPE, required: true},
    study: { type: Schema.Types.ObjectId, ref: 'StudyGroup'}
})

notificationSchema.methods.toJSON = function () {
    const group = this
    const groupObject = group.toObject()

    delete groupObject.__v
    return groupObject
}

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification