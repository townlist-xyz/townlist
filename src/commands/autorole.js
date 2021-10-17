const disbots = require("disbots-xyz");
const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageEmbed } = require('discord.js')
const emoji = require('../../emoji.json')
const msg = require('discord.js')

const db = require("quick.db");

module.exports.run = async (client,message,args) => {
   

    if(!["on", "off", "set"].includes(args[0])) return msg.channel.send("Invalid Type");
    
    if("on" === args[0].toLowerCase()) {
      
      let data = db.get(`status.${msg.guild.id}`);
      //f(!data) db.set(`status.${msg.guild.id}`, false);
      
      if(data == true) return msg.channel.send("Already On");
      
      msg.channel.send("Autorole now active!");
      return db.set(`status.${msg.guild.id}`, true);
      
    }
    
    if("off" === args[0].toLowerCase()) {
      
      let data = db.get(`status.${msg.guild.id}`);
      if(data == false) return msg.channel.send("Already Off");
      
      msg.channel.send("Autorole no longer active");
      return db.set(`status.${msg.guild.id}`, false);
      
    }
    
    if("set" === args[0].toLowerCase()) {
      
      let role = msg.guild.roles.cache.get(args[1]) || msg.mentions.roles.first();
      if(!role) return msg.channel.send("You must mention role");
      
      msg.channel.send(`Set role to : ${role.name}`);
      return db.set(`autorole.${msg.guild.id}`, role.id);
      
    }
   }


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
  };
  
  exports.help = {
    name: "autorole",
    description: "",
    usage: ""
  };