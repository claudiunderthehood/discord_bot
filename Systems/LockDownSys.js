const { Client } = require("discord.js");
const db = require("../Structures/Schemas/LockDown.js");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
    db.find().then(async (documentsArray) => {
        documentsArray.forEach(async (d) => {
            const channel = client.guilds.cache.get(d.GuildID).channels.cache.get(d.ChannelID);
            if (!channel) return;

            const timeNow = Date.now();
            if (d.time < timeNow){
                channel.permissionOverwrites.edit(d.GuildID, {
                    SEND_MESSAGES: null
                });

                return await db.deleteOne({ ChannelID: channel.id });
            }

            const expireDate = d.time - Date.now();

            setTimeout(async () => {
                channel.permissionOverwrites.edit(d.GuildID, {
                    SEND_MESSAGES: null
                });

                await db.deleteOne({ ChannelID: channel.id });
            }, expireDate);

        });
    });
}