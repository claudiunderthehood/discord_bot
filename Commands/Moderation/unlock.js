const { CommandInteraction, MessageEmbed } = require("discord.js");
const db = require("../../Structures/Schemas/LockDown.js");
const { permissions, execute } = require("./lock.js");

module.exports = {
    name: "sblocca",
    description: "Rimuove il lockdown da un canale bloccato.",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, channel } = interaction;

        const embed = new MessageEmbed();

        if (channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
            return interaction.reply({
                embeds: [
                    embed.setColor("RED").setDescription(
                        "🛑 | Questo canale non è in lockdown."
                    ),
                ],
                ephemeral: true
            });

        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: null
        });

        await db.deleteOne({ ChannelID: channel.id });

        interaction.reply({ embeds: [embed.setColor("GREEN").setDescription("🔓 | Il lockdown è finito.")] });
    }
};