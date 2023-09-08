const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message 
     */
    execute(message){
        if(message.author.bot) return;

        const log = new MessageEmbed()
        .setColor("#36393f")
        .setDescription(`📕 Un [messaggio](${message.url}) di ${message.author} è stato **cancellato** in ${message.channel}.\n
        **Messaggio Cancellato:**\n ${message.content ? message.content : "Nessun contenuto"}`.slice(0, 4096));

        if(message.attachments.size >= 1){
            log.addField(`Allegati:`, `${message.attachments.map(a => a.url)}`, true);
        }

        new WebhookClient({url: "https://discord.com/api/webhooks/940710346996453426/1_phbkZfTMpVpOY5oTT3mk7nXbvGb6d4jkuUPldjnO2TZyGYgdJd0LtbrAZI_lLUMb5L"})
        .send({embeds: [log]}).catch((err) => console.log(err));
    }
}