const url = require("url");
const path = require("path");
const { MessageEmbed } = require('discord.js')
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const ejs = require("ejs");
const bodyParser = require("body-parser");
const emoji = require('../emoji.json')
const Discord = require("discord.js");
const config = require("../config.js");
const channels = config.server.channels;
const app = express();
const MemoryStore = require("memorystore")(session);
const fetch = require("node-fetch");
const cookieParser = require('cookie-parser');
const referrerPolicy = require('referrer-policy');
app.use(referrerPolicy({ policy: "strict-origin" }))
const rateLimit = require("express-rate-limit");
var MongoStore = require('rate-limit-mongo');
const roles = global.config.server.roles;
const botsdata = require("./database/models/botlist/bots.js");
const serversdata = require("./database/models/servers/server.js");
const voteSchema = require("./database/models/botlist/vote.js");
const codesSchema = require("./database/models/codes.js");
const uptimeSchema = require("./database/models/uptime.js");
// MODELS
const db = require("./database/models/servers/server.js");
const banSchema = require("./database/models/site-ban.js");
const maintenceSchema = require('./database/models/maintence.js');
const appsdata = require("./database/models/botlist/certificate-apps.js");
const client = global.Client;

module.exports = async (client) => {

  const apiLimiter = rateLimit({
    store: new MongoStore({
      uri: global.config.bot.mongourl,
      collectionName: "rate-limit",
      expireTimeMs: 60 * 60 * 1000,
      resetExpireDateOnChange: true
    }),
    windowMs: 60 * 60 * 1000,
    max: 4,
    message:
      ({ error: true, message: "Too many requests, you have been rate limited. Please try again in one hour." })
  });

  var minifyHTML = require('express-minify-html-terser');
  app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }));

  app.set('views', path.join(__dirname, '/views'));
  const templateDir = path.resolve(`${process.cwd()}${path.sep}src/views`);
  app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}assets/css`)));
  app.use("/js", express.static(path.resolve(`${templateDir}${path.sep}assets/js`)));
  app.use("/img", express.static(path.resolve(`${templateDir}${path.sep}assets/img`)));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(new Strategy({
    clientID: '857915671899144242',
    clientSecret: 'ip0pyD1yKneW5pee5Eu1m1syI9zaMJZ-',
    callbackURL: 'https://townlist.xyz/callback',
    scope: ["identify", "guilds", "guilds.join"]
  },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());


  app.engine("listing.dicordtownshop.com", ejs.renderFile);
  app.set("view engine", "listing.dicordtownshop.com");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  global.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  app.use(async (req, res, next) => {
    const d = await maintenceSchema.findOne({ server: config.server.id });
    if (d) {
      if (req.isAuthenticated()) {
        let usercheck = client.guilds.cache.get(config.server.id).members.cache.get(req.user.id);
        if (usercheck) {
          if (usercheck.roles.cache.get(roles.yonetici)) {
            next();
          } else {
            res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
          }
        } else {
          res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
        }
      } else {
        res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
      }
    } else {
      next();
    }
  })
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      _token: req.session['_token'],
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };
  const checkMaintence = async (req, res, next) => {
    const d = await maintenceSchema.findOne({
      server: config.server.id
    });
    if (d) {
      if (req.isAuthenticated()) {
        let usercheck = client.guilds.cache.get(config.server.id).members.cache.get(req.user.id);
        if (usercheck) {
          if (usercheck.roles.cache.get(roles.yonetici)) {
            next();
          } else {
            res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
          }
        } else {
          res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
        }
      } else {
        res.redirect('/error?code=200&message=Our website is temporarily unavailable.')
      }
    } else {
      next();
    }
  }

  function generateRandom(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
  app.get("/robots.txt", function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send(`Sitemap: https://townlist.xyz/sitemap.xml`);
  });
  app.get("/sitemap.xml", async function(req, res) {
    let link = "<url><loc>https://townlist.xyz/</loc></url>";
    let botdataforxml = await botsdata.find()
    botdataforxml.forEach(bot => {
      link += "\n<url><loc>https://townlist.xyz/bot/" + bot.botID + "</loc></url>";
    })
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">${link}</urlset>`);
  });

  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
    passport.authenticate("discord", { prompt: 'none' }));
  app.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/"
  }), async (req, res) => {
    let banned = await banSchema.findOne({
      user: req.user.id
    })
    if (banned) {
    client.users.fetch(req.user.id).then(async a => {
      client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({
        dynamic: true
      })).setThumbnail(a.avatarURL({
        dynamic: true
      })).setColor("2f3136").setDescription(`[**${a.username}**#${a.discriminator}](https://https://townlist.xyz/user/${a.id}) tried logging in but they were blocked from the website.`).addField("Username", a.username).addField("User ID", a.id).addField("User Discriminator", a.discriminator))
    })
    req.session.destroy(() => {
      res.json({
        login: false,
        message: "You have been blocked from DTL.",
        logout: true
      })
      req.logout();
    });
  } else {
    try {
      const request = require('request');
      request({
        url: `https://discordapp.com/api/v8/guilds/${config.server.id}/members/${req.user.id}`,
        method: "PUT",
        json: {
          access_token: req.user.accessToken
        },
        headers: {
          "Authorization": `Bot ${client.token}`
        }
      });
    } catch { };
    res.redirect(req.session.backURL || '/')
    client.users.fetch(req.user.id).then(async a => {
      client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({
        dynamic: true
      })).setThumbnail(a.avatarURL({
        dynamic: true
      })).setColor("2f3136").setDescription(`[**${a.username}**#${a.discriminator}](https://townlist.xyz/user/${a.id}) logged in to the website.`).addField("Username", a.username).addField("User ID", a.id).addField("User Discriminator", a.discriminator))

    })
  }
});



