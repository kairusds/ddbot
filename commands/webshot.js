const {Attachment} = require("discord.js");
const got = require("got");

const transformUrl = (str) => !str.startsWith("http") ? `http://${str}` : str;

module.exports = {
	name: "webshot",
	format: "<url>",
	description: "Take a screenshot of a website.",
	run: async (client, message, args) => {
		if(!args[0]) return message.edit(`\`Missing argument 0 (url).\``);
		try{
			const url = encodeURIComponent(transformUrl(args[0]));
			const {body} = await got(`https://screenshie.now.sh/1?uri=${url}`);
			await message.delete();
			await message.channel.send("", new Attachment(body, "screenshot.png"));
		}catch(err){
			message.edit(`\`${err.body}\``);
		}
	}
};