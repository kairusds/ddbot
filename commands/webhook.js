const {stripIndents} = require("common-tags");

module.exports = {
	name: "webhook",
	format: "<create / avatar <name, image uri / attachment>, delete <name>, list>",
	description: "Manage webhooks from the current server.",
	// barebones from mindful's haruka
	run: async (client, message, args) => {
		if(args[0] == "create"){
			const name = args[1];
			const image = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[2];
			if(!name || !image) return message.edit("Missing arguments 1 / 2 (name, image url / image attachment).", {code: true});
			try{
				const wh = await message.channel.createWebhook(name, image, `Created webhook ${name} for #${message.channel.name} by ${message.author}.`);
				await wh.edit(name, image);
				let webhook = await message.channel.fetchWebhooks();
				webhook = webhook.find(val => val.name === name);
				await message.edit(`Created webhook ${name} for this channel. `, {code: true});
				// recheck webhook api's endpoint
				await message.channel.send(`The webhook URL for ${webhook.name} is https://discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`).delete(3000);
				await webhook.send("Hello.");
			}catch(err){
				message.edit(err, {code: true});
			}
		}else if(args[0] == "avatar"){
			const name = args[1];
			const image = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[2];
			if(!name || !image) return message.edit("Missing arguments 1, 2 (name, image url / image attachment).", {code: true});
			let webhook = await message.channel.fetchWebhooks();
			webhook = webhook.find(val => val.name === name);
			if(!webhook) return message.edit("Unknown webhook.", {code: true});
			try{
				await webhook.edit(name, image);
				await webhook.edit(name, image);
				await message.edit(`Changed avatar of webhook ${name} from #${message.channel.name}.`, {code: true});
			}catch(err){
				return message.edit(err, {code: true});
			}
		}else if(args[0] == "delete"){
			const name = args[1];
			if(!name) return message.edit("Missing argument 1 (name).", {code: true});
			let webhook = await message.channel.fetchWebhooks();
			webhook = webhook.find(val => val.name === name);
			if(!webhook) return message.edit("Unknown webhook.", {code: true});
			try{
				await webhook.delete(webhook, `Deleted webhook ${name} by ${message.author}.`);
				await message.edit(`Deleted webhook ${name} of #${message.channel.name}.`, {code: true});
			}catch(err){
				return message.edit(err, {code: true});
			}
		}else if(args[0] == "list"){
			const list = [];
			const webhooks = await message.guild.fetchWebhooks();
			webhooks.map(item => list.push(`#${message.guild.channels.get(item.channelID).name}: (${item.id}) ${item.name}`));
			await message.edit(stripIndents`\`
			Webhooks on ${message.guild.name}:
			${list.join("\n")}\``);
		}else{
			message.edit("Available arguments(0): create, avatar, delete, list.", {code: true});
		}
	}
}