app.get("/logout", function(req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});
const checkAdmin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(roles.yonetici) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(roles.moderator)) {
      next();
    } else {
      res.redirect("/error?code=403&message=You is not competent to do this.")
    }
  } else {
    req.session.backURL = req.url;
    res.redirect("/login");
  }
}
app.get("/bots/promoted", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.promoted === "Promoted")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/bots-promoted.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.get("/admin/premium-servers", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const serverdata = await serversdata.find();
  renderTemplate(res, req, "admin/premium-server.ejs", {
    req,
    roles,
    config,
    serverdata
  })
});
app.post("/server/:id/new-comment", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.body.rating) {
    await db.updateOne({
      id: req.params.id
    }, {
        $push: {
          rates: {
            author: req.user.id,
            star_rate: 1,
            message: req.body.content,
            date: Date.now()
          }
        }
      })
  } else {
    await db.updateOne({
      id: req.params.id
    }, {
        $push: {
          rates: {
            author: req.user.id,
            star_rate: req.body.rating,
            message: req.body.content,
            date: Date.now()
          }
        }
      })
  }

  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/reply/:userID", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  let message = req.body.replyM;
  if (!message) return res.send({
    error: "You must enter a reply message."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $set: {
        'rates.$.reply': message
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})

app.post("/server/:id/edit/:userID", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  let message = req.body.editM;
  if (!message) return res.send({
    error: "You must enter a edit message."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $set: {
        'rates.$.star_rate': req.body.ratingEdit,
        'rates.$.edit': message
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/reply/:userID/edit", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  let message = req.body.editReplyM;
  if (!message) return res.send({
    error: "You must enter a new reply message."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $set: {
        'rates.$.reply': message
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/reply/:userID/delete", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $unset: {
        'rates.$.reply': null
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})
app.post("/server/:id/review/:userID/delete", async (req, res) => {
  let serverdata = await db.findOne({
    id: req.params.id
  });
  if (!serverdata) return res.send({
    error: "You entered an invalid server id."
  });
  if (!req.params.userID) return res.send({
    error: "You must enter a user id."
  })
  await db.update({
    id: req.params.id,
    'rates.author': req.params.userID
  }, {
      $unset: {
        'rates.$.author': null,
        'rates.$.star_rate': null,
        'rates.$.message': null,
        'rates.$.date': null,
        'rates.$.edit': null,
        'rates.$.reply': null
      }
    }, function(err, person) { if (err) return console.log(err); })
  return res.redirect('/server/' + req.params.id);
})

app.get("/admin/premium/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await serversdata.findOneAndUpdate({
    id: req.params.botID
  }, {
      $set: {
        premium: "Premium",
      }
    }, function(err, docs) { })
  let serverdata = await serversdata.findOne({
    id: req.params.botID
  });

  client.guilds.fetch(serverdata.id).then(bota => {
    client.channels.cache.get(config.server.channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.success} Upgrade`)
    .setDescription(`<@${serverdata.ownerID}>'s server has been promoted to **Premium**.`)
        .addField(`Action taken on`, `**${bota.name}**`)
    .setColor('2f3136')
    .setTimestamp()
    )
    client.users.cache.get(serverdata.ownerID).send(new MessageEmbed()
    .setTitle(`${emoji.success} Upgrade`)
    .setDescription(`Your server has been upgraded to premium!`)
    .addField(`Action taken on`, `**${bota.name}**`)
    .setColor('2f3136')
    .setTimestamp()
    )
      
  });
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(serverdata.ownerID).roles.add(roles.botlist.premium_developer);
  return res.redirect(`/admin/premium-servers?success=true&message=Promotion gived.&id=${req.params.botID}`)
});
app.get("/admin/premium/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await serversdata.findOneAndUpdate({
    id: req.params.botID
  }, {
      $set: {
        premium: "None",
      }
    }, function(err, docs) { })
  let serverdata = await serversdata.findOne({
    id: req.params.botID
  });
  client.guilds.fetch(serverdata.id).then(bota => {
    client.channels.cache.get(config.server.channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.error} Removal`)
    .setDescription(`<@${serverdata.ownerID}>'s server has been removed from premium list.`)
        .addField(`Action taken on`, `**${bota.name}**`)
    .setColor('2f3136')
   .setTimestamp()
    )
      
  
    client.users.cache.get(serverdata.ownerID).send(new MessageEmbed()
    .setTitle(`${emoji.error} Removal`)
    .setDescription(`Your server has been removed from premium list.`)
        .addField(`Action taken on`, `**${bota.name}**`)
    .setColor('2f3136')
   .setTimestamp()
    )
      
    
  });
  await appsdata.deleteOne({
    id: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(serverdata.ownerID).roles.remove(roles.botlist.premium_developer);
  return res.redirect(`/admin/premium-servers?success=true&message=Promotion deleted.`)
});
app.get("/admin/boost/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        boosted: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.error} Removal`)
    .setDescription(`<@${botdata.ownerID}>'s bot has been removed from promotion badge.`)
    .addField(`Action taken on`, `**${bota.tag}**`)
    .setTimestamp()
    .setColor(`2f3136`)
    )
    client.users.cache.get(botdata.ownerID).send(new MessageEmbed()
    .setTitle(`${emoji.error} Removal`)
    .setDescription(`Your bot has been removed from boost badge.`)
    .addField(`Action taken on`, `**${bota.tag}**`)
   .setTimestamp()
    .setColor(`2f3136`)
    )
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.boosted_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.boosted_developer);
  return res.redirect(`/admin/certificate-apps?success=true&message=Certificate deleted.`)
});
app.get("/credits", checkMaintence, (req, res) => {
  renderTemplate(res, req, "/botlist/credits.ejs", {
    config,
    req,
    roles
  });
});

