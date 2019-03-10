module.exports = {
	name: "spam",
	format: "<message> [cycles=10, delay=3]",
	description: "Consecutively send (message) every (delay) for (cycles) time(s).",
	run: async (client, message, args) => {
		if(!args[0]) return message.edit("Missing argument 0 (message).", {code: true});
		const cycles = Number(args[1]) || 10;
		const delay = (Number(args[2]) * 1000) || 3000;
		await message.delete();
		await message.channel.send(args[0]);
		const interval = client.setInterval(async () => await message.channel.send(args[0]), delay);
		client.setTimeout(() => {
			clearInterval(interval);
		}, delay * cycles);
	}
};