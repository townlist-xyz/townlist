module.exports = {
  bot: {
    token: "ODU3OTE1NjcxODk5MTQ0MjQy.YNWiOw.W7lUsXG_-VySo37gG-1qBIHnTVM",
    prefix: "d!",
    owners: ["853157136992829470"],
    mongourl: "mongodb+srv://desixred:Ilovemykm@desixred.b8mot.mongodb.net/giveaway?retryWrites=true&w=majority",
    servers: {
      token: "ODcxMzM5NjUzNzEyNzIzOTk4.YQZ4Sg.zm2UhNDJkSfpd888d-2A9uqccqc",
      prefix: "s?"
    }
  },

  website: {
    callback: "townlist.xyz/callback",
    secret: "ip0pyD1yKneW5pee5Eu1m1syI9zaMJZ-",
    clientID: "857915671899144242", // Bot client id.
    tags: ["Moderation", "Fun", "Minecraft", "Economy", "Guard", "NSFW", "Anime", "Invite", "Music", "Logging", "Web Dashboard", "Reddit", "Youtube", "Twitch", "Crypto", "Leveling", "Game", "Roleplay", "Utility", "Seasonal", "Protection", "Multi Purpose"],
    reporttags: ["Choose one...","NSFW content","API abuse","Malicious use of bot page","Copycat","Doesn't work","Other"],
      stafftags: ["Choose one...","Support","Bot Reviewers","Helper","Translator","Manager","Other"],
    languages: [
      { flag: 'gb', code: 'en', name: 'English' },
  
      { flag: 'de', code: 'de', name: 'Deutsch' },
      { flag: 'it', code: 'it', name: 'Italiano' },
      { flag: 'fr', code: 'fr', name: 'French' },
      { flag: 'pl', code: 'pl', name: 'Polish' }
    ],
    servers: {
      tags: [
        {
          icon: "fal fa-code",
          name: "Development"
        },
        {
          icon: "fas fa-phone-square",
          name: "Community"
        },
        {
          icon: "fal fa-play",
          name: "Stream"
        },
        {
          icon: "fal fa-camera",
          name: "Media"
        },
        {
          icon: 'fal fa-building',
          name: 'Company'
        },
        {
          icon: 'fal fa-gamepad',
          name: 'Game'
        },
        {
          icon: 'fal fa-icons',
          name: 'Emoji'
        },
        {
          icon: 'fal fa-robot',
          name: 'Bot List'
        },
        {
          icon: 'fal fa-server',
          name: 'Server List'
        },
        {
          icon: 'fab fa-discord',
          name: 'Support'
        },
        {
          icon: 'fal fa-volume',
          name: 'Sound'
        },
        {
          icon: 'fal fa-comments',
          name: 'Chatting'
        },
        {
          icon: 'fal fa-lips',
          name: 'NSFW'
        },
        {
          icon: "fal fa-comment-slash",
          name: "Challange"
        },
        {
          icon: "fal fa-hand-rock",
          name: "Protest"
        },
        {
          icon: "fal fa-headphones-alt",
          name: "Roleplay"
        },
        {
          icon: "fal fa-grin-alt",
          name: "Meme"
        },
        {
          icon: "fal fa-shopping-cart",
          name: "Shop"
        },
        {
          icon: "fal fa-desktop",
          name: "Technology"
        },
        {
          icon: "fal fa-laugh",
          name: "Fun"
        },
        {
          icon: "fal fa-share-alt",
          name: "Social"
        },
        {
          icon: "fal fa-laptop",
          name: "Sports"
        },
        {
          icon: 'fal fa-palette',
          name: 'Design'
        },
        {
          icon: 'fal fa-users',
          name: 'Community'
        }
      ]
    }
  },

  server: {
    id: "891226286347923506", // DisBots.xyz Server ID
    invite: "https://discord.gg/gW9jRtr2cf",
    dblinvite: "https://discord.com/api/oauth2/authorize?client_id=857915671899144242&permissions=8&redirect_uri=https%3A%2F%2Ftownlist.xyz%2Fcallback&scope=bot",
    roles: {
      yonetici: "891226286347923515", // Team roleid
      manager: "891226286347923514",// Community Manager Role Id
      booster: "895513200823504897", // Server booster Role ID
      sponsor: "891324380058112072", // Sponsor Role id
      community: "891269157927124992", // Community Role id
      supporter: "",// Supporter Role id
      partnerRole: "", // Partner Role id
      site_creator: "891226286347923515",// Site Creator Role id
      administrator: "891226286347923511", // Team Role id Again
      moderator: "891226286347923515", // bot tester Role id
      moderatorrole: "891226286347923513", // Server Moderator Role id
      profile: {
        sitecreator:"891226286347923515", // Site Creator Role id
        booster: "",// Server booster Role ID
        community: "891269157927124992",// Community Role id
        sponsor: "891324380058112072", // Sponsor Role id
        supporter: "", // Supporter Role id
        manager: "891226286347923514", // Community Manager Role Id
        partnerRole: "891324414384295966" // Partner Role id
      },
      codeshare: {
        python: "PY",
        javascript: "JS",
        html: "HTML",
        substructure: "Substructure",
        bdfd: "BDFD", // Bot Designer For Discord
        fiveInvite: "5 INVITES",
        tenInvite: "10 INVITES",
        fifteenInvite: "15 INVITES",
        twentyInvite: "20 INVITES"
      },
      botlist: {
        ownerserver: "896594352044916777", // Server Owner Role ID
        developer: "891226286347923509", // Bot Developer Role ID
        certified_developer: "891226286347923510",// Certified Bot Developer Role ID
        boosted_developer: "891324183135531008", // Boosted Bot Developer Role ID
        promoted_developer: "891324103376650250",// Promoted Bot Developer Role ID
        premium_developer: "891324006039453756",// Premium Server Owner Role ID
        bot: "891226286347923507",// Approved Bot Role ID
        boosted_bot: "891325791479140392", // Boosted Bot Role ID
        promoted_bot: "891326174985351239",// Promoted Bot Role ID
        certified_bot: "891226286347923508"// Certified Bot Role ID
      }
    },
    channels: {
      codelog: "891236014620815371", // Code Log
      login: "891236014620815371",// Login Log
      webstatus: "891236014620815371",// Website Status Log
      uptimelog: "891236014620815371",// Uptime Log
      botlog: "891226286587015219",// bot Log
      reportlog: "891226286587015219",// bot report Log
      votes: "891226286587015220"// Vote Log Log
    }
  }


}