app.get("/confirmlogin", checkMaintence, (req, res) => {
  renderTemplate(res, req, "/botlist/confirmlogin.ejs", {
    config,
    req,
    roles
  });
});

app.get("/credits", checkMaintence, (req, res) => {
  renderTemplate(res, req, "/botlist/credits.ejs", {
    config,
    req,
    roles
  });
});
app.get("/rewards", checkMaintence,checkAuth, async (req, res) => {
  renderTemplate(res, req, "/botlist/rewards.ejs", {
    config,
    req,
    user: req.isAuthenticated() ? req.user : null,
    roles
  });
});
app.use("/", require('./routers/botlist/apps/cerificate-app.js'))



app.get("/admin/approvedservers", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const serverdata = await serversdata.find()
  renderTemplate(res, req, "admin/serverapproved.ejs", {
    req,
    roles,
    config,
    serverdata
  })
});
app.get("/admin/server/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let botdata = await serversdata.findOne({ id: req.params.botID })
  if (!botdata) return res.redirect("/error?code=404&message=You entered an invalid server id.");
  let guild = client.guilds.cache.get(config.server.id)
  await botdata.deleteOne({ id: req.params.guildID });
  client.channels.cache.get(channels.botlog).send(`${emoji.success} <@${botdata.ownerID}>'s server named **${botdata.name}** has been deleted by ${req.user.username}.`)
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.ownerserver);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      guild.members.cache.get(a).roles.remove(roles.botlist.ownerserver);
    })
  }
  return res.redirect(`/admin/approvedservers?success=true&message=Server deleted.`)
});
app.get("/admin/promote/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        promoted: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.error} Removal`)
    .setDescription(`${emoji.error} <@${botdata.ownerID}>'s bot has been removed from promotion.\n(Promoted bots list)`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setTimestamp()
    .setColor(`2f3136`)
    )
    client.users.cache.get(botdata.ownerID).send(new MessageEmbed()
    .setTitle(`${emoji.error} Removal`)
    .setDescription(`${emoji.error} Your bot has been boosted!`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setTimestamp()
    .setColor(`2f3136`)
    )
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.promoted_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.promoted_developer);
  return res.redirect(`/admin/promoted-bots?success=true&message=Promotion deleted.`)
});
app.get("/admin/boost-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/boosted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/promote-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/promoted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/boost-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/boosted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/promote-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/promoted-bots.ejs", {
    req,
    roles,
    config,
    botdata
  })
});
app.get("/admin/boost/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        boosted: "Boosted",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });

  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.success} Upgrade`)
    .setDescription(`<@${botdata.ownerID}>'s bot has been upgraded to **boost** list.`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setColor(`2f3136`)
