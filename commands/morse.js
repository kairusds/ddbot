module.exports = {
	name: "morse",
	format: "<str>",
	description: "Transform certain characters from (str) into morse code.",
	run: async (client, message, args) => {
		let codes = {
			A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
			H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
			O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
			V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", 0: "-----",
			1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....",
			7: "--...", 8: "---..", 9: "----.", ".": ".-.-.-", ",": "--..--"
		};
		const msg = args.join(" ");
		let result = [];
		for(const i in msg){
			if(i in codes){
				result.push(codes[i.toUpperCase()]);
			}else if(i === " "){
				result.push(" ");
			}else{
				result.push(i);
			}
		}
		message.edit(result.join(""));
	}
};