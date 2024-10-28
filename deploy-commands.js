require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
// const privateCommands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandsFile = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (file of commandsFile) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      /* if ("private" in command) {
        privateCommands.push(command.data.toJSON());
      } else {
        commands.push(command.data.toJSON());
      } */

      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const normalCommands = await rest.put(
      Routes.applicationCommands(clientId),
      {
        body: commands,
      }
    );

    /* const devCommands = await rest.put(
      Routes.applicationCommands(clientId, guildId),
      {
        body: privateCommands,
      }
    ); */

    console.log(
      `Successfully refreshed ${normalCommands.length} application (/) commands.`
    );
  } catch (err) {
    console.error(err);
  }
})();
