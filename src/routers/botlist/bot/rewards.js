
const botsdata = require("../../../database/models/botlist/bots");
const router = require("express").Router();


router.get("/bot/:botID/rewards", global.checkAuth, async (req, res) => {
    let botdata = await botsdata.findOne({
        botID: req.params.botID
    });
    if (req.user.id == botdata.ownerID || botdata.coowners.includes(req.user.id)) {
        res.render("botlist/bot/rewards.ejs", {
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

module.exports = router;