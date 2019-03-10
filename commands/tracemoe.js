const {Attachment} = require("discord.js");
const got = require("got");
const sharp = require("sharp");
const {tracemoe} = process.env;

function getSeason(yymm){
	yymm = yymm.split("-");
	const month = yymm[1];
	const year = yymm[0];
	
	switch(month){
		case "01":
		case "02":
		case "03":
			return `Winter ${year}`;
		case "04":
		case "05":
		case "06":
			return `Spring ${year}`;
		case "07":
		case "08":
		case "09":
			return `Summer ${year}`;
		case "10":
		case "11":
		case "12":
			return `Fall ${year}`;
		default:
			return `${month} ${year}`;
	}
}

module.exports = {
	name: "tracemoe",
	format: "<image uri / attachment>",
	description: "Search an anime screenshot's sauce.",
	run: async (client, message, args) => {
		let image = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[0];
		if(!image) return message.edit("Missing argument 0 (image uri / attachment)", {code: true});
		image = await got(image).buffer();
		// resize image so the filesize becomes < 1 MB and wont trigger a 413 http error
		image = sharp(image)
			.resize({width: 800})
			.toBuffer();
		const options = {
			image: image.toString("base64")
		};
		if(tracemoe) options.token = tracemoe;
		const {body} = await got(`https://trace.moe/api/search`, {
			body: options,
			responseType: "json"
		});
		const files = [ // image and video preview of found anime
			`https://trace.moe/thumbnail.php?anilist_id=${body.docs.anilist_id}&file=${encodeURIComponent(body.docs.filename)}&t=${body.docs.at}&token=${body.docs.tokenthumb}`,
			`https://media.trace.moe/video/${body.docs.anilist_id}/${encodeURIComponent(body.docs.filename)}?t=${body.docs.at}&token=${body.docs.tokenthumb}&mute`
		];
		await message.delete();
		await message.channel.send(`
		Title: ${body.docs.title_english} (${body.docs.title_native}) [${body.docs.synonyms.join(", ")}]
		Season: ${getSeason(body.docs.season)}
		Episode ${body.docs.episode}
		Similarity: ${Math.round(body.docs.similarity)}%
		`, {files, code: true});
	}
};