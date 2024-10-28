const { Events } = require("discord.js");

module.exports = {
  category: "utility",
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`\nReady! Logged in as ${client.user.tag}`);
  },
};
