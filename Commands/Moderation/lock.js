const { CommandInteraction, MessageEmbed } = require("discord.js");
const db = require("../../Structures/Schemas/LockDown.js");
const ms = require("ms");

module.exports = {
    name: "chiudi",
    description: "Mette in lockdown il canale.",
    permissions: "MANAGE_CHANNELS",
    options: [
        {
            name: "durata",
            description: "Durata del lockdown. (1m, 1h, 1d)",
            type: "STRING"
        },
        {
            name: "motivazione",
            description: "Motivazione del lockdown.",
            type: "STRING"
        }
    ],

    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, channel, options } = interaction;

        const reason = options.getString("motivazione") || "nessuna motivazione.";

        const embed = new MessageEmbed();

        /*if (db.findOne({ChannelID: channel.id}) == channel.id) //!channel.permissionsFor(guild.id).has("SEND_MESSAGES")
            return interaction.reply({
                embeds: [
                    embed.setColor("RED").setDescription(
                        "🛑 | Il canale è già in lockdown."
                    ),
                ],
                ephemeral: true
            });*/

        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: false
        });

        interaction.reply({ embeds: [embed.setColor("RED").setDescription(`🔒 | Il canale è in lockdown perchè: ${reason}`)] });

        const time = options.getString("durata");

        if (time) {
            const expireDate = Date.now() + ms(time);
            db.create({ GuildID: guild.id, ChannelID: channel.id, Time: expireDate });

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {
                    SEND_MESSAGES: null
                });

                interaction.editReply({
                    embeds: [embed.setDescription("🔓 | Il lockdown è terminato.").setColor("GREEN")]
                }).catch(() => { });
                await db.deleteOne({ ChannelID: channel.id });

            }, ms(time));
        }
    },
};
