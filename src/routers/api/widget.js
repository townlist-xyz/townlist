const express = require('express');
const router = express.Router();
const Canvas = require("canvas");
const request = require("node-fetch");
const bot_db = require("../../database/models/botlist/bots");

Canvas.registerFont(__dirname + "/../../fonts/WidgetFont.ttf", { family: "monospace" });
router.get("/api/widget/:bot_id", async function(req, res) {
    const bot_id = req.params.bot_id;
    const bot = await bot_db.findOne({ botID: bot_id });
    const owner = await bot_db.findOne({ ownerName: bot_id });
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

        ctx.font = "bold 28px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(bot.username, 100, 38);

        ctx.font = "12px monospace";
        ctx.fillStyle = "white";
        wrapText(ctx, bot.shortDesc, 100, 58, 275, 20);

        ctx.font = "16px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(`${bot.serverCount || "N/A"} servers`, 20, 109);
        ctx.fillText(`${bot.votes} votes`, 20, 132);
           ctx.font = "16px monospace";
        ctx.fillStyle = "gray";
            ctx.fillText(`${bot.tags || "N/A"} votes`, 20, 155);
        

        ctx.font = "13px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(`Not your average list`, 222, 193);
  

        res.setHeader('Content-Type', 'image/png');
        res.end(canvas.toBuffer());
    } catch (error) {
        res.status(500).send(`Internal Server Error, stinky.: ${error.message}`);
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var line0 = 0;
        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (line0 > 12) {
                line = "..."
                context.fillText(line, x, y)
                continue;
            }
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                
                line = words[n] + ' ';
                line0++
                y += lineHeight;
                
            }
            else {
                line0++
                line = testLine;
            }
        }
        context.fillText(line, x, y);
      }
      
});

module.exports = router;