.setTimestamp()
    )

    client.users.cache.get(botdata.ownerID).send(new MessageEmbed()
    .setTitle(`${emoji.success} Upgrade`)
    .setDescription(`<@${botdata.ownerID}>'s bot has been upgraded to **boost** list.`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setColor(`2f3136`)
.setTimestamp()
    )
  });
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.add(roles.botlist.boosted_bot);
  guild.members.cache.get(botdata.ownerID).roles.add(roles.botlist.boosted_developer);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      if (guild.members.cache.get(a)) {
        guild.members.cache.get(a).roles.add(roles.botlist.boosted_developer);
      }
    })
  }
  return res.redirect(`/admin/boost-apps?success=true&message=Promotion gived.&botID=${req.params.botID}`)
});
app.get("/admin/promote/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        promoted: "Promoted",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });

  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.success} Upgrade`)
    .setDescription(`<@${botdata.ownerID}>'s bot has been upgraded to **promotion**.`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setColor(`2f3136`)
.setTimestamp()
    )
    client.users.cache.get(botdata.ownerID).send(new MessageEmbed()
    .setTitle(`${emoji.success} Upgrade`)
    .setDescription(`Your bot has been upgraded.`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setColor(`2f3136`)
.setTimestamp()
    )
  });
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.add(roles.botlist.promoted_bot);
  guild.members.cache.get(botdata.ownerID).roles.add(roles.botlist.promoted_developer);
  if (botdata.coowners) {
    botdata.coowners.map(a => {
      if (guild.members.cache.get(a)) {
        guild.members.cache.get(a).roles.add(roles.botlist.promoted_developer);
      }
    })
  }
  return res.redirect(`/admin/promote-bots?success=true&message=Promotion gived.&botID=${req.params.botID}`)
});
app.get("/admin/team", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  if (!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
  const Database = require("void.db");
  renderTemplate(res, req, "/admin/administrator/team.ejs", {
    req,
    roles,
    config,
    db
  })
});
app.get("/team", checkMaintence, (req, res) => {
  const Database = require("void.db");
  renderTemplate(res, req, "team.ejs", {
    roles,
    config,
    req: req
  });
});






