const got = require("got");

module.exports = {
	name: "prune",
	format: "[amount=1]",
	description: "Delete own message(s) from the current channel.",
	run: async (client, message, args) => {
		// parseInt() is too old for es6
		const amount = Number(args[0]) || 1;
		let count = 0;
		
		function sleep(milliseconds){
			const start = new Date().getTime();
			while(true){
				if((new Date().getTime() - start) > milliseconds) break;
			}
		}
		
		function deleteMsg(msg){
			if(count < amount){
				count++;
				msg.delete();
				sleep(500);
			}
		}
		
		message.channel.messages
			.filter(msg => msg.author.id === client.user.id && msg.hit)
			.map(deleteMsg);
		
		if(count > 0) message.edit(`Deleted ${count} ${count > 1 ? `messages` : `message`}.`, {code: true});
		message.edit("No messages were deleted.", {code: true});
	}
};