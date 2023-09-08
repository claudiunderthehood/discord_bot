const { Message, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/AFKSystem.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message){
        if(message.author.bot) return;

        if(message.mentions.members){
           const embed = new MessageEmbed()
           .setColor("RED");

           message.mentions.members.forEach((m) => {
               DB.findOne({GuildID: message.guild.id, UserID: m.id}, async (err, data) => {
                    if(err) throw err;
                    if(data){
                        embed.setDescription(`${m} è AFK <:t${data.Time}:R>\n **Stato**: ${data.Status}`);
                        return message.reply({embeds: [embed]});
                    } 
               })
           });
        }

    }
}