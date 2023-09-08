const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "canale",
    description: "Controlla il tuo canale vocale",
    options: [
        {
            name: "invita",
            type: "SUB_COMMAND",
            description: "Invita un utente nel tuo canale vocale",
            options: [
                {
                    name: "utente",
                    type: "USER",
                    required: true,
                    description: "Seleziona l'utente che vuoi invitare."
                }
            ]
        },
        {
            name: "scomunica",
            type: "SUB_COMMAND",
            description: "Leva all'utente accesso al canale.",
            options: [
                {
                    name: "utente",
                    type: "USER",
                    required: true,
                    description: "Seleziona l'utente che vuoi invitare."
                }
            ]
        },
        {
            name: "nome",
            type: "SUB_COMMAND",
            description: "Cambia il nome del canale.",
            options: [
                {
                    name: "inserisci",
                    type: "STRING",
                    required: true,
                    description: "Digita il nome che vuoi dare al canale."
                }
            ]
        },
        {
            name: "stato",
            type: "SUB_COMMAND",
            description: "Apre il canale a tutti.",
            options: [
                {
                    name: "abilita",
                    type: "STRING",
                    required: true,
                    description: "Apre o chiude il canale a tutti.",
                    choices: [
                        { name: "on", value: "on" },
                        { name: "off", value: "off" }
                    ]
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client){
        const { options, member, guild } = interaction;

        const subCommand = options.getSubcommand();
        const voiceChannel = member.voice.channel;
        const embed = new MessageEmbed().setColor("GREEN");
        const ownedChannel = client.voiceGenerator.get(member.id);

        if(!voiceChannel) 
            return interaction.reply({embeds: [embed.setDescription("Non sei in alcun canale vocale.").setColor("RED")]});

        if(!ownedChannel || voiceChannel.id !== ownedChannel)
            return interaction.reply({embeds: [embed.setDescription("Non sei il proprietario di questo o alcun canale.").setColor("RED")]});

        switch(subCommand){
            case "nome": {
                const newName = options.getString("inserisci");
                if(newName.length > 22 || newName.length < 1)
                    return interaction.reply({embeds: [embed.setDescription("Il nome non può superare i 22 caratteri e deve essere più lungo di 1.")
                    .setColor("RED")], ephemeral: true});

                voiceChannel.edit({name: newName});
                interaction.reply({embeds: [embed.setDescription(`Il nome del canale ora è ${newName}`)], ephemeral: true});
            }
            break;

            case "invita": {
                const targetMember = options.getMember("utente");
                voiceChannel.permissionOverwrites.edit(targetMember, {CONNECT: true});

                targetMember.send({embeds: [embed.setDescription(`L'utente ${member}, ti ha invitato nel canale <#${voiceChannel.id}>`)]});
                interaction.reply({embeds: [embed.setDescription(`L'utente ${targetMember} è stato invitato.`)], ephemeral: true});
            }
            break;

            case "scomunica": {
                const targetMember = options.getMember("utente");
                voiceChannel.permissionOverwrites.edit(targetMember, {CONNECT: false});

                if(targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id)  targetMember.voice.setChannel(null);
                interaction.reply({embeds: [embed.setDescription(`L'utente ${targetMember} è stato rimosso da questo canale.`)], ephemeral: true});
            }
            break;

            case "stato": {
                const choice = options.getString("abilita");
                switch(choice){
                    case "on": {
                        voiceChannel.permissionOverwrites.edit(guild.id, {CONNECT: null});
                        interaction.reply({embeds: [embed.setDescription("Il canale è aperto a tutti.")], ephemeral: true});
                    }
                    break;

                    case "off": {
                        voiceChannel.permissionOverwrites.edit(guild.id, {CONNECT: false});
                        interaction.reply({embeds: [embed.setDescription("Il canale è chiuso.")], ephemeral: true});
                    }
                    break;
                }
            }
            break;
        }
    }
}