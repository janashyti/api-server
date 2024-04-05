const mongoose = require('mongoose')
const NOTIFICATIONTYPE = require('./notificationtype')

const Schema = mongoose.Schema

const notificationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User'},
    receiver: { type: Schema.Types.ObjectId, ref: 'User'},
    subject: {type: String},
    body: {type: String},
    is_read: {type: Boolean},
    notification_type: {enum: NOTIFICATIONTYPE},
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