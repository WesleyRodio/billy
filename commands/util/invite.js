const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("The URL of the link to add me to a server."),
  async execute(interaction) {
    await interaction.reply(
      "Add me to your server \:upside_down:\:heart:!\n**URL**: `https://discord.com/oauth2/authorize?client_id=1207452821562335272`"
    );
  },
};
