const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  Colors,
} = require("discord.js")

const UserModel = require("../../db/model.js")

module.exports = {
  category: "notes",
  data: new SlashCommandBuilder()
    .setName("notes")
    .setDescription("Displays all your notes."),
  async execute(interaction) {
    const userId = interaction.user.id
    const username = interaction.user.username
    const globalName = interaction.user.globalName

    const userModel = new UserModel()

    try {
      const myNotes = await userModel.getUserNotes(userId)

      if (!myNotes) {
        return await interaction.reply({
          content:
            "❌ You have no registered note yet. Use the command `/newnote` to create one.",
          ephemeral: true,
        })
      }

      let pos = 0
      const createEmbed = (posNote) => {
        if (!myNotes[posNote]) {
          return false
        }

        const {
          title,
          description,
          content,
          priority,
          category,
          image_url,
          tags,
        } = myNotes[posNote]

        const embed = new EmbedBuilder()
          .setColor(Colors.White)
          .setTitle(title)
          .setDescription(description)
          .setFields(
            {
              name: "Content",
              value: content,
            },
            {
              name: "Category",
              value: category,
              inline: true,
            },
          )
          .setFooter({ text: `Priority - ${priority}` })

        if (tags.length > 0) {
          embed.addFields({
            name: "Tags",
            value: `${tags.join(" - ")}`,
            inline: true,
          })
        }

        const regexIMG =
          /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w._-]+\/?)*(\?[\w_-]+=[^?/&]*(&[\w_-]+=[^?/&]*)*)?)?$/

        if (image_url !== "" && regexIMG.test(image_url)) {
          embed.setImage(image_url)
        }
        return embed
      }

      const nextNotes = new ButtonBuilder()
        .setCustomId("nextNotes")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Secondary)

      const prevNotes = new ButtonBuilder()
        .setCustomId("prevNotes")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Secondary)

      const row = new ActionRowBuilder().addComponents(prevNotes, nextNotes)

      const embed = createEmbed(pos)

      if (!embed) {
        return await interaction.reply({
          content:
            "❌ You have no registered note yet. Use the command `/newnote` to create one.",
          ephemeral: true,
        })
      }

      await interaction.reply({
        embeds: [embed],
        components: [row],
      })

      const filter = (btn) =>
        btn.customId === "nextNotes" ||
        (btn.customId === "prevNotes" && btn.user.id === interaction.user.id)

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
      })

      collector.on("collect", async (collect) => {
        if (collect.customId === "nextNotes") {
          pos++

          const embed = createEmbed(pos)

          if (!embed) {
            pos--

            return await collect.reply({
              content:
                "❌ You have reached the end of your notes. Use the command `/newnote` to add more notes.",
              ephemeral: true,
            })
          }

          await collect.update({
            embeds: [embed],
          })
        } else if (collect.customId === "prevNotes") {
          pos--
          const embed = createEmbed(pos)

          if (!embed) {
            pos++
            return await collect.reply({
              content:
                "❌ You have reached the end of your notes. Use the command `/newnote` to add more notes.",
              ephemeral: true,
            })
          }

          await collect.update({
            embeds: [embed],
          })
        }
      })
    } catch (error) {
      // console.error("Erro ao buscar notas:", error)
      await interaction.reply({
        content: "❌ An error occurred when trying to find your notes.",
        ephemeral: true,
      })
    }
  },
}
