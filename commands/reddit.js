const got = require("got");
const {Attachment} = require("discord.js");

module.exports = {
	name: "reddit",
	format: "<subreddit>",
	description: "Scrape posts with images from (subreddit).",
	run: async (client, message, args) => {
		if(!args[0]) return message.edit("Missing argument 0 (subreddit).", {code: true});
		try{
			const {body} = await got(`https://api.reddit.com/r/${args[0]}/top.json`, {json: true});
			const {data} = body.data.children[Math.floor(Math.random() * body.data.children.length)];
			if(!["png", "jpg"].includes(data.url.slice(-3))) return message.edit(":/ Try again.", {code: true});
			const filename = (0 | Math.random() * 9e6).toString(32);
			await message.delete();
			await message.channel.send("", new Attachment(data.url, `${filename}${data.url.slice(-4)}`));
		}catch(err){
			message.edit(err, {code: true});
		}
	}
};