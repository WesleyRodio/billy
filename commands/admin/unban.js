const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  category: "admin",
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban the mentioned user from this server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be unbanned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for unbanning.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    const confirm = new ButtonBuilder()
      .setCustomId("confirmUnban")
      .setLabel("Confirm Unban")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);

    const reply = await interaction.reply({
      content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
      components: [row],
    });

    const filter = (click) => click.user.id === interaction.user.id;
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      max: 1,
      maxComponents: 2,
      maxUsers: 1,
      filter,
    });

    collector.on("collect", (interaction) => {
      if (interaction.customId === "confirmUnban") {
        interaction.guild.members
          .unban(target)
          .then(() => {
            interaction.reply("Unban successful!");
          })
          .catch(() => {
            interaction.reply("Failed to unban the user.");
          });
      } else {
        collector.checkEnd(true);
        interaction.reply("Unban canceled.");
      }
    });
  },
};
