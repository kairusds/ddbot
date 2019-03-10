const Minesweeper = require("discord.js-minesweeper");

module.exports = {
	name: "minesweep",
	format: "[rows=6, columns=6, mines=7, emote=boom]",
	description: "Display a minesweeper as a message.",
	run: async (client, message, args) => {
		const rows = Number(args[0]) || 6;
		const columns = Number(args[1]) || 6;
		const mines = Number(args[2]) || 7;
		const emote = args[3] || "boom";
		const minesweeper = new Minesweeper({rows, columns, mines, emote});
		await message.edit(minesweeper.start());
	}
}