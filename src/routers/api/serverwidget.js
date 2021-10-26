const express = require('express');
const router = express.Router();
const Canvas = require("canvas");
const request = require("node-fetch");
const guild_db = require("../../database/models/servers/server");

Canvas.registerFont(__dirname + "/../../fonts/WidgetFont.ttf", { family: "monospace" });
router.get("/api/widget/server/:guildID", async function(req, res) {
    const guild_id = req.params.guildID;
    const guild = await guild_db.findOne({ id: req.params.guildID });



    let background = await Canvas.loadImage(__dirname + "/../../images/widgetsmall.png");
    try {
   

        let canvas = Canvas.createCanvas(400, 200);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(background, 0, 0, 400, 200);
      


        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(guild.name, 95, 25);

     

        ctx.font = "16px monospace";
        ctx.fillStyle = "gray";
        ctx.fillText(`${guild.bumps || "N/A"} bumps`, 91, 97);

        
        ctx.fillText(`${guild.votes} votes`, 220, 97);
ctx.font = "bold 12px monospace"
        ctx.fillText(`${guild.link}`, 108, 124);

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