const app = require('express').Router();
const Database = require("void.db");
const path = require("path")


console.log("[disbots.xyz]: DC router loaded.");

app.get("/dc", async (req,res) => {
    res.render("dc.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;