const got = require("got");

const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;

module.exports = {
	name: "copypasta",
	description: "Get a random r/copypasta post.",
	run: async (client, message, args) => {
		try{
			const {body} = await got(`https://api.reddit.com/r/copypasta/top.json`, {json: true});
			const {data} = body.data.children[Math.floor(Math.random() * body.data.children.length)];
			if(["png", "jpg"].includes(data.url.slice(-3))) return message.edit(":/ Try again.", {code: true});
			await message.edit(trim(data.selftext, 1024));
		}catch(err){
			message.edit(err, {code: true});
		}
	}
};