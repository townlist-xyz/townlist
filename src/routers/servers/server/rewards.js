const sdata = require("../../../database/models/servers/server.js");
const router = require("express").Router();


router.get("/server/:guildID/rewards", global.checkAuth, async (req, res) => {

        res.render("servers/server/rewards.ejs", {
            bot: global.Client,
            path: req.path,
            config: global.config,
            user: req.isAuthenticated() ? req.user : null,
            req: req,
            roles:global.config.server.roles,
            channels: global.config.server.channels,
            sdata: sdata
        });
}
);

module.exports = router;