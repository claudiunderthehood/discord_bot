const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { database } = require("../../Structures/config.json");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log("Client's UP UP UPPP the stars!");
    client.user.setActivity("On", {
      type: "WATCHING",
    });

    if (!database) return;
    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("The client has been connected to the database.");
      })
      .catch((err) => {
        console.log(err);
      });

    require("../../Systems/LockDownSys.js")(client);
    require("../../Systems/filterSys.js")(client);
  },
};
