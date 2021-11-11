/*=======================================================================================*/
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const { Client, Collection } = require("discord.js");
const client = (global.Client = new Client())
const config = require("./config.js");
global.config = config;
const disbots = require("disbots-xyz");
const fs = require("fs");
const emoji = require('./emoji.json')
client.htmll = require('cheerio');
const request = require("request");
let botsdata = require("./src/database/models/botlist/bots.js");
let profiledata = require("./src/database/models/profile.js");
const db = require("quick.db");
const ms = require("parse-ms");

const Mongoose = require("mongoose")

/*=======================================================================================*/
client.on("guildMemberAdd", member => {
   if (member.user.bot) return;
    member.roles.add('907496174813069374')
})

client.on("guildMemberAdd", async (member) => {
   if (member.user.bot) return;
    let WELCOME = new Discord.MessageEmbed()
        .setTitle(`${emoji.member} | Welcome`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`Hello **${member.user}**, welcome to the **official townlist** support server!\nRead our **rules** and make sure to get yourself some **roles** in <#893610026135076935>`)
        .addField(`__**Need Support?**__`, `If you need help, you can contact staff or ask your questions in support channels.\nTo make a ticket click here <#897151561854242906>.`)
        .setColor('2f3136')
        .setTimestamp()
        .setFooter(`© TownList | ${member.user.username}`)
    client.channels.cache.get('908068636177096714').send(WELCOME)
});

client.on("guildMemberAdd", async (member) => {
   if (member.user.bot) return;
    let WELCOME = new Discord.MessageEmbed()
      
     
        .setDescription(`${emoji.member} ${member.user.username} just joined, welcome.`)
        .setColor('2f3136')
        .setTimestamp()
        .setFooter('© TownList')
    client.channels.cache.get('908069830060548136').send(WELCOME)
});



client.on("guildMemberRemove", async (member) => {
    let BYE = new Discord.MessageEmbed()
        .setTitle(`${emoji.member} | Goodbye`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`**${member.user}** just left our server, goodluck.`)
        .setColor('2f3136')
        .setTimestamp()
        .setFooter('© TownList | Thanks for joining')
    client.channels.cache.get('908068636177096714').send(BYE)
});


/*=======================================================================================*/
require('events').EventEmitter.prototype._maxListeners = 100;
client.komutlar = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./src/commands", (err, files) => {
    if (err) console.error(err);
    console.log(`[disbots.xyz]: ${files.length} command loaded.`);
    files.forEach(f => {
        if (!f.endsWith('.js')) return
        let props = require(`./src/commands/${f}`);
        if (!props.help) return
        client.komutlar.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
            global.commands = files;
        });
    });
});
client.on('message', async message => {
    let p = config.bot.prefix
    let client = message.client;
    if (message.author.bot) return;
    if (!message.content.startsWith(p)) return;
    let command = message.content.split(" ")[0].slice(p.length);
    let params = message.content.split(" ").slice(1);
    let cmd
    if (client.komutlar.has(command)) {
        cmd = client.komutlar.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.komutlar.get(client.aliases.get(command));
    }
    if(cmd) {
        cmd.run(client, message, params, p);
    }
    if(!cmd) return;
})
/*=======================================================================================*/



/*=======================================================================================*/
const claudette = require("./src/database/models/uptime.js")
    setInterval(() => {
        claudette.find({}, function (err, docs) {
            if(err) console.log(err)
            if(!docs) return;
            docs.forEach(docs => {
                request(docs.link, async function(error, response, body) {
                  if(error) {
                    console.error(`${docs.link} has been deleted on uptime system.\nReason: Invalid domain so request failed.`);
                    await claudette.findOneAndDelete({ code: docs.code })
                  }
                });
            })
        })
    }, 60000)

client.on('guildMemberRemove', async member => {
    if(member.guild.id !== config.serverID) return
        claudette.find({ userID: member.id }, async function (err,docs) {
            await docs.forEach(async a => {
            await claudette.findOneAndDelete({ userID: member.id, code: a.code, server: a.server, link: a.link })
            })
        })
    })
/*=======================================================================================*/


/*=======================================================================================*/
const votes = require('./src/database/models/botlist/vote.js')
const votesServer = require('./src/database/models/servers/user.js')
client.on('ready', async () => {
        setInterval(async () => {
            let datalar = await votes.find()
            if(datalar.length > 0) {
            datalar.forEach(async a => {
                let süre = a.ms - (Date.now() - a.Date)
                if(süre > 0) return
                await votes.findOneAndDelete({ bot: a.bot, user: a.user })
            })
            }
        }, 1500000)
})
client.on('ready', async () => {
        setInterval(async () => {
            let voteServer = await votesServer.find()
            if(voteServer.length > 0) {
            voteServer.forEach(async a => {
                let süre = 1800000 - (Date.now() - a.date)
                if(süre > 0) return
                await votesServer.findOneAndDelete({ guild: a.guild, id: a.id, date: a.date })
            })
            }
        }, 300000)
})
/*=======================================================================================*/



