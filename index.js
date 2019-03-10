const {Client, Collection} = require("discord.js");
const client = new Client();
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const {PORT, prefix, token} = process.env;
client.commands = new Collection();
client.sounds = [];

// todo: add pm2 support
// setTimeout(() => process.exit(0), 1000 * 60 * 60 * 12);

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const soundFiles = fs.readdirSync("./assets/vcsfx").filter(file => (/\.(mp3|ogg|wav)$/i).test(file.name));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for(const file of soundFiles){
	client.sounds.push(path.resolve(`./assets/vcsfx/${file}`));
}

client.on("message", (message) => {
	if(!message.content.startsWith(prefix)) return;
	if(message.author.id !== client.user.id) return;
	const args = message.content.slice(prefix.length).split(/ +/g);
	const command = client.commands.get(args.shift().toLowerCase());
	if(!command) return;

	try{
		command.run(client, message, args);
		logger.cmd(client, message);
	}catch(err){
		logger.err("Command Failure", `-${command}\n${err}`);
	}
});

client
	.on("debug", logger.debug)
	.on("warn", logger.warn)
	.on("error", logger.err)
	.on("disconnect", () => console.log("Conection from Discord API has been lost."))
	.on("ready", () => console.log(`Logged in with account ${client.user.tag}.`));

client.login(token);

const got = require("got");
const express = require("express");
const app = express();
const splashes = [ // im bored as fuck so i just added this
	"Rawr x3 nuzzles how are you pounces on you you're so warm o3o notices you have a bulge o: someone's happy ;) nuzzles your necky wecky~ murr~ hehehe rubbies your bulgy wolgy you're so big :oooo rubbies more on your bulgy wolgy it doesn't stop growing ·///· kisses you and lickies your necky daddy likies (; nuzzles wuzzles I hope daddy really likes $: wiggles butt and squirms I want to see your big daddy meat~ wiggles butt I have a little itch o3o wags tail can you please get my itch~ puts paws on your chest nyea~ its a seven inch itch rubs your chest can you help me pwease squirms pwetty pwease sad face I need to be punished runs paws down your chest and bites lip like I need to be punished really good~ paws on your bulge as I lick my lips I'm getting thirsty. I can go for some milk unbuttons your pants as my eyes glow you smell so musky :v licks shaft mmmm~ so musky drools all over your cock your daddy meat I like fondles Mr. Fuzzy Balls hehe puts snout on balls and inhales deeply oh god im so hard~ licks balls punish me daddy~ nyea~ squirms more and wiggles butt I love your musky goodness bites lip please punish me licks lips nyea~ suckles on your tip so good licks pre of your cock salty goodness~ eyes role back and goes balls deep mmmm~ moans and suckles",
	"So guys, we did it, we reached a quarter of a million subscribers, 250,000 subscribers and still growing the fact that we've reached this number in such a short amount of time is just phenomenal, I'm-I'm just amazed. Thank you all so much for supporting this channel and helping it grow. I-I love you guys... You guys are just awesome. So as you can really tell, this isn't really a montage parody. This is more of a kind of thank you/update kind of video. So for this video, I'll just quickly go over two things: Firstly, advertisements. And more importantly, the future of this channel, and what kind of direction it's headed. Okay, so firstly with the advertisements. Believe it or not, but Montage Parodies are actually a copyright minefield. New content is being claimed by companies everyday. We could use something from.. Let's say five years ago. And tomorrow a huge company could come along and claim their product as theirs, and we have no control over that. Meaning that any video we use their product in could either get copyright striked, or lose monetization. Meaning that all of the money made off that video.. Would get sent to the company, and not us. The only real way to counter this is to get advertisements placed on my channel. I mean, it's a win win for everyone ya know.",
	"<a href=\"https://nhentai.net/tags/lolicon\">surprise</a>"
];
const port = PORT || 1080;

app.all("/", (req, res) => res.status(200).send(splashes[Math.floor(Math.random() * splashes.length)]));
app.listen(port, () => logger.log("Website", `Started up at port ${port}.`));

client.setInterval(async () => {
	await got.get("https://ddbot-kairusds.herokuapp.com");
}, 60 * 25 * 1000);