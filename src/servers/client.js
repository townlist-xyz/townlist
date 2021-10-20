  
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const { Client, Collection } = require("discord.js");
const emoji = require('../../emoji.json')
const serverClient = global.clientSL;
const db  = require("quick.db")
const config = global.config;
const fs = require("fs");
const { createCanvas } = require('canvas')
const { MessageButton } = require("discord-buttons");

require('discord-buttons')(serverClient);
serverClient.on('clickButton', async (button) => {
    if (button) button.defer(true);
});


require('events').EventEmitter.prototype._maxListeners = 100;
serverClient.commands = new Discord.Collection();
serverClient.aliases = new Discord.Collection();
fs.readdir("./src/servers/commands/", (err, files) => {
  if (err) console.error(err);
  console.log(`[disbots.xyz/servers]: ${files.length} command loaded.`);
  files.forEach(async f => {
    let props = require(`./commands/${f}`);
    serverClient.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      serverClient.aliases.set(alias, props.help.name);
    });
  });
});
let serverPrefix = config.bot.servers.prefix;
serverClient.on('message', async message => {
  
  if (message.author.bot) return;

  if (message.content.startsWith(serverPrefix)) {
  let command = message.content.split(' ')[0].slice(serverPrefix.length);
  let params = message.content.split(' ').slice(1);
  let cmd
    if (serverClient.commands.has(command)) {
        cmd = serverClient.commands.get(command);
    } else if (serverClient.aliases.has(command)) {
        cmd = serverClient.commands.get(serverClient.aliases.get(command));
    }
    if(cmd) cmd.run(serverClient, message, params);
    if(!cmd) return;
  }
})

serverClient.on('ready', async () => {
  console.log("[disbots.xyz/servers]: Bot successfully connected as " + serverClient.user.tag + ".");
  let serversdata = require("../../src/database/models/servers/server.js");
  const servers = await serversdata.find();
  serverClient.user.setPresence({ activity: { type: 'STREAMING', name: 's?help | ' + servers.length + ' servers' }, status: "STREAMING" });

      })
      

serverClient.on('interactionCreate', async (interaction) => {
    const wait = require('util').promisify(setTimeout);



if(["why"].some(ticket => ticket === interaction.customId)) {
interaction.reply({embeds:[why], ephemeral: true})
}

})

const support = new Discord.MessageEmbed()
.setTitle(`What's this?`)
.setDescription(`Do you want to contribute, suggest or even have concerns about our API package?\nIf so, we can help with that. We have support channel just for that topic.\n\nYou can **find the channel here** <#895371777155420160>`)
.setColor(`2f3136`)

serverClient.on('message', message => {
    if (message.content.startsWith('s?help')) {
 
     const embed = new MessageEmbed()
              
              
	.setColor('2f3136')
	.setTitle(`${emoji.pen} DTL Commands`)
   .addField(`${emoji.link} External Links` , `[All commands](https://townlist.xyz/commandlist) | [Support Server](https://discord.gg/townlist)`)
                .addField(`${emoji.search} Voting/Bumping Rules` , `Using \`external (alt)\` accounts to vote is against our rules.`)
	.setDescription(`> These are all the commands of DTL, if you find any bugs make sure to report them to our team.`)
  	.addField(`**link**`, `Detailed information about the server, also the server link on serverlist.`)
	.addField(`**bump**`, `Bump the server, every 60 minutes.`)
      	.addField(`**profile**`, `Shows your profile information, also shows your bots, servers if you own them.`)
              	.addField(`**vote**`, `Vote the server, every 60 minutes.`)
	.setTimestamp()
     .setFooter(
                    `Requested by ${message.author.tag}`,
                    message.author.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setThumbnail(serverClient.user.displayAvatarURL({
                    dynamic: true
                }))
          message.channel.send({ embed: embed, buttons: [ web, srvr ]})
    }
})


serverClient.on('message', message => {
    if (message.content.startsWith('$bump')) {
 
     const embed = new MessageEmbed()
              
              
	.setColor('2f3136')
	.setTitle(`${emoji.success} My prefix changed, from now on you can type \`s?bump\` and \`s?vote\`.`)
  
          message.channel.send(embed)
    }
})

serverClient.on('message', message => {
    if (message.content.startsWith('$vote')) {
 
     const embed = new MessageEmbed()
              
              
	.setColor('2f3136')
	.setTitle(`${emoji.success} My prefix has changed to \`s?\`, from now on you can type \`s?bump\` and \`s?vote\`.`)
  
          message.channel.send(embed)
    }
})

 let web = new MessageButton()
      .setEmoji(`888639435946745947`)
    .setLabel("See all commands")
    .setStyle("url")
    .setURL("https://townlist.xyz/commandlist")

     let srvr = new MessageButton()
      .setEmoji(`866734692120526868`)
    .setLabel("Support Server")
    .setStyle("url")
    .setURL("https://discord.gg/townlist")

serverClient.makeid = length => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

  

module.exports = serverClient;