const { SlashCommandBuilder } = require("discord.js");
const { exec } = require("node:child_process");

module.exports = {
  private: true,
  category: "dev",
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

    const keyLocation = Object.keys(require.cache)
      .filter((key) => {
        const ver1 = key.indexOf(`${command.data.name}`) !== -1;
        const ver2 = key.indexOf(`commands`) !== -1;

        return ver1 && ver2;
      })
      .shift();

    delete require.cache[keyLocation];

    try {
      const newCommand = require(keyLocation);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      exec(`node ./deploy-commands.js`, (error, stdout, stderr) => {
        if (error) {
          console.error(`\nerror: ${error.message}`);
        }

        if (stderr) {
          console.error(`\nstderr: ${stderr}`);
          return;
        }

        console.log(`\n${stdout}`);
      });
      await interaction.reply(
        `Command \`${newCommand.data.name}\` was realoaded`
      );
    } catch (err) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
      );
    }
  },
};
