const {Client, Collection} = require("discord.js");
const client = new Client();
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const {PORT, prefix, token} = process.env;
client.commands = new Collection();
client.sounds = [];

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const soundFiles = fs.readdirSync("./assets/vcsfx").filter(file => (/\.(mp3|ogg|wav)$/i).test(file.name));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for(const file of soundFiles){
	client.sounds.push(path.resolve(`./assets/vcsfx/${file}`));
}

client.on("message", (message) => {
	if(!message.content.startsWith(prefix)) return;
	if(message.author.id !== client.user.id) return;
	const args = message.content.slice(prefix.length).split(/ +/g);
	const command = client.commands.get(args.shift().toLowerCase());
	if(!command) return;

	try{
		command.run(client, message, args);
		logger.cmd(client, message);
	}catch(err){
		logger.err("Command Failure", `-${command}\n${err}`);
	}
});

client
	.on("debug", logger.debug)
	.on("warn", logger.warn)
	.on("error", logger.err)
	.on("disconnect", () => console.log("Conection from Discord API has been lost."))
	.on("ready", () => console.log(`Logged in with account ${client.user.tag}.`));

client.setTimeout(() => process.exit(0), 1000 * 60 * 60 * 12); // restart every 12 hours
client.login(token);