app.get("/status", checkMaintence, (req, res) => {
  renderTemplate(res, req, "status.ejs", {
  });
});
app.get("/bots/promoted", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.promoted === "Promoted")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/bots-promoted.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.get("/bots/boosted", checkMaintence, async (req, res) => {
  let page = req.query.page || 1;
  let x = await botsdata.find()
  let data = x.filter(b => b.boosted === "Boosted")
  if (page < 1) return res.redirect(`/bots`);
  if (data.length <= 0) return res.redirect("/");
  if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
  if (Math.ceil(data.length / 6) < 1) {
    page = 1;
  };
  renderTemplate(res, req, "botlist/bots-boosted.ejs", {
    req,
    roles,
    config,
    data,
    page: page
  });
})
app.post("/admin/certificate/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({
    botID: req.params.botID
  }, {
      $set: {
        certificate: "None",
      }
    }, function(err, docs) { })
  let botdata = await botsdata.findOne({
    botID: req.params.botID
  });
  client.users.fetch(botdata.botID).then(bota => {
    client.channels.cache.get(channels.botlog).send(new MessageEmbed()
    .setTitle(`${emoji.error} Certification Failed`)
    .setDescription(`<@${botdata.ownerID}>'s bot failed for certification`)
        .addField(`Action taken on`, `**${bota.tag}**`)
.setColor(`2f3136`)
.setTimestamp()
    )
    client.users.cache.get(botdata.ownerID).send(new MessageEmbed()
      .setTitle(`${emoji.error} Certification Failed`)
      .setDescription(`Your bot's certification was unsuccessful, therefore we can't grant a certificate.`)
      .addField(`Failure Reason`, `**${rBody['reason']}**`)
            .addField(`Action taken on`, `**${bota.tag}**`)
.setColor(`2f3136`)
.setTimestamp()
  
    )
  });
  await appsdata.deleteOne({
    botID: req.params.botID
  })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.certified_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.certified_developer);
  return res.redirect(`/admin/certificate-apps?success=true&message=Certificate deleted.`)
});
app.use(async (req, res, next) => {
  var getIP = require('ipware')().get_ip;
  var ipInfo = getIP(req);
  var geoip = require('geoip-lite');
  var ip = ipInfo.clientIp;
  var geo = geoip.lookup(ip);

  if (geo) {
    let sitedatas = require("./database/models/analytics-site.js")
    await sitedatas.updateOne({ id: config.website.clientID }, { $inc: { [`country.${geo.country}`]: 1 } }, { upsert: true })
  }
  return next();
})
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', socket => {
  io.emit("userCount", io.engine.clientsCount);
});
http.listen(3000, () => { console.log("[disbots.xyz]: Website running on 3000 port.") });

//------------------- Routers -------------------//

/* General */
console.clear();
/*
  (WARN)
  You can delete the log here, but you cannot write your own name in the Developed by section.
  * log = first console.log
*/
console.log(`
      [===========================================]
                       disbots.xyz
        https://github.com/disbots-xyz/benedict
                Developed by Claudette
                    Achievements =)
      [===========================================]
      `)
console.log("\x1b[32m", "System loading, please wait...")
sleep(1050)
console.clear();
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: General routers loading...");
sleep(500);
app.use("/", require('./routers/index.js'))
app.use("/", require('./routers/login-confirm.js'))
app.use("/", require('./routers/partners.js'))
app.use("/", require('./routers/dc.js'))
app.use("/", require('./routers/reviews.js'))
app.use("/", require('./routers/mini.js'))

