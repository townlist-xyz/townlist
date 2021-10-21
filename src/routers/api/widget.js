const express = require('express');
const router = express.Router();
const Canvas = require("canvas");
const request = require("node-fetch");
const bot_db = require("../../database/models/botlist/bots");

Canvas.registerFont(__dirname + "/../../fonts/WidgetFont.ttf", { family: "monospace" });
router.get("/api/widget/:bot_id", async function(req, res) {
    const bot_id = req.params.bot_id;
    const bot = await bot_db.findOne({ botID: bot_id });

    if (!bot) {
        res.status(404).send("Bot not found");
        return; 
    }

    let background = await Canvas.loadImage(__dirname + "/../../images/widget.png");
    try {
        let avatar = await request(bot.avatar.replace("webp", "png"));
        avatar = await avatar.buffer();
        let icon = await Canvas.loadImage(avatar);

        let canvas = Canvas.createCanvas(400, 200);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(background, 0, 0, 400, 200);
        ctx.drawImage(icon, 20, 20, 64, 64);

        ctx.font = "bold 18px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(bot.username, 100, 38);

        ctx.font = "12px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(bot.shortDesc, 100, 58);

        ctx.font = "16px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(`${bot.serverCount} servers`, 20, 109);
        ctx.fillText(`${bot.votes} votes`, 20, 125);

        res.setHeader('Content-Type', 'image/png');
        res.end(canvas.toBuffer());
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

module.exports = router;