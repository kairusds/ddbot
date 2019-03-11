module.exports = {
	name: "prune",
	format: "[amount=1]",
	description: "Delete own message(s) from the current channel.",
	run: async (client, message, args) => {
		// parseInt() is too old for es6
		const amount = Number(args[0]) || 1;
		let count = 0;
		
		function deleteMsg(msg){
			if(count < amount){
				count++;
				msg.delete();
			}
		}
		
		message.channel.messages
			.filter(msg => msg.author.id === client.user.id)
			.map(deleteMsg);
	}
};