const Mongoose = require('mongoose')
const reminderSettings = new Mongoose.Schema({
    guildID: String,
    type: String,
    channelID: String,
    roleID: String
});
module.exports = Mongoose.model('reminderSettings', reminderSettings)