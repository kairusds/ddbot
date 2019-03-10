const WebTorrent = require("webtorrent");
const JSZip = require("jszip");
const {Attachment} = require("discord.js");
const fs = require("fs");
const moment = require("moment");
const prettierBytes = require("prettier-bytes");
const logger = require("../logger");

module.exports = {
	name: "torrent",
	format: "<(torrent uri / attachment) / magnet url>",
	description: "Download a torrent's contents.",
	run: async (botclient, message, args) => {
		// mindful's magic
		const file = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[0];
		if(!file) return message.edit("Missing argument 0 (torrent url / magnet uri / torrent attachment).", {code: true});
		// generates a string of random 5 alphanumerical characters, always unique (source: https://stackoverflow.com/a/28997977/6378928)
		const uniqueStr = (0 | Math.random() * 9e6).toString(32);
		await message.delete();
		const newMessage = await message.channel.send("Loading downloader...");
		try{
			// the code below is originally from webtorrent-cli's source code
			// most of it is coded and modified by me (harvey)
			let updateInterval;
			const client = new WebTorrent();
			client.on("error", logger.err);
			const torrent = client.add(file, {path: `../${uniqueStr}`});
			torrent.on("infoHash", () => {
				function updateMetadata(){
					newMessage.edit(`Fetching torrent metadata from ${torrent.numPeers} peers...`, {code: true});
				}
				updateMetadata();
				torrent.on("wire", updateMetadata);
				torrent.on("metadata", () => {
					torrent.removeListener("wire", updateMetadata);
					newMessage.edit("Verifying existing torrent data...", {code: true});
				});
			});
			
			torrent.on("done", async () => {
				const activeWires = torrent.wires.reduce((num, wire) => num + (wire.downloaded > 0), 0);
				newMessage.edit(`Torrent downloaded successfully from ${activeWires}/${torrent.numPeers} peers! Uploading...`, {code: true});
				botclient.clearInterval(updateInterval);
				newMessage.delete();
				
				const zip = new JSZip();
				zip.folder(`../${uniqueStr}`)
					.forEach((relativePath, file) => zip.file(file.name));
				const generatedZip = await zip.generateAsync({
					compression: "DEFLATE",
					compressionOptions: {
						level: 9
					},
					type: "nodebuffer",
					streamFiles: true
				});
				await message.channel.send(`Uploaded!`, new Attachment(generatedZip, `${torrent.name}.zip`));
				client.destroy(logger.err);
			});
			
			updateInterval = botclient.setInterval(() =>
				newMessage.edit(`\`Downloading ${torrent.name}... prettierBytes(torrent.downloaded)/${prettierBytes(torrent.length)}\``)
			, 1500);
		}catch(err){
			message.edit(err, {code: true});
		}
	}
};