const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  category: "messages",
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Replies with Embed!")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title for the embed.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description for the embed.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("The image to attach to the embed.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(
          "If you want a color that suits your taste. (hexacolor)"
        )
    ),
  async execute(interaction) {
    const opts = interaction.options._hoistedOptions;
    const title = opts[0].value;
    const desc = opts[1].value;
    const image = opts[2].value;
    let color = "#";

    const regexIMG =
      /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w\._-]+\/?)*(\?[\w_-]+=[^\?\/&]*(\&[\w_-]+=[^\?\/&]*)*)?)?$/;

    const regexCOLOR =
      /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})|([0-9a-fA-F]{3})$/;

    if (!regexIMG.test(image)) {
      return interaction.reply("Invalid image URL.");
    }

    if (opts[3]) {
      color = opts[3].value;

      if (!regexCOLOR.test(color)) {
        return interaction.reply("Invalid color. Use HEX format.");
      }
    }

    const hexValues = "0123456789ABCDEF";

    if (!opts[3]) {
      for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * hexValues.length);
        color += hexValues[index];
      }
    }

    const userName = interaction.user.globalName;
    const avatarURL = interaction.user.displayAvatarURL({ extension: "jpg" });
    const guildIconURL = interaction.guild.iconURL();

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(desc)
      .setAuthor({ name: userName, iconURL: avatarURL })
      .setThumbnail(guildIconURL)
      .setImage(image)
      .setTimestamp()
      .setFooter({
        text: "Embed attached.",
        iconURL: guildIconURL,
      });

      console.log(`Resultado da embed: `, embed);
      

    await interaction.reply({ embeds: [embed] });
  },
};
