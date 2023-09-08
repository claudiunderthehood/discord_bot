const { Client, ContextMenuInteraction, MessageEmbed, Message } = require("discord.js");


module.exports = {
    name: "interactionCreate",
    /**
     * @param {ContextMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand() || interaction.isContextMenu()){
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setDescription("🚩 Un errore è avvenuto durante l'esecuzione di questo comando.")
            ]}) && client.commands.delete(interaction.commandName);

            command.execute(interaction, client);
        }
    }
}

