module.exports = {
	name: "emoji",
	format: "<create <name, image uri / attachment>, delete <name>, list>",
	description: "Create or delete an emoji from the current server.",
	// barebones from mindful's haruka
	run: async (client, message, args) => {
		if(args[0] == "create"){
			const name = args[1];
			const image = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[2];
			if(!name || !image) return message.edit("Missing arguments 1 and 2 (name, image url / attachment).", {code: true});
			try{
				await message.guild.createEmoji(image, name, null, `Created emoji ${name} by ${message.author}.`);
				const emoji = message.guild.emojis.find(val => val.name === name);
				await message.edit(`Created server emoji **${name}** for ${message.guild.name}.`, {code: true});
				await message.react(emoji);
			}catch(err){
				return message.edit(err, {code: true});
			}
		}else if(args[0] == "delete"){
			const name = args[1];
			if(!name) return message.edit("Missing argument 1 (name).", {code: true});
			const emoji = message.guild.emojis.find(val => val.name === name);
			if(!emoji) return message.edit("Unknown emoji.", {code: true});
			try{
				await message.guild.deleteEmoji(emoji, `Deleted emoji ${name} by ${message.author}.`);
				await message.edit(`Deleted server emoji **${name}** of ${message.guild.name}.`, {code: true});
			}catch(err){
				return message.edit(err, {code: true});
			}
		}else if(args[0] == "list"){
			const list = [];
			message.guild.emojis.map(emoji => list.push(emoji.toString()));
			await message.edit(`Emojis on ${message.guild.name}: ${list.join(", ")}.`);
		}else{
			message.edit("Available arguments(0): create, delete, list.", {code: true});
		}
	}
};