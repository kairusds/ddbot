const {generate, generateMultiple} = require("generate-password");
const {stripIndents} = require("common-tags");

module.exports = {
	name: "passgen",
	format: "[length=15, symbols=false, amount=1]",
	description: "Generate strong password(s).",
	run: async (client, message, args) => {
		const amount = Number(args[2]) || 1;
		const options = {
			length: Number(args[0]) || 16,
			numbers: true,
			symbols: Boolean(args[1]),
			excludeSimilarCharacters: true,
			strict: true
		};
		
		if(amount > 1){
			const passwords = generateMultiple(amount, options);
			return message.edit(stripIndents`||
			${passwords.join("\n")}
			||`);
		}
		
		const password = generate(options);
		return message.edit(`||${password}||`);
	}
};