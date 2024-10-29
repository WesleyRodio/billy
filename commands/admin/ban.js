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
    .setName("ban")
    .setDescription("Bans the mentioned user from this server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be banned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    const confirm = new ButtonBuilder()
      .setCustomId("confirmBan")
      .setLabel("Confirm Ban")
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
      if (interaction.customId === "confirmBan") {
        const user = interaction.guild.members.cache.get(target);
        interaction.member
          .ban({ reason: reason })
          .then(() => {
            interaction.reply("Ban successful!");
          })
          .catch(() => {
            interaction.reply("Failed to ban the user.");
          });
      } else {
        collector.checkEnd(true);
        interaction.reply("Ban canceled.");
      }
      console.log(interaction.customId);
      
    });
  },
};
