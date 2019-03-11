const emoji = require("node-emoji");
const sounds = {};

// TODO: disable commands that requires one usage at a time
// and re-enable them again after a few moments has passed
module.exports = {
	name: "vcsfx",
	description: "Display a soundboard for use on a voice channel.",
	run: async (client, message, args) => {
		const {connection} = message.member.voiceChannel;
		if(!connection) return message.edit("No voice connection found.", {code: true});
		await message.delete();
		const msg = await message.channel.send(":loud_sound:");
		await msg.react(":x:");
		for(const i in client.sounds){
			const randomEmoji = emoji.random();
			if(sounds[randomEmoji.key]) continue; // just in case the birthday paradox occurs when getting a random emoji
			msg.react(randomEmoji.emoji);
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
				connection.play(sounds[emoji.which(reaction.emoji.name)], {bitrate: "auto"});
			})
			.on("end", () => msg.delete());
	}
};