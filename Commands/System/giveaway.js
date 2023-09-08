const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "giveaway",
    description: "Sistema di giveaway.",
    permission: "ADMINISTRATOR",
    options: [
        {
           name: "avvia",
           description: "Avvia un giveaway.",
           type: "SUB_COMMAND",
           options: [
               {
                   name: "durata",
                   description: "Dai una dutata al giveaway (1m, 1h, 1d)",
                   type: "STRING",
                   required: true
               },
               {
                   name: "vincitori",
                   description: "Seleziona il numero di vincitori del giveaway",
                   type: "INTEGER",
                   required: true
               },
               {
                    name: "premio",
                    description: "Nome del premio.",
                    type: "STRING",
                    required: true
               },
               {
                   name: "canale",
                   description: "Seleziona il canale dove far partire il giveaway.",
                   type: "CHANNEL",
                   channelTypes: ["GUILD_TEXT"]
               }
           ]
        },
        {
            name: "azioni",
            description: "Opzioni del giveaway.",
            type: "SUB_COMMAND",
            options: [ 
                {
                    name: "opzioni",
                    description: "Seleziona un'opzione.",
                    type: "STRING",
                    required: true,
                    choices: [
                        { 
                            name: "fine",
                            value: "fine"
                        },
                        {
                            name: "pausa",
                            value: "pausa"
                        },
                        {
                            name: "riprendi",
                            value: "riprendi"
                        },
                        {
                            name: "rimescola",
                            value: "rimescola"
                        },
                        {
                            name: "cancella",
                            value: "cancella"
                        }
                    ]
                },
                { 
                    name: "message-id",
                    description: "Inserisci l'id del messaggio del giveaway.",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    /** 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client){
        const { options } = interaction;

        const sub = options.getSubcommand();

        const errorEmbed = new MessageEmbed()
        .setColor("RED");

        const successEmbed = new MessageEmbed()
        .setColor("GREEN");

        switch(sub){
            case "avvia": {
                const gchannel = options.getChannel("canale") || interaction.channel;
                const duration = options.getString("durata");
                const winnerCount = options.getInteger("vincitori");
                const prize = options.getString("premio");

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    messages: {
                        giveaway: "🎊 **INIZIO DEL GIVEAWAY** 🎊 ",
                        giveawayEnded: "🙌 **FINE DEL GIVEAWAY** 🙌",
                        winMessage: `Congratulazioni, {winners}! Hai vinto **{this.prize}**!`
                    }
                }).then(async () => {
                    successEmbed.setDescription("Il giveaway è stato avviato correttamente.");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true});
                }).catch((err) => {
                    errorEmbed.setDescription(`Riscontrato un errore\n\`${err}\``);
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                });

            }
            break;

            case "azioni": {
                const choice = options.getString("opzioni");
                const messageId = options.getString("message-id");
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                if(!giveaway){
                    errorEmbed.setDescription(`Impossibile trovare il giveaway tramite l'id: ${messageId} in questo server`);
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                }

                switch(choice){
                    case "fine": {
                        client.giveawaysManager.end(messageId).then(() => {
                            successEmbed.setDescription("Il giveaway è stato concluso.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`Riscontrato un errore\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "pausa": {
                        client.giveawaysManager.pause(messageId).then(() => {
                            successEmbed.setDescription("Il giveaway è stato messo in pausa.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`Riscontrato un errore\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "riprendi": {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            successEmbed.setDescription("Il giveaway è ripreso.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`Riscontrato un errore\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "rimescola": {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            successEmbed.setDescription("Il giveaway è stato rimescolato.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`Riscontrato un errore\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case "cancella": {
                        client.giveawaysManager.delete(messageId).then(() => {
                            successEmbed.setDescription("Il giveaway è stato cancellato.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`Riscontrato un errore\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;
                }
            }
            break;

            default: {
                console.log("Errore nel comando giveaway.");
            }


        }

    }

}