/*=======================================================================================*/
client.on('guildMemberRemove', async member => {
    const botlar = require('./src/database/models/botlist/bots.js')
    const serverlar = require('./src/database/models/servers/server.js')
    let data = await botlar.findOne({ ownerID: member.id })
    let serverdata = await serverlar.findOne({ ownerID: member.id })
    if(!data) return
    let find = await botlar.find({ ownerID: member.id })
    client.guilds.fetch(config.server.id).then(bota => {
      client.channels.cache.get(config.server.channels.botlog).send(`${emoji.error} <@${data.ownerID}>'s bot **${bota.username}** has been kicked from server and deleted from website \nReason: Owner left server`)
    });
    await find.forEach(async b => {
        member.guild.members.cache.get(b.botID).kick();
        await botlar.deleteOne({ botID: b.botID })
    })
    if(!serverdata) return
    let serverfind = await serverdata.find({ ownerID: member.id })
    client.guilds.fetch(config.server.id).then(bota => {
      client.channels.cache.get(config.server.channels.botlog).send(`${emoji.error} <@${serverfind.ownerID}>'s server **${serverfind.name}** has been deleted from website \nReason: Owner left server`)
    });
    await serverfind.forEach(async b => {
        await serverfind.deleteOne({ id: b.id })
    });
})
client.on("guildMemberAdd", async (member) => {
  let guild = client.guilds.cache.get(config.server.id);
  if (member.user.bot) {
    try {
      guild.member(member.id).roles.add(config.server.roles.botlist.bot);
    } catch (error) {
      
    }
  }
});
/*=======================================================================================*/


/*
    SERVER LIST CLIENT 
*/
const serverClient = new Client();
serverClient.login(config.bot.servers.token);
global.clientSL = serverClient;
require("./src/servers/client.js");


/*=======================================================================================*/
require("./src/server.js")(client);
require("./src/database/connect.js")(client);

client.login(config.bot.token);
client.on('ready',async () => {
    console.log("[disbots.xyz]: Bot successfully connected as "+client.user.tag+".");
    let botsSchema = require("./src/database/models/botlist/bots.js");
    const bots = await botsSchema.find();
    client.user.setPresence({ activity: { type: 'WATCHING', name: 'townlist.xyz | '+bots.length+' bots' }, status: "online" });
});


client.on('message', message => {
    if (message.content.startsWith('d!help')) {
      message.channel.send(new MessageEmbed()
	.setColor('2f3136')
	.setTitle(`${emoji.pen} DTL Commandlist`)
	.setURL('https://townlist.xyz/commandlist')
  .addField(`${emoji.link} Navigation Links`, `[Website](https://townlist.xyz) | [Servers](https://townlist.xyz/servers) | [Developers API](https://www.npmjs.com/package/listing-discordtownshop-js)`)
	.setDescription(`> Discord town list is a fast developing **botlist/serverlist** expanding everyday.\n> We welcome anyone on this listing service!\n> **Thanks** for using DTL!`)

  	.addField(`botinfo`, `Shows a detailed information of a bot, must be on the botlist.`, true)
    
	.addField(`bots`, `Shows all the bots on the list, only approved ones.`, true)
  
  	.addField(`ping`, `Bot's MS Ping.`, true)
      	.addField(`topvoted`, `Bots with the most votes will be displayed.`, true)
              	.addField(`help`, `Show this embed.`, true)
	.setTimestamp()
    .setImage(`https://cdn.discordapp.com/attachments/897174637803343934/898622141195509831/info1.jpg`)
	.setFooter('Discord Town List')
      )
    }
})


client.on('message', message => {
    if (message.content.startsWith('~')) {
      message.delete()
      message.channel.send(new MessageEmbed()
	.setColor('2f3136')
  .setTitle(`Town List`)
  .addField(`__**Information**__`, `Town List is an **expanding** listing service made for bot developers and even server owners.\nWe help everyone grow their bots and servers with our listing service, we keep our word!\nWe have active support team, rewards for reaching votes and even our own API.\nDTL was founded by desixred at \`06/12/2021\``)
  .addField(`__**Links**__`, `• Website - [Link](https://townlist.xyz)\n• Bots - [Link](https://townlist.xyz/servers)\n• Servers - [Link](https://townlist.xyz/servers)\n• Add your Bot - [Link](https://townlist.xyz/addbot)\n• Add your server - [Link](https://townlist.xyz/server/add)\n• NPM API - [Link](https://www.npmjs.com/package/listing-discordtownshop-js)\n• Status - [Link](https://docs.townlist.xyz/)\n• API Docs - [Link](https://townlist.xyz/status)\n`)
.setTimestamp()
.setFooter(`Discord Listing Service`))
    }})




client.on('message', message => {
    if (message.content.startsWith('~')) {
      message.delete()
      message.channel.send(new MessageEmbed()
	.setColor('2f3136')
	.setImage(`https://cdn.discordapp.com/attachments/897174637803343934/898622141195509831/info1.jpg`)
  )
    }
})
/*=======================================================================================*/

/* RESET DATA'S EVERY MONTHS */

// BOT/SERVER VOTES & ANALYTICS
const {
    CronJob
} = require('cron')
const botlar = require('./src/database/models/botlist/bots.js')
const servers = require('./src/database/models/servers/server.js')
client.on('ready', async () => {
    var resetStats = new CronJob('00 00 1 * *', async function() {
        let x = await botlar.find()
        await x.forEach(async a => {
            await botlar.findOneAndUpdate({
                botID: a.botID
            }, {
                $set: {
                    votes: 0,
                    analytics_invites: 0,
                    analytics_visitors: 0,
                    country: {},
                    analytics: {}
                }
            })
        })
        let sunucular = await servers.find()
        await sunucular.forEach(async a => {
            await servers.findOneAndUpdate({
                id: a.id
            }, {
                $set: {
                    votes: 0,
                    bumps: 0,
                    analytics_joins: 0,
                    analytics_visitors: 0,
                    country: {},
                    analytics: {}
                }
            })
        })
    }, null, true, 'Europe/Istanbul');
    resetStats.start();
})