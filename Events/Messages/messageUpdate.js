const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    execute(oldMessage, newMessage){
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const count = 1950;

        const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, count) + (newMessage.content.length > 1950 ? " ..." : "");

        const log = new MessageEmbed()
        .setColor("#36393f")
        .setDescription(`📘 Un [messaggio](${newMessage.url}) di ${newMessage.author} è stato **modificato** in ${newMessage.channel}.\n
        **Messaggio originale**:\n ${Original}\n **Messaggio modificato**:\n ${Edited} `)
        .setFooter(`L'utente: ${newMessage.author.tag} | ID: ${newMessage.author.id}`);

        new WebhookClient({url: ""})
        .send({embeds: [log]}).catch((err) => console.log(err));

    }
}