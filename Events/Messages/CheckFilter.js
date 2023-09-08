const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    if (message.author.bot) return;

    const immuneChannel = "";

    const { content, guild, author, channel } = message;
    const mesContent = content.toLowerCase().split(" ");
    const fullMess = content.toLowerCase();

    if(!guild) return;
    const filter = client.filters.get(guild.id);
    if (!filter) return;

    const wordsUsed = [];
    let cancel = false;

    mesContent.forEach((word) => {
      if ((filter.includes(word)) || (filter.includes(fullMess)) && (message.channel.id != immuneChannel)) {
        wordsUsed.push(word);
        wordsUsed.push(fullMess);
        cancel = true;
      }
    });

    if (cancel) message.delete().catch(() => {});

    if (wordsUsed.length) {
      const channelID = client.filtersLog.get(guild.id);

      if (!channelID) return;

      const obj = guild.channels.cache.get(channelID);

      if (!obj) return;

      let f, s;

      if (wordsUsed.length <= 1) {
        f = "È stata utilizzata";
        s = "parola";
      } else {
        f = "Sono state utilizzate";
        s = "parole";
      }

      const embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor({
          name: author.tag,
          iconURL: author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          [
            `${f} ${wordsUsed.length} ${s} dal dizionario nel canale ${channel} =>`,
            `\`${wordsUsed.map((w) => w)}\``,
          ].join("\n")
        );

      obj.send({ embeds: [embed] });

    }
  },
};
