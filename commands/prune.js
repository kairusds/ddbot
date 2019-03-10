module.exports = {
	name: "prune",
	format: "[amount=1, limit=200]",
	description: "Delete own message(s) from the current channel.",
	run: async (client, message, args) => {
		// parseInt() is too old for es6
		const amount = Number(args[0]) || 1;
		const limit = Number(args[1]) || 100;
		let count;
		function deleteMsg(msg){
			for(count = 0; count < amount; count++){
				msg.delete();
			}
		}
		const messages = await message.channel.fetchMessages({limit});
		messages
			.filter(msg => msg.author.id === client.user.id)
			.map(deleteMsg);
		
		if(Number.isInteger(count)) return message.edit(`Deleted ${count} ${count > 1 ? `messages` : `message`}.`, {code: true});
		message.edit("No messages were deleted.", {code: true});
	}
};