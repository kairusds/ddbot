const {stripIndents} = require("common-tags");

module.exports = {
	name: "help",
	format: "[command]",
	description: "Display a list of available commands.",
	run: async (client, message, args) => {
		const {commands} = client;
		const {prefix} = process.env;
		if(args[0]){
			const command = commands.get(args[0]);
			if(!command) return;
			return message.edit(stripIndents`
			${prefix}${command.name}${command.format && ` ${command.format}`}
			> ${command.description}
			`, {code: true});
		}
		
		const msg = [`~${prefix}~`, "+ [command]"];
		commands.map(command => msg.push(`* ${command.name}`));
		await message.edit(`\`${msg.join("\n")}\``);
		await message.delete(1000 * 80);
	}
}