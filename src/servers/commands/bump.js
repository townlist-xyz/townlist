const Discord = require("discord.js");
const { MessageButton } = require("discord-buttons");
const emoji = require('../../../emoji.json')
const { MessageEmbed } = require('discord.js')
const { registerFont, createCanvas } = require('canvas');
const serverData = require("../../database/models/servers/server.js");
exports.run = async (client, message, args) => {
	let findServer = await serverData.findOne({ id: message.guild.id });
	if(!findServer) return message.channel.send(new MessageEmbed()
  .setTitle(`Server not found`)
  .setDescription(`This server was not found in our list.\nAdd your server [here](https://townlist.xyz/server/add)`)
  .setColor('2f3136')
  )

let cooldown = 1800000;
  	let lastDaily = findServer.bump;
  	if (cooldown - (Date.now() - lastDaily) > 0) {
    	return await msgError('This command is used only once every 30 minutes.', { channel: message.channel });
    let timeObj = ms(cooldown - (Date.now() - lastDaily)); 
	} else {
    let kod1 = client.makeid(6);
    let kod2 = client.makeid(6);
    let kod3 = client.makeid(6);
    const width = 400
    const height = 125
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    await registerFont('src/fonts/font.ttf', { family: 'Disbots' })
    context.fillRect(0, 0, width, height)
    context.font = 'bold 60pt Disbots'
    context.textAlign = 'center'
    context.fillStyle = '#fff'
    context.fillText(kod1, 200, 90)
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'captcha.png'); 
    let sorgu = new MessageButton()
    .setLabel(kod1)
    .setStyle("blurple")
    .setID(kod1)
    let sorgu2 = new MessageButton()
    .setLabel(kod2)
    .setStyle("blurple")
    .setID(kod2)
    let sorgu3 = new MessageButton()
    .setLabel(kod3)
    .setStyle("blurple")
    .setID(kod3)
    

    let web = new MessageButton()
    .setLabel("Visit server page")
    .setStyle("url")
    .setURL("https://townlist.xyz/server/"+message.guild.id)

    const incorrectButton = new Discord.MessageEmbed()
	.setTitle(`${emoji.error} Sorry, the operation was canceled because you clicked the wrong code.`)
	.setColor("2f3136")
	.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
	const correctButton = new Discord.MessageEmbed()
	.setTitle(`${emoji.success} Successful Operation`)
  .setDescription(`You have successfully bumped **${message.guild.name}**, therefore your server will be bumped on our list and your server will be on the top.`)
  .setImage(`https://cdn.discordapp.com/attachments/897174637803343934/904078461184905256/Rectangle_3bumpedups.png`)
	.setColor("2f3136")
	.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
    const controlEmbed = new Discord.MessageEmbed()
    .setTitle("Select the matching button")
    .setColor("2f3136")
    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
    .attachFiles(attachment)
    .setImage('attachment://captcha.png')
    .setDescription("Select whichever of the buttons below matches the code and it will perform the operation, this operation will be canceled after **60** seconds.");

    message.channel.send({ embed: controlEmbed, buttons: [ sorgu, sorgu2, sorgu3 ].sort(() => Math.random()-0.5) }).then(async msg => {
		const filter = (button) => button.clicker.user.id === message.author.id;
		const collector = await msg.createButtonCollector(filter, { time: 60000 });
		  collector.on('collect', async b => {
		    if(b.id == kod1) {
            let findServerr = await serverData.findOne({ id: message.guild.id });
            let lastDailyy = findServerr.bump;
            if (cooldown - (Date.now() - lastDailyy) > 0)return msg.delete().then(await msgError('This command is used only once every 30 minutes.', { channel: message.channel }));
		      msg.delete().then( message.channel.send({ embed: correctButton, buttons: [ web ] }) )
		          await serverData.updateOne({ 
			    	id: message.guild.id 
			      }, { 
			    	$set: { 
			    		bump: new Date().getTime()
			    	}
			   	  })
		          await serverData.updateOne({ 
			    	id: message.guild.id 
			      }, { 
			    	$inc: { 
			    		bumps: 1
			    	}
			   	  })
			    return;
		    } else if (b.id == kod2 || b.id == kod3) {
		      msg.delete().then( message.channel.send({ embed: incorrectButton, buttons: [ web ] }) )
		    }
		  })
	})
}
};
exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'bump',
	description: '',
	usage: ''
};
function msgError(msg, { channel }) {
    channel.send(new Discord.MessageEmbed()
    .setAuthor(global.clientSL.user.username,global.clientSL.user.avatarURL())
    .setFooter('townlist.xyz/servers')
    .setDescription(msg)
    .setColor("2f3136")
    )
}