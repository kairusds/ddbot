const {generate, generateMultiple} = require("generate-password");
const {stripIndents} = require("common-tags");

module.exports = {
	name: "passgen",
	format: "[length=15, amount=1]",
	description: "Generate strong password(s).",
	run: async (client, message, args) => {
		const length = Number(args[0]) || 15;
		const amount = Number(args[1]) || 1;
		if(amount > 1){
			const passwords = generateMultiple(amount, {
				length,
				numbers: true,
				excludeSimilarCharacters: true,
				strict: true
			});
			return message.edit(stripIndents`||
			${passwords.join("\n")}
			||`);
		}
		
		const password = generate({
			length,
			numbers: true,
			excludeSimilarCharacters: true,
			strict: true
		});
		return message.edit(`||${password}||`);
	}
};