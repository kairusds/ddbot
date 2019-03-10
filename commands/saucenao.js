const {Attachment} = require("discord.js");
const got = require("got");

module.exports = {
	name: "saucenao",
	format: "<image uri / attachment>",
	description: "Find a manga screenshot / illustration's sauce.",
	run: async (client, message, args) => {
		const image = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[0];
		if(!image) return message.edit("Missing argument 0 (image uri / attachment).");
		const {body} = await got(`https://saucenao.com/search.php`, {
			body: {
				db: 999, output_type: 2, api_key: process.env.saucenao,
				numres: 4, url: image,
			},
			responseType: "json"
		});
		if(body.status !== 0) return message.edit("API rate limit reached.", {code: true});
		const msg = [];
		const files = [];
		for(const i in body.results){
			msg.push(`${i + 1}. ${body.results[i].data.title} (${Math.round(body.results[i].header.similarity)}% match) | ${body.results[i].data.ext_urls[0]}\n------`);
			files.push({
				attachment: body.results[i].header.thumbnail,
				name: body.results[i].header.index_name
			});
		}
		await message.delete();
		await message.channel.send(msg.join("\n"), {files});
	}
};