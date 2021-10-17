const app = require('express').Router();
const emoji = require('../../../emoji.json')
const config = require(`${process.cwd()}/config`);
const { Webhook, MessageBuilder } = require('webhook-discord');
const botsdata = require("../../database/models/botlist/bots.js");

console.log("[disbots.xyz]: Botlist/Vote router loaded.");

app.get("/bot/:botID/vote", async (req, res) => {
    let botdata = await botsdata.findOne({ botID: req.params.botID });
    if (!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
    if (req.user && (req.user.id != botdata.ownerID || req.user.id.includes(botdata.coowners) && botdata.status != "Approved")) 
        return res.redirect("/error?code=404&message=You entered an invalid bot id.");

    res.render("botlist/vote.ejs", {
        bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        botdata: botdata,
        roles:global.config.server.roles,
        channels: global.config.server.channels
    })
})
app.post("/bot/:botID/vote", global.checkAuth, async (req, res) => {
    let 
        votes = require("../../database/models/botlist/vote.js"),
        botdata = await botsdata.findOne({ botID: req.params.botID }),
        x = await votes.findOne({ user: req.user.id, bot: req.params.botID }),
        voteHook = new Webhook(config.webhook),
        embed = new MessageBuilder(),
        botvotes = botdata.votes + 1;

    if (x) return res.redirect("/error?code=400&message=You can vote every 12 hours.");

    await votes.findOneAndUpdate({ bot: req.params.botID, user: req.user.id }, { $set: { Date: Date.now(),  ms: 43200000 } }, { upsert: true })
    await botsdata.findOneAndUpdate({ botID: req.params.botID }, { $inc: { votes: 1 } });
 
    if(botvotes == 100) {
        embed.setTitle(`${emoji.mention} Vote Milestone`);
        embed.addField(`Voted by`, req.user.username);
        embed.addField(`Total Votes`, botdata.votes + 1);
        embed.setDescription(`Congratulations ${botdata.ownerID}.\nYour bot **${botdata.username}** has reached 100 votes!`);
        embed.setColor(0x2f3136);
    } else if(botvotes == 50) {
        embed.setTitle(`${emoji.mention} Vote Milestone`);
        embed.addField(`Voted by`, req.user.username);
        embed.addField(`Total Votes`, botdata.votes + 1);
        embed.setDescription(`Congratulations ${botdata.ownerID}.\nYour bot **${botdata.username}** has reached 52 votes!`);
        embed.setColor(0x2f3136);
    } else {
        embed.setTitle(`${emoji.mention} Voting System`);
        embed.addField(`Voted by`, req.user.username);
        embed.addField(`Total Votes`, botdata.votes + 1);
        embed.setDescription(`**${botdata.username}** just got voted by a member.\nVotes reset per month.`);
        embed.setColor(0x2f3136);
    }
    if(botdata.webhook.length > 1) {
        let bothook = new Webhook(botdata.webhookurl);
        bothook.send(botem);
    }

    voteHook.send(embed);

    return res.redirect(`/bot/${req.params.botID}/vote?success=true&message=You voted successfully. You can vote again after 12 hours.`);
})


module.exports = app;