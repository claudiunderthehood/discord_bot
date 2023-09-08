const { Perms } = require("../Validation/permissions.js");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = async (client, PG, ascii) => {
    const table = new ascii("Comandi UP");

    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name) return table.addRow(file.split("/")[7], "😕 Errore", "Nome mancante.");

        if(command.type !== "USER" && !command.description) return table.addRow(command.name, "😕 Errore", "Descrizione mancante.");

        if(command.permission){
            if(Perms.includes(command.permission)){
                command.defaultPermission = false;
            }else{
                return table.addRow(command.name, "😕 Errore", "Permesso mancante.");
            }
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await table.addRow(command.name, "🤩 OK");
                
        
    });

    console.log(table.toString());

    // CONTROLLO PERMESSI //

    client.on("ready", async () => {
       const MainGuild = await client.guilds.cache.get(""); //here channel id

       MainGuild.commands.set(CommandsArray).then(async (command) => {
          const Roles = (commandName) => {
              const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;

              if(!cmdPerms) return null;

              return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
          }

          const fullPermissions = command.reduce((accumulator, r) => {
              const roles = Roles(r.name);
              if(!roles) return accumulator;

              const permissions = roles.reduce((a, r) => {
                 return [...a, {id: r.id, type: "ROLE", permission: true}];
              }, []);

              return [...accumulator, {id: r.id, permissions}]
          }, []);

          //await MainGuild.commands.permissions.set({ fullPermissions });
       });
    });

}