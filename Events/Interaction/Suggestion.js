const { ButtonInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/SuggestDB.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
        if(!interaction.isButton()) return;

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: "Non puoi usare questo bottone", ephemeral: true});

        const { guildId, customId, message } = interaction;

        DB.findOne({GuildID: guildId, MessageID: message.id}, async(err, data) => {
            if(err) throw err;
            if(!data) return interaction.reply({content: "Non è stato trovato alcun dato relativo alla richiesta nel database.", ephemeral: true});

            const embed = message.embeds[0];

            if(!embed) return;

            switch(customId){
                case "suggest-accept": {
                    embed.fields[2] = {name: "Stato", value: "Approvato", inline: true};
                    message.edit({embeds: [embed.setColor("GREEN")], components: []});
                    return interaction.reply({content: "Suggerimento approvato", ephemeral: true});
                }
                break;

                case "suggest-decline": {
                    embed.fields[2] = {name: "Stato", value: "Bocciato", inline: true};
                    message.edit({embeds: [embed.setColor("RED")], components: []});
                    return interaction.reply({content: "Suggerimento bocciato", ephemeral: true});
                }
                break;
            }
        });

    }
}