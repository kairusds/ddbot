const got = require("got");

const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;

module.exports = {
	name: "urban",
	format: "[word]",
	description: "Get an \"ordinary\" definition of (word).",
	run: async (client, message, args) => {
		try{
			if(!args[0]) return message.edit("Missing argument 0 (word).", {code: true});
			const {body} = await got(`http://api.urbandictionary.com/v0/define?term=${args.join(" ")}`, {json: true});
			
			if(body.list.length < 1){
				await message.channel.send(`Couldn't find definition of ${args.join(" ")} from the dictionary.`, {code: true});
			}
			
			const [answer] = body.list;
			const msg = `__**${answer.word}**__:
			**Definition**: ${trim(answer.definition, 1024)}
			**Example**: ${trim(answer.example, 1024)}`;
			message.edit(msg);
		}catch(err){
			message.edit(err, {code: true});
		}
	}
};