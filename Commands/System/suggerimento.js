const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DB = require("../../Structures/Schemas/SuggestDB.js");

module.exports = {
    name: "suggerimento",
    description: "Suggerisci comandi e funzionalità.",
    permission: "ADMINISTRATOR",
    options: [
        { 
            name: "tipo",
            description: "Seleziona una delle opzioni.",
            type: "STRING",
            required: true, 
            choices: [
                {name: "Comando", value: "Comando"},
                {name: "Evento", value: "Evento"},
                {name: "Funzionalità", value: "Funzionalità"},
                {name: "Altro", value: "Altro"}
            ]
        },
        { 
            name: "suggerisci",
            description: "Descrivi il tuo suggerimento.",
            type: "STRING", 
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
        const { options, guildId, member, user } = interaction;

        const type = options.getString("tipo");
        const suggestion = options.getString("suggerisci");

        const embed = new MessageEmbed()
        .setColor("NAVY")   
        .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
        .addFields(
            {name: "Suggerimento:", value: suggestion, inline: false},
            {name: "Tipo:", value: type, inline: true},
            {name: "Stato", value: "In corso", inline: true}
        )
        .setTimestamp()

        const buttons = new MessageActionRow();
        buttons.addComponents(
            new MessageButton().setCustomId("suggest-accept").setLabel("✔️ Approva").setStyle("PRIMARY"),
            new MessageButton().setCustomId("suggest-decline").setLabel("❌ Boccia").setStyle("SECONDARY"),

        )

        try{
            const m = await interaction.reply({embeds: [embed], components: [buttons], fetchReply: true});
            
            await DB.create({GuildID: guildId, MessageID: m.id, Details: [
                {
                    MemberID: member.id,
                    Type: type,
                    Suggesion: suggestion
                }
            ]});
        }catch(err){
            console.log(err);
        }
    }

}