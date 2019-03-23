const got = require("got");
const {Attachment} = require("discord.js");

const transformUrl = (str) => !str.startsWith("http") ? `http://${str}` : str;

module.exports = {
	name: "webshot",
	format: "<url>",
	description: "Take a screenshot of a website.",
	run: async (client, message, args) => {
		if(!args[0]) return message.edit(`\`Missing argument 0 (url).\``);
		try{
			const url = encodeURIComponent(transformUrl(args[0]));
			const {body, statusCode, statusMessage} = await got(`https://screenshie.now.sh/1?uri=${url}`);
			if(statusCode !== 200) return message.edit(`\`${statusMessage}\``);
			await message.delete();
			await message.channel.send(new Attachment(body, "screenshot.png");
		}catch(err){
			message.edit(err, {code: true});
		}
	}
};