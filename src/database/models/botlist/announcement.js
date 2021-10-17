const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    botID: String,
    date: Date,
    content: String,
    title: String,
    type: String
})
module.exports = mongoose.model('announce', schema)