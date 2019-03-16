const WebTorrent = require("webtorrent");
const JSZip = require("jszip");
const {Attachment} = require("discord.js");
const fs = require("fs");
const moment = require("moment");
const prettierBytes = require("prettier-bytes");

module.exports = {
	name: "torrent",
	format: "<(torrent uri / attachment) / magnet url>",
	description: "Download a torrent's contents.",
	run: async (botclient, message, args) => {
		// mindful's magic
		const file = ((ref = message.attachments.array()) != null ? (ref1 = ref[0]) != null ? ref1.url : null : null) || args[0];
		if(!file) return message.edit("Missing argument 0 (torrent url / magnet uri / torrent attachment).", {code: true});
		await message.delete();
		const newMessage = await message.channel.send("Loading downloader...");
		try{
			// the code below is originally from webtorrent-cli's source code
			// most of it is coded and modified by me (harvey)
			let updateInterval;
			const client = new WebTorrent();
			client.on("error", err => newMessage.edit(err, {code: true}));
			client.add(file, (torrent) => {
				torrent.on("infoHash", () => {
					const updateMetadata = () => newMessage.edit(`Fetching torrent metadata from ${torrent.numPeers} peers...`, {code: true});
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
					torrent.files.forEach((file) => file.getBuffer((err, buffer) => zip.file(buffer)));
					const generatedZip = await zip.generateAsync({
						compression: "DEFLATE",
						compressionOptions: {
							level: 9
						},
						type: "nodebuffer",
						streamFiles: true
					});
					await message.channel.send("", new Attachment(generatedZip, `${torrent.name}.zip`));
					client.destroy(newMessage.edit);
				});
				
				updateInterval = botclient.setInterval(() =>
					newMessage.edit(`\`Downloading ${torrent.name}... ${prettierBytes(torrent.downloaded)}/${prettierBytes(torrent.length)}\``)
				, 2000);
			});
		}catch(err){
			message.edit(err, {code: true});
		}
	}
};