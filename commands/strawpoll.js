const {Attachment} = require("discord.js");
const got = require("got");

module.exports = {
	name: "strawpoll",
	format: "<title, ...options, results <poll id>>",
	description: "Create a strawpoll.",
	run: async (client, message, args) => {
		if(args[0] == "results"){
			if(!args[1]) return message.edit("Missing argument 1 (poll id).", {code: true});
			try{
				const {body} = await got(`https://strawpoll.me/api/v2/polls/${args[1]}`, {json: true});
				await message.delete();
				await message.channel.send(`${body.title}: https://www.strawpoll.me/${body.id}`, new Attachment(`https://www.strawpoll.me/images/poll-results/${body.id}.png`, `${body.id}.png`));
			}catch(err){
				message.channel.send("Straw poll not found.", {code: true});
			}
			return;
		}
		
		args = args.join("").split(":");
		const title = args[0];
		const options = String(args[1]).replace(", ", ",").split(",");
		if(!title || !options) return message.edit("Example: strawpoll loli:yes, no, very yes", {code: true});
		const {body} = await got(`https://strawpoll.me/api/v2/polls`, {
			body: {
				title, options, multi: false, dupcheck: "normal", captcha: true
			}
		}).json();
		await message.delete();
		await message.channel.send(`${title}: https://www.strawpoll.me/${body.id}`, new Attachment(`https://www.strawpoll.me/images/poll-results/${body.id}.png`, `${body.id}.png`));
	}
};