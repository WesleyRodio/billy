const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js")

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Changes the nickname of the chosen server user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "User to change nickname. (ID or mention)  Example: @Billy#1234 or 12345678901234567",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The nickname you want to set."),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)
    ) {
      await interaction.reply({
        content: "You don't have permission to manage nicknames.",
        ephemeral: true,
      })
      return
    }

    const target = interaction.options.getUser("user").id
    const nickname = interaction.options.getString("nickname")
    const user = interaction.guild.members.cache.get(target)

    user
      .setNickname(nickname, `Needed a new nickname.`)
      .then(async () => {
        if (nickname === null) {
          await interaction.reply(`Nickname deleted.`)
          return
        }

        await interaction.reply(
          `Nickname changed to: **${nickname}** of the user <@${target}>.`,
        )
      })
      .catch(async (err) => {
        await interaction.reply({
          content: "The bot does not have permission to manage nicknames.",
          ephemeral: true,
        })
        return
      })
  },
}
