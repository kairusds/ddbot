const {WebhookClient} = require("discord.js");
const {webhookID, webhookToken} = process.env;

function send(title, text){
	const webhook = new WebhookClient(webhookID, webhookToken);
	webhook.send(`[${title}] ${text}`);
	console.log(`[${title}] ${text}`); // for insurance
}

module.exports = {
	log: (title, text) => send(title, text),
	warn: (text) => send("Warning", text),
	err: (error) => send("Error", error),
	cmd: (client, message) => {
		const cleanMsg = message.cleanContent.replace(/\n/g, " ");
		if(message.author.id !== client.user.id) return;
		send("Command Execution", `${message.guild ? `${message.guild.name} #${message.channel.name}` : "DM"}: ${cleanMsg}`);
	},
	debug: (text) => send("Debug", text)
};