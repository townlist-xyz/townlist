const { Client, Message, MessageEmbed} = require('discord.js');

module.exports.run = async (client,message,args) => {

        const embed = new MessageEmbed()
        .setTimestamp()
        .setTitle("**Server Information**")
        .setColor('2f3136')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField(`🎫 Server Name:`, message.guild.name, true)
        .addField(`🆔 Server ID`, message.guild.id, true)
        .addField(`👑 Owner`, message.guild.owner, true)  
        .addField(`🌎 Region `, message.guild.region, true)
        .addField(`👥 Members`, message.guild.members.cache.size, true)
        .addField(`🤖 Bots:`, message.guild.members.cache.filter(member => member.user.bot).size, true)
        .addField(`😗 Emojis:`, message.guild.emojis.cache.size, true)
        .addField(`👻 Animated Emojis:`,message.guild.emojis.cache.filter(emoji => emoji.animated).size,true )
        .addField(`💬 Total Text Channels:`, message.guild.channels.cache.filter(channel => channel.type === 'text').size, true)
        .addField(`🎤 Total Voice Channels:`, message.guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
        .addField(`👔 Total Roles:`, message.guild.roles.cache.size, true)
        .addField("⌚ Created at:", message.guild.createdAt, false)
        
        .setAuthor(`${message.guild.name}`)
        message.channel.send(embed);  
    }

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["si"],
  };
  
  exports.help = {
    name: "serverinfo",
    description: "",
    usage: ""
  };