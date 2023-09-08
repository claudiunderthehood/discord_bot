const { MessageEmbed, WebhookClient, GuildMember, MessageAttachment } = require("discord.js");
const { Captcha } = require("captcha-canvas");

let embed = ["https://tenor.com/view/the-last-of-us-the-last-of-us-part-ii-meme-fireworks-gif-17652649"];

let randGIF = Math.floor(Math.random() * embed.length);
let ROLES = "";
let CHANNEL = "";

module.exports = {
    name: "guildMemberAdd",
    /** 
     * @param {GuildMember} member 
     */
    async execute(member) {
        const welcomeMessage = " benvenut* nel covo!";

        const captcha = new Captcha();
        captcha.async = true;
        captcha.addDecoy();
        captcha.drawTrace();
        captcha.drawCaptcha();

        const captchaAttachment = new MessageAttachment(
            await captcha.png,
            "captcha.png"
        );

        try {
            const msg = await member.send({
                files: [captchaAttachment],
                content: "Risolvi il captcha entro 20 secondi.",
            });

            const filter = (message) => {
                if (message.author.id !== member.id) return;
                if (message.content === captcha.text) return true;
                else member.send("Captcha errato");
            };

            try {
                const response = await msg.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                });

                if (response) {
                    member.roles.add(ROLES);
                    member.send("Hai verificato il tuo account.");
                    member.guild.channels.cache.get(CHANNEL).send("Ciao " + member.user.toString() + welcomeMessage);
                    member.guild.channels.cache.get(CHANNEL).send(embed[randGIF]);
                }
            } catch (err) {
                await member.send("Non ti sei verificato e sei stato kickato, riprova.");
                member.kick();
                console.log("eccomi");
            }

        } catch (err) {
            console.log(err);
        }


    }
}