const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/AFKSystem.js");

module.exports = {
    name: "afk",
    description: "Imposta lo stato AFK.",
    options: [
        {
            name: "imposta",
            description: "Imposta il tuo stato afk.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "stato",
                    description: "Imposta il tuo stato",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "attivo",
            description: "Ritorna attivo.",
            type: "SUB_COMMAND"
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options, user, createdTimestamp } = interaction;

        const embed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }));

        const afkStatus = options.getString("stato");

        try {
            switch (options.getSubcommand()) {
                case "imposta": {
                    await DB.findOneAndUpdate(
                        { GuildID: guild.id, UserID: user.id },
                        { Status: afkStatus, Time: parseInt(createdTimestamp / 1000) },
                        { new: true, upsert: true }
                    )

                    embed.setColor("GREEN").setDescription(`Il tuo stato è stato cambiato in: ${afkStatus}.`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
                case "attivo": {
                    await DB.deleteOne({ GuildID: guild.id, UserID: user.id });

                    embed.setColor("RED").setDescription(`Non sei più AFK.`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }

        } catch (err) {
            console.log(err);
        }
    }
}