const { Events } = require("../Validation/eventNames.js");


module.exports = async (client, PG, ascii) => {
    const table = new ascii("Eventi caricati");
    (await PG(`${process.cwd()}/Events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if(!Events.includes(event.name) || !event.name){
            const l = file.split("/");
            await table.addRow(`${event.name || "Evento non trovato"}`, `😪 Il nome dell'evento è errato o mancante: ${l[6] + '/' + l[7]}`);
            return;
        }

        if(event.once){
            client.once(event.name, (...args) => event.execute(...args, client));
        }else{
            client.on(event.name, (...args) => event.execute(...args, client));
        };


        await table.addRow(event.name, "😍 L'Evento è stato caricato correttamente." );
    });

    console.log(table.toString());

}