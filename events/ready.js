const { Events } = require("discord.js");
const logger = require("../controller.js");
module.exports = {
  category: "utility",
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger({
      text: `Ready! Logged in as ${client.user.tag}`, type: "success"
    })
  },
};
