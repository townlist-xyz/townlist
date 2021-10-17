const Discord = require("discord.js");
const Mongoose = require('mongoose')
const reminderSettings = Mongoose.model('reminderSettings', new Mongoose.Schema({
    guildID: String,
    type: String,
    channelID: String,
    roleID: String
}));
exports.run = async (client, message, args) => {
    if (!message.mentions.channels.first()) {
        return message.channel.send('Please use the proper comand format! \n ' + exports.help.usage)
    }
    if (args[2]) {
        let role = message.guild.roles.cache.find(r => r.id == args[2].toString());
        if (!role) return message.channel.send('Please use the proper comand format! \n ' + exports.help.usage)
    } else {
        return message.channel.send('Please use the proper comand format! \n ' + exports.help.usage)
    }
    if (!args[0] || args[0].toString().toLowerCase() !== "bump" || args[0].toString().toLowerCase() !== "vote") {
        return message.channel.send('Please use the proper comand format! \n ' + exports.help.usage)
    }
    const type = args[0].toLowerCase()=="bump" ? "Bump" : "Vote"
    reminderSettings.findOne({
        guildID: message.guild.id,
        type: type
    }, async (err, data) => {
        if (err) throw err;
        else {
            if (!data) {
                 data = await new awaitreminderSettings({
                    guildID: message.guild.id,
                    type: type,
                    channelID: message.mentions.channels.first().id,
                    roleID: args[2]
                })
                await data.save()
            } else if(data) {
                await reminderSettings.findOneAndUpdate({
                    guildID: message.guild.id,
                    type: type
                }, {
                    guildID: message.guild.id,
                    type: type,
                    channelID: message.mentions.channels.first().id,
                    roleID: args[2]
                })
            }
        }
    }
    )
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
};
exports.help = {
    name: 'set-reminder',
    description: '',
    usage: '<bump or vote> <channel mention> <role id>'
};