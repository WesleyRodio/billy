const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Replies with Pong!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "User to change nickname. (ID or mention)  Example: @Billy#1234 or 12345678901234567"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The nickname you want to set.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .setDMPermission(false),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)
    ) {
      await interaction.reply({
        content: "You don't have permission to manage nicknames.",
        ephemeral: true,
      });
      return;
    }

    const target = interaction.options.getUser("user").id;
    const nickname = interaction.options.getString("nickname");
    const user = interaction.guild.members.cache.get(target);
    console.log(user.user);
    
    user
      .setNickname(nickname, `Needed a new nickname.`)
      .then(async () => {
        await interaction.reply(
          `Nickname changed to: ${nickname} of the user <@${target}>.`
        );
      })
      .catch(async (err) => {
        await interaction.reply({
          content: "The bot does not have permission to manage nicknames.",
          ephemeral: true,
        });
        return;
      });
  },
};
