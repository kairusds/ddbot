const emoji = require("node-emoji");
const logger = require("../logger");
const sounds = {};

// TODO: add a feature that disables a command requiring
// one usage at a time and re-enable it again after a condition is fulfilled
module.exports = {
	name: "vcsfx",
	format: "<vc name>",
	description: "Display a soundboard for use on a voice channel.",
	run: async (client, message, args) => {
		if(message.member.voiceChannel) return message.edit(`\`Exit the voice channel you are in first then rerun the command.\``);
		if(!args[0]) return message.edit(`\`Missing argument 0 (vc name).\``);
		const voiceChannel = message.guild.channels.find(channel => channel.name === args[0]);
		if(!voiceChannel || voiceChannel.type !== "voice") return message.edit(`\`Invalid voice channel specified.\``);
		
		const connection = await voiceChannel.join();
		logger.log("vcsfx Command", "Voice Connected!");
		await message.delete();
		
		const msg = await message.channel.send(":loud_sound:");
		await msg.react(":x:");
		for(const i in client.sounds){
			const randomEmoji = emoji.random();
			if(sounds[randomEmoji.key]) continue; // just in case the birthday paradox occurs when getting a random emoji
			msg.react(`:${randomEmoji.key}:`);
			sounds[randomEmoji.key] = client.sounds[i];
		}
		
		const filter = (reaction, user) => {
			return (sounds[emoji.which(reaction.emoji.name)]
				|| reaction.emoji.name === emoji.get("x"))
				&& user.id === client.user.id;
		};
		const collector = msg.createReactionCollector(filter, {time: 1000 * 60 * 60});
		collector
			.on("collect", (reaction) => {
				if(reaction.emoji.name === emoji.get("x")) collector.stop();
				connection.playFile(sounds[emoji.which(reaction.emoji.name)]);
			})
			.on("end", () => msg.delete());
	}
};