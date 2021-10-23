const app = require('express').Router();
const Database = require("void.db");
const path = require("path")
const db = new Database(path.join(__dirname, '../database/json/partners.json'));
const botsdata = require("../database/models/botlist/bots.js");
const codesSchema = require("../database/models/codes.js");
const uptimedata = require("../database/models/uptime.js");
const appsdata = require("../database/models/botlist/certificate-apps.js");
let sitedatalari = require("../database/models/analytics-site.js");
const serversdata = require("../database/models/servers/server.js");
const reportappsdata = require("../database/models/botlist/report-apps.js");

console.log("[disbots.xyz]: Partners router loaded.");

app.get("/queue", async (req,res) => {
    res.render("queue.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        db: db,
        roles: global.config.server.roles
    })
})

module.exports = app;