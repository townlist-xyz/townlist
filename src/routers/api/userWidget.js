const express = require('express');
const router = express.Router();
const Canvas = require("canvas");
const request = require("node-fetch");
const guild_db = require("../../database/models/servers/server.js");

Canvas.registerFont(__dirname + "/../../fonts/WidgetFont.ttf", { family: "monospace" });
router.get("/api/userWidget/:guildID", async function(req, res) {
     const guild_id = req.params.guild_id;
    const guild = await guild_db.findOne({ guildID: guild_id });


    let background = await Canvas.loadImage(__dirname + "/../../images/widget.png");
    try {
        let avatar = await request(guild.icon.replace("webp", "png"));
        avatar = await avatar.buffer();
        let icon = await Canvas.loadImage(avatar);
        ctx.font = "bold 28px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(guild.name, 100, 38);

        ctx.font = "12px monospace";
        ctx.fillStyle = "white";
        wrapText(ctx, guild.shortDesc, 100, 58, 275, 20);

        ctx.font = "16px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(`${guild.bumps || "N/A"} bumps`, 20, 109);
        ctx.fillText(`${bot.votes} votes`, 20, 125);
        ctx.fillText(`${guild.invitelink}`, 20, 142);

      
      

  

        res.setHeader('Content-Type', 'image/png');
        res.end(canvas.toBuffer());
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);
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