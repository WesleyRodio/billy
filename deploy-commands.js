require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = pushFile("commands");

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

    console.log(
      `Successfully refreshed ${normalCommands.length} application (/) commands.`
    );
  } catch (err) {
    console.error(err);
  }
})();

function pushFile(fileName) {
  const files = [];
  const foldersPath = path.join(__dirname, fileName);
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
        files.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  return files;
}
