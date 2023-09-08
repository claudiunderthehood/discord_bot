const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "pulisci",
    description: "Cancella un numero dei messagi da un canale o di un utente specificato.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "quantità",
            description: "Quanti messaggi elliminare.",
            type: "NUMBER",
            required: true
        },
        {
            name: "utente",
            description: "utente di cui eliminare i messaggi",
            type: "USER",
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
        const { channel, options } = interaction;

        const amount = options.getNumber("quantità");
        const target = options.getMember("utente");

        const messages = await channel.messages.fetch();
        const Response = new MessageEmbed()
        .setColor("LUMINOUS_VIVID_PINK")

        if(amount > 100 || amount <= 0) {
            Response.setDescription(`Il numero di messaggi deve essere compreso tra 1 e 100.`)
            return interaction.reply({embeds: [Response]});
        }   

        if(target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((m) => {
                if((m.author.id === target.id) && (amount > i)){
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Cancellati ${messages.size} messaggi dell'utente ${target}.`);
                interaction.reply({embeds: [Response]});
            });
        }else{
            await channel.bulkDelete(amount, true).then(messages => {
                Response.setDescription(`🧹 Cancellati ${messages.size} messaggi dal canale.`);
                interaction.reply({embeds: [Response]});
            });
        }
    }

}