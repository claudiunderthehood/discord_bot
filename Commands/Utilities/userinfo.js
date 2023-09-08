const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    type: "USER",
    context: true,
    permission: "ADMINISTRATOR",
    /**
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction){
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new MessageEmbed()
        .setColor("AQUA")
        .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
        .addField("ID", `${target.user.id}`)
        .addField("Ruoli", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"}`)
        .addField("Nel server da", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
        .addField("Su Discord da", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)

        interaction.reply({embeds: [Response], ephemeral: true});
    }

}