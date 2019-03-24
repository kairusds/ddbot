const {generate, generateMultiple} = require("generate-password");
const {stripIndents} = require("common-tags");
const sysinfo = require("systeminformation");
const unicodePassword = require("unicode-password");

module.exports = {
	name: "passgen",
	format: "[length=30, unicode=false, amount=1]",
	description: "Generate strong password(s).",
	run: async (client, message, args) => {
		const amount = Number(args[2]) || 1;
		const length = Number(args[0]) || 30;
		const options = {
			length,
			numbers: true,
			symbols: true,
			excludeSimilarCharacters: true,
			strict: true
		};
		
		if(Boolean(args[1])) return message.edit(`||${unicodePassword.init().generate()}||`);
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