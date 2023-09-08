const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});
const mongoose = require("mongoose");
const { token } = require("./config.json");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const ascii = require("ascii-table");

client.commands = new Collection();
client.voiceGenerator = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();

require("../Systems/GiveawaySys")(client)

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});
module.exports = client;

["events", "commands"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, ascii);
})

client.login(token);
