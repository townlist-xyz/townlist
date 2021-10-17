const Announcements = require('../../../database/models/botlist/announcement.js');
const botsdata = require("../../../database/models/botlist/bots");
const router = require("express").Router();


console.log("[disbots.xyz]: Botlist/Announcements router loaded.");



router.get("/bot/:botID/announcement", async function(req, res) {
    let botdata = await botsdata.findOne({
        botID: req.params.botID
    });
    if (!req.isAuthenticated()) return res.redirect("/");
    if (req.user.id == botdata.ownerID || botdata.coowners.includes(req.user.id)) {
        res.render("botlist/bot/announcement.ejs", {
            bot: global.Client,
            path: req.path,
            config: global.config,
            user: req.isAuthenticated() ? req.user : null,
            req: req,
            roles:global.config.server.roles,
            channels: global.config.server.channels,
            botdata: botdata
        });
    } 
});

router.post("/bot/:botID/announcement", async function(req, res) {
    let data = req.body;

    let announcement = await Announcements.findOne({ botID: req.params.botID });
    if (!announcement) {
        announcement = new Announcements({
            botID: req.params.botID,
            date: new Date(Date.now()),
            content: data.body,
            title: data.title,
            type: data.type ? data.type : "info",
        }) 
    } else {
        announcement.date = new Date(Date.now());
        announcement.content = data.body;
        announcement.title = data.title;
        announcement.type = data.type ? data.type : "info";
    }

    try {
        await announcement.save();
        res.json({
            success: true,
            message: "Announcement updated."
        });
    } catch(error) {
        res.json({
            success: false,
            message: error.message || "Something went wrong."
        });

        // If you have a way of logging errors, add it here.
    }
});

module.exports = router;