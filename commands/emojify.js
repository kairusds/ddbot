module.exports = {
	name: "emojify",
	format: "<str>",
	description: "Transform certain characters from (str) into emojis.",
	run: async (client, message, args) => {
		let emojiCharacters = {
			a: "🇦", b: "🇧", c: "🇨", d: "🇩", e: "🇪", f: "🇫", g: "🇬", h: "🇭",
			i: "🇮", j: "🇯", k: "🇰", l: "🇱", m: "🇲", n: "🇳", o: "🇴", p: "🇵",
			q: "🇶", r: "🇷", s: "🇸", t: "🇹", u: "🇺", v: "🇻", w: "🇼", x: "🇽",
			y: "🇾", z: "🇿", 0: "0⃣", 1: "1⃣", 2: "2⃣", 3: "3⃣", 4: "4⃣", 5: "5⃣",
			6: "6⃣", 7: "7⃣", 8: "8⃣", 9: "9⃣", 10: "🔟", "#": "#⃣", "*": "*⃣",
			"!": "❗", "?": "❓"
		};
		const result = [];
		const msg = args.join(" ");
		for(const i in msg){
			if(i in emojiCharacters){
				result.push(emojiCharacters[i.toLowerCase()]);
			}else if(i === " "){
				result.push(" ");
			}else{
				result.push(i);
			}
		}
		message.edit(result.join(""));
	}
};