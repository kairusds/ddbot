module.exports = {
	name: "prune",
	format: "[amount=1]",
	description: "Delete own message(s) from the current channel.",
	run: async (client, message, args) => {
		// parseInt() is too old for es6
		const amount = Number(args[0]) || 1;
		let count = 0;
		
		function deleteMessages(){
			if(count === amount) return;
			const messages = await message.channel.fetchMessages({limit: 100});
			messages
				.filter(msg => msg.author.id === client.user.id && msg.hit)
				.array().forEach(msg => {
					msg.delete().then(() => {
						count++;
						if(count >= 100) deleteStuff();
					}).catch(() => {
						count++;
						if(count >= 100) deleteStuff();
					});
				});
		}
		
		deleteMessages();
		if(count > 0) message.edit(`Deleted ${count} ${count > 1 ? `messages` : `message`}.`, {code: true});
		message.edit("No messages were deleted.", {code: true});
	}
};