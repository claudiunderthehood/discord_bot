const { Client, MessageEmbed, CommandInteraction} = require("discord.js");
const { connection } = require("mongoose");
require("../../Events/Clients/ready.js");

module.exports = {
    name: "status",
    description: "Mostra lo stato della connessione tra il client ed il database.",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client){
        const response = new MessageEmbed()
        .setColor("AQUA")
        .setDescription(`**Client**: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
        **Database**: \`${statusC(connection.readyState)}\``)

        interaction.reply({embeds: [response]});
    }
}

function statusC(val) {
    var status = " ";

    switch(val){
        case 0: 
            status = "🔴 DISCONNESSO";
            break;
        case 1:
            status = "🟢 CONNESSO";
            break;
        case 2:
            status = "🟠 CONNESSIONE IN CORSO";
            break;
        case 3:
            status = "🟡 DISCONNESSIONE IN CORSO";
            break;
    }

    return status;
}