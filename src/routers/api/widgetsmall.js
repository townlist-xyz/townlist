const express = require('express');
const router = express.Router();
const Canvas = require("canvas");
const request = require("node-fetch");
const bot_db = require("../../database/models/botlist/bots");

Canvas.registerFont(__dirname + "/../../fonts/WidgetFont.ttf", { family: "monospace" });
router.get("/api/widget/small/:bot_id", async function(req, res) {
    const bot_id = req.params.bot_id;
    const bot = await bot_db.findOne({ botID: bot_id });


    const owner = await bot_db.findOne({ ownerName: bot_id });


    if (!bot) {
        res.status(404).send("Bot not found");
        return; 
    }

    let background = await Canvas.loadImage(__dirname + "/../../images/widgetsmall.png");
    try {
        let avatar = await request(bot.avatar.replace("webp", "png"));
        avatar = await avatar.buffer();
        let icon = await Canvas.loadImage(avatar);

        let canvas = Canvas.createCanvas(400, 200);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(background, 0, 0, 400, 200);
      


        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(bot.username, 156, 25);

     

        ctx.font = "16px monospace";
        ctx.fillStyle = "gray";
        ctx.fillText(`${bot.serverCount || "N/A"} servers`, 91, 97);

        
        ctx.fillText(`${bot.votes} votes`, 220, 97);
ctx.font = "bold 12px monospace"
        ctx.fillText(`${bot.tags}`, 108, 124);

        ctx.font = "bold 13px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(`Listed on townlist.xyz`, 120, 192);
  


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

            if (line0 > 11) {
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