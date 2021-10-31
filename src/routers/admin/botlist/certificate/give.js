const app = require('express').Router();
const botsdata = require("../../../../database/models/botlist/bots.js");
const codesSchema = require("../../../../database/models/codes.js");
const uptimedata = require("../../../../database/models/uptime.js");
const appsdata = require("../../../../database/models/botlist/certificate-apps.js");
let sitedatalari = require("../../../../database/models/analytics-site.js")
const emoji = require('../../../../../emoji.json')
const { MessageEmbed } = require('discord.js');

const client = global.Client;

console.log("[disbots.xyz]: Admin/Botlist/Certificate Give router loaded.");

app.get("/admin/certificate/give/:botID", global.checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        certificate: "Certified",
      }
    })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });

  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(global.config.server.channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.success} Certificate Given`)
    .setDescription(`Your bot has given a certification badge!`)
    .addField(`Action taken on`, `${bota.tag}`)
      .setColor('2f3136')
    )
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(global.config.server.id)
  guild.members.cache.get(botdata.botID).roles.add(global.config.server.roles.botlist.certified_bot);
  guild.members.cache.get(botdata.ownerID).roles.add(global.config.server.roles.botlist.certified_developer);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      if (guild.members.cache.get(a)) {
        guild.members.cache.get(a).roles.add(global.config.server.roles.botlist.certified_developer);
      }
    })
  }
  return res.redirect(`/admin/certificate-apps?success=true&message=Certificate gived.&botID=${req.params.botID}`)
});

module.exports = app;