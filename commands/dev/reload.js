const { SlashCommandBuilder } = require("discord.js");
const { readFileSync } = require("fs");

module.exports = {
  private: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a command.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to reload")
        .setRequired(true)
    ),
  async execute(interaction) {
    const commandName = interaction.options
      .getString("command", true)
      .toLowerCase();

    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(
        `There is no command with name \`${commandName}\`!`
      );
    }

    const keyLocation = Object.keys(require.cache).filter((key) => {
      const ver1 = key.indexOf(`${command.data.name}`) !== -1;
      const ver2 = key.indexOf(`commands`) !== -1;

      return ver1 && ver2;
    });

    delete require.cache[keyLocation];

    const file = readFileSync(`./${command.data.name}.js`);
    console.log(file);

    /*  try {
      const newCommand = require(keyLocation);
      interaction.client.
    } catch (err) {

    } */

    return interaction.reply(`./${command.data.name}.js`);
  },
};
