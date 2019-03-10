const isReachable = require("is-reachable");
 
module.exports = {
	name: "ping",
	format: "[uri]",
	description: "Check current network latency / ping a website.",
	run: async (client, message, args) => {
		if(!args[0]){
			return message.edit(`Pong! ${client.ping ? `:heartbeat: ${Math.round(client.ping)}ms.` : ""}`);
		}
		
		const reachable = await isReachable(args[0]);
		if(!reachable) return message.edit(`${args[0]} is offline.`, {code: true});
		message.edit(`${args[0]} is online.`, {code: true});
	}
};