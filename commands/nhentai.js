const {Attachment} = require("discord.js");
const JSZip = require("jszip");
const cheerio = require("cheerio");
const fs = require("fs");
const got = require("got");
const logger = require("../logger");

// my laziness showing
async function doujinExists(id){
	try{
		await got.head(`https://nhentai.net/g/id`);
		return true;
	}catch(err){
		return false;
	}
}

async function getDoujinInfo(id){
	const body = await got(`https://nhentai.net/g/${id}`, {
		responseType: "text",
		resolveBodyOnly: true
	});
	const $ = cheerio.load(body);
	const info = [];
	let $info = $("#info"),
		h1 = $info.find("h1"),
		h2 = $info.find("h2"),
		tags = $("#tags").clone();
	tags.find(".tag-container.hidden").remove();
	tags.find(".count").remove();
	tags.find(".tags a").replaceWith(() => `${this.textContent.trim()}, `);
	tags.find(".tags").replaceWith(() => this.textContent.trim().slice(0, -1));
	tags.find(".tag-container").replaceWith(() => this.textContent.trim().replace(/[\n\s\t]{2,}/, " "));
	
	if(h1) info.push(`${h1.text().trim()}\n`);
	if(h2) info.push(`${h2.text().trim()}\n`);
	if(tags) info.push(`\n${tags.text().trim().replace(/[\n\s\t]{2,}/g, "\n")}`);
	return Promise.resolve(info.join("")); // title, native title, tags
}

async function search(query, page = 1, sort = "date", limit = 4){
	if(!["date", "popular"].includes(sort)) return;
	const body = await got(`https://nhentai.net/search/?q=${query.replace(/ /g, "+")}&page=${page}&sort=${sort}`, {
		responseType: "text",
		resolveBodyOnly: true
	});
	const $ = cheerio.load(body);
	const results = [];
	
	$(".gallery").each((index, element) => {
		if(index == limit) return false;
		results.push([
			$(element).find("a").data("href").replace(/\/g\/(\d+)\//, "$1"),
			$(element).find(".caption").text()
		]);
	});
	return Promise.resolve(results); // Promise [String id, String title]
}

async function downloadDoujin(id){
	const zip = new JSZip();
	const page = await got(`https://nhentai.net/g/${id}`, {
		responseType: "text",
		resolveBodyOnly: true
	});
	const $ = cheerio.load(page);
	const title = $("#info").find("h1").text();
	const info = await getDoujinInfo(id);
	zip.file("info.txt", info);
	
	$("#thumbnail-container img").each(async (index, element) => {
		let src = $(element).data("src");
		if(/^\/\/t\./i.test(src)) src = `https:${src}`;
		src = src.replace("t.n", "i.n").replace(/\/(\d+)t\./, "/$1.");
		const body = await got(src`, {
			responseType: "buffer",
			resolveBodyOnly: true
		});
		let filename = src.replace(/.*\//g, "").split(".");
		filename = `${(`0000${filename[0]}`).slice(-4)}.${filename[1]}`;
		zip.file(filename, body);
	});
	
	const generatedZip = await zip.generateAsync({
		compression: "DEFLATE",
		compressionOptions: {
			level: 9
		},
		type: "nodebuffer",
		streamFiles: true
	});
	// fs.writeFileSync("dojin.zip", generatedZip);
	return Promise.resolve([
		`${title.replace(/\s/g, "_")}.${id}.zip`,
		generatedZip
	]); // Promise [String filename, Buffer generatedZip]
}

module.exports = {
	name: "nhentai",
	format: "<info / download <id>, search <query, [page=1, sort=date, limit=4]>>",
	description: "Download/scrape doujins from nhentai.net.",
	run: async (client, message, args) => {
		try{
			if(args[0] == "info"){
				if(!args[1]) return message.edit("Missing argument 1 (id).", {code: true});
				if(!doujinExists(args[1])) return message.edit("Doujin not found.", {code: true});
				const info = await getDoujinInfo(args[1]);
				
				await message.edit(info, {code: true});
			}else if(args[0] == "search"){
				if(!args[1]) return message.edit("Missing argument 1 (query). Optional: (2: page, 3: sort, 4: limit)", {code: true});
				const page = Number(args[2]) || 1;
				const sort = args[3] || "date";
				const limit = Number(args[4]) || 4;
				if(isNaN(page)) return message.edit("Argument 2 (page) is not a number.", {code: true});
				if(!["date", "popular"].includes(sort)) return message.edit("Argument 3 (sort) does not match \"date\" or \"popular\".", {code: true});
				if(isNaN(limit)) return message.edit("Argument 4 (limit) is not a number.", {code: true});
				const found = await search(args[1], page, sort, limit);
				const msg = [];
				if(found.length < 1) return message.edit("No results found.", {code: true});
				
				for(let i = 0; i < found.length; i++){
					msg.push(`(${found[i][0]}) ${found[i][1]}`);
				}
				
				await message.edit(msg.join("\n"), {code: true});
			}else if(args[0] == "download"){
				if(!args[1]) return message.edit("Missing argument 1 (id).", {code: true});
				if(!doujinExists(args[1])) return message.edit("Doujin not found.", {code: true});
				await message.edit("Downloading...", {code: true});
				const download = await downloadDoujin(args[1]);
				await message.delete();
				await message.channel.send("Downloaded!", new Attachment(download[1], download[0]));
			}else{
				message.edit("Available arguments(0): search, info, download.", {code: true});
			}
		}catch(err){
			logger.err(err);
		}
	}
};