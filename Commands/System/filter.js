const { CommandInteraction, Client } = require("discord.js");
const Schema = require("../../Structures/Schemas/FilterDB.js");
const sourcebin = require("sourcebin");

module.exports = {
  name: "filtra",
  description: "Filtra parole proibite in un canale a scelta.",
  permission: "MANAGE_MESSAGES",
  options: [
    {
      name: "ripristina",
      description: "Cancella tutte le parole nel dizionario",
      type: "SUB_COMMAND",
    },
    {
      name: "stampa",
      description: "Stampa tutte le parole presenti nel dizionario.",
      type: "SUB_COMMAND",
    },
    {
      name: "impostazioni",
      description: "Imposta il filtro.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "canale",
          description: "Seleziona il canale dove fare il dump",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
        },
      ],
    },
    {
      name: "dizionario",
      description: "Aggiunge o rimuove parole dalla blacklist.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "opzioni",
          description: "Seleziona un'opzione",
          type: "STRING",
          required: true,
          choices: [
            { name: "Aggiungi", value: "add" },
            { name: "Rimuovi", value: "remove" },
          ],
        },
        {
          name: "parola",
          description:
            "Parola da bandire, ne puoi aggiungere diverse mettendo la virgola tra le parole.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const SETTINGS = "impostazioni";
    const DICTIONARY = "dizionario";
    const CLEAN = "ripristina";
    const PRINT = "stampa";

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case PRINT:
        const data = await Schema.findOne({ Guild: guild.id });

        if (!data)
          return interaction.reply({
            content: "Non ci sono parole da stampare sul dizionario.",
          });

        await sourcebin.create(
          [
            {
              content: `${data.Words.map((w) => w).join("\n") || "Non ci sono parole nel dizionario."}`,
              language: "text",
            },
          ],
          {
            title: `${guild.name} | Dizionario`,
            description: "Parole bannabili nel server.",
          }
        ).then((bin) => {
          interaction.reply({ content: bin.url });
        }).catch((e) => {});

        break;

      case CLEAN:
        await Schema.findOneAndUpdate({ Guild: guild.id }, { Words: [] });
        client.filters.set(guild.id, []);
        interaction.reply({ content: "Dizionario ripristinato." });
        break;

      case SETTINGS:
        const blChannel = options.getChannel("canale").id;

        await Schema.findOneAndUpdate(
          { Guild: guild.id },
          { Log: blChannel },
          { new: true, upsert: true }
        );

        client.filtersLog.set(guild.id, blChannel);

        interaction.reply({
          content: `Aggiunto <#${blChannel}> come canale dove dumpare`,
          ephemeral: true,
        });
        break;

      case DICTIONARY:
        const choice = options.getString("opzioni");
        const words = options.getString("parola").toLowerCase().split(",");

        switch (choice) {
          case "add":
            Schema.findOne({ Guild: guild.id }, async (err, data) => {
              if (err) throw err;
              if (!data) {
                await Schema.create({
                  Guild: guild.id,
                  Log: null,
                  Words: words,
                });

                client.filters.set(guild.id, words);

                let gram, agg;

                if (words.length <= 1) {
                  agg = "Aggiunta";
                  gram = "parola";
                } else {
                  agg = "Aggiunte";
                  gram = "parole";
                }

                return interaction.reply({
                  content: `${agg} ${words.length} ${gram} al dizionario.`,
                });
              }

              const nWords = [];
              let found = false;
              words.forEach((w) => {
                if (data.Words.includes(w)) {
                  found = true;
                  return;
                }
                nWords.push(w);
                data.Words.push(w);
                client.filters.get(guild.id).push(w);
              });

              if (found) {
                interaction.reply({ content: "Parola già presente." });
                return;
              }

              let gram, agg;

              if (words.length <= 1) {
                agg = "Aggiunta";
                gram = "parola";
              } else {
                agg = "Aggiunte";
                gram = "parole";
              }

              interaction.reply({
                content: `${agg} ${words.length} ${gram} al dizionario.`,
              });

              data.save();
            });

            break;

          case "remove":
            Schema.findOne({ Guild: guild.id }, async (err, data) => {
              if (err) throw err;
              if (!data) {
                return interaction.reply({ content: "Il dizionario è vuoto" });
              }

              const rWords = [];
              let found = false;
              words.forEach((w) => {
                if (!data.Words.includes(w)) {
                  found = true;
                  return;
                }
                data.Words.remove(w);
                rWords.push(w);
              });

              if (found) {
                interaction.reply({ content: "Parola non trovata." });
                return;
              }

              const arr = await client.filters
                .get(guild.id)
                .filter((word) => !rWords.includes(word));

              client.filters.set(guild.id, arr);

              let gram, agg;

              if (rWords.length <= 1) {
                agg = "Rimossa";
                gram = "parola";
              } else {
                agg = "Rimosse";
                gram = "parole";
              }

              interaction.reply({
                content: `${agg} ${rWords.length} ${gram} dal dizionario.`,
              });
              data.save();
            });
            break;
        }
        break;
    }
  },
};
