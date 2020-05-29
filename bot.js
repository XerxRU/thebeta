const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require('fs');
let config = require('./botconfig.json');
let token = config.token;
let prefix = config.prefix;

fs.readdir('./cmds/',(err,files)=>{
   if(err) console.log(err);
   let jsfiles = files.filter(f => f.split(".").pop() === "js");
   if(jsfiles.lenght <=0) console.log("Нет команд для загрузки!");
   console.log(`Загружено ${jsfiles.lenght} команд!`);
   jsfiles.forEach((f,i) =>{
      let props = require(`./cmds/${f}`);
      console.log(`${i+1}.${f} Загружен!`);
      bot.commands.set(props.help.name,props);
   })
});


bot.on('ready', () => {
  console.log(`Привет, парни! С вами бот ${bot.user.username}!`);
  bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
     console.log(link);
  })
});

bot.on('message', async message => {
   if(message.author.bot) return;
   if(message.channel.type == "dm") return;
   let uid = message.author.id;
   bot.send = function (msg){
       message.channel.send(msg);
   };
   let messageArray = message.content.split(" ");
   let command = messageArray[0].toLowerCase();
   let args = messageArray.slice(1);
   if(!message.content.startsWith(prefix)) return;
   let cmd = bot.commands.get(command.slice(prefix.length));
   if(cmd) cmd.run(bot,message,args);
});

bot.login(token)