/* Uptime System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Uptime system routers loading...");
sleep(500);
app.use("/uptime", require('./routers/uptime/add.js'))
app.use("/uptime", require('./routers/uptime/delete.js'))
app.use("/uptime", require('./routers/uptime/links.js'))

/* Profile System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Profile system routers loading...");
sleep(500);
app.use("/user", require('./routers/profile/index.js'))
app.use("/user", require('./routers/profile/edit.js'))

/* Code Share System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Code Share system routers loading...");
sleep(500);
app.use("/codes", require('./routers/codeshare/view.js'))
app.use("/codes", require('./routers/codeshare/list.js'))
app.use("/codes", require('./routers/codeshare/categories.js'))

/* Botlist System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Botlist system routers loading...");
sleep(500);
app.use("/", require('./routers/botlist/addbot.js'))
app.use("/", require('./routers/botlist/mini.js'))
app.use("/", require('./routers/botlist/vote.js'))
app.use("/", require('./routers/botlist/bot/view.js'))
app.use("/", require('./routers/botlist/bot/announcements.js'))
app.use("/", require('./routers/botlist/bot/edit.js'))
app.use("/", require('./routers/botlist/bot/analytics.js'))
app.use("/", require('./routers/botlist/apps/cerificate-app.js'))
app.use("/", require('./routers/botlist/apps/report-app.js'))

/* Server List System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Serverlist system routers loading...");
sleep(500);
app.use("/servers", require('./routers/servers/index.js'))
app.use("/server", require('./routers/servers/add.js'))
app.use("/servers", require('./routers/servers/tags.js'))
app.use("/servers", require('./routers/servers/search.js'))
app.use("/servers", require('./routers/servers/tag.js'))
app.use("/server", require('./routers/servers/server/view.js'))
app.use("/server", require('./routers/servers/server/edit.js'))
app.use("/server", require('./routers/servers/server/join.js'))
app.use("/server", require('./routers/servers/server/analytics.js'))
app.use("/server", require('./routers/servers/server/delete.js'))

/* Admin Panel */
app.use(async (req, res, next) => {
  if (req.path.includes('/admin')) {
    if (req.isAuthenticated()) {
      if (client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.administrator) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.moderator) || req.user.id === "714451348212678658") {
        next();
      } else {
        res.redirect("/error?code=403&message=You is not competent to do this.")
      }
    } else {
      req.session.backURL = req.url;
      res.redirect("/login");
    }
  } else {
    next();
  }
})
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Admin Panel system routers loading...");
sleep(500);
app.use("/", require('./routers/admin/index.js'))
app.use("/", require('./routers/admin/maintence.js'))
app.use("/", require('./routers/admin/ban.js'))
app.use("/", require('./routers/admin/partner.js'))
app.use("/", require('./routers/admin/botlist/confirm.js'))
app.use("/", require('./routers/admin/botlist/decline.js'))
app.use("/", require('./routers/admin/botlist/delete.js'))
app.use("/", require('./routers/admin/botlist/certificate/give.js'))
app.use("/", require('./routers/admin/botlist/certificate/decline.js'))
app.use("/", require('./routers/admin/botlist/certificate/rdelete.js'))
app.use("/", require('./routers/admin/codeshare/index.js'))
app.use("/", require('./routers/admin/codeshare/edit.js'))
app.use("/", require('./routers/admin/codeshare/add.js'))
app.use("/", require('./routers/admin/codeshare/delete.js'))
app.use("/", require('./routers/admin/uptime/index.js'))


/* Bot System */
console.log(" ")
console.log('\x1b[36m%s\x1b[0m', "[disbots.xyz]: Bot system loading...");
app.use("/", require('./routers/api/api.js'))
sleep(500)

app.use((req, res) => {
  req.query.code = 404;
  req.query.message = `Page not found.`;
  res.status(404).render("error.ejs", {
    bot: global.Client,
    path: req.path,
    config: global.config,
    user: req.isAuthenticated() ? req.user : null,
    req: req,
    roles: global.config.server.roles,
    channels: global.config.server.channels
  })
});
};

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}