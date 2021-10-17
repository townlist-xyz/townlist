const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageButton } = require("discord-buttons");
const { MessageEmbed } = require('discord.js')
const bots = require("../../database/models/servers/server.js");

module.exports.run = async (client, message, args) => {
  if (args[0]) {
    let b = await bots.findOne({
      id: args[0]
    });
    const targetGuild = client.guilds.cache.get(b.id)
    if (!b) return message.channel.send("This server was not added to our website.\nAdd server [here](https://townlist.xyz/server/add).")
    let invitelink = b.link ? " [Join Server](" + b.link + ")" : "";
    const embed = new Discord.MessageEmbed()
      .setThumbnail(b.icon)
      .setAuthor(`${b.name} | ${b.id}`)
      .setDescription(b.shortDesc)
      .addField("ID", b.id, true)
      .addField("Server Name", b.name, true)
      .addField("Votes", b.votes, true)
      .addField("Bumps", b.bumps, true)
      .addField("Member Count", client.guilds.cache.get(args[0]).memberCount
        , true)
      .addField("Emoji Count", client.guilds.cache.get(args[0]).emojis.cache.size
        , true)
      .setColor("#2f3136")
      .addField("Owner(s)", `<@${b.ownerID}>\n${coowner.replace("<@>", "")}`, true)
      .addField("Invite Link:", `${invitelink || "No Server Invite"}`, true)

    message.channel.send(embed)
  }
  if (!args[0]) {
    let b = await bots.findOne({
      id: message.guild.id
    });
    if (!b) return message.channel.send(new MessageEmbed()
  .setTitle(`Server not found`)
  .setDescription(`This server was not found in our list.\nAdd your server [here](https://townlist.xyz/server/add)`)
  .setColor('2f3136')
  )
    const targetGuild = client.guilds.cache.get(b.id)
    let invitelink = b.link ? " [Join Server](" + b.link + ")" : "";
    const embed = new Discord.MessageEmbed()
      .setThumbnail(b.icon)
      .setAuthor(`${b.name} | ${b.id}`)
      .setDescription(b.shortDesc)
      .addField("ID", b.id, true)
      .addField("Server Name", b.name, true)
      .addField("Votes", b.votes, true)
      .addField("Bumps", b.bumps, true)
      .addField("Member Count", client.guilds.cache.get(message.guild.id).memberCount
        , true)
      .addField("Emoji Count", client.guilds.cache.get(message.guild.id).emojis.cache.size
        , true)
      .setColor("#2f3136")
      .addField("Owner(s)", `<@${b.ownerID}>`, true)
      .addField("Invite Link:", `${invitelink || "No Server Invite"}`, true)
  let web = new MessageButton()
      .setEmoji(`888639435946745947`)
    .setLabel("Visit server page")
    .setStyle("url")
    .setURL("https://townlist.xyz/server/"+message.guild.id)

 message.channel.send({ embed: embed, buttons: [ web ]})
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["l"],
};

exports.help = {
  name: "link",
  description: "Sends the link of server",
  usage: ""
};