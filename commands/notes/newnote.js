const { SlashCommandBuilder } = require("discord.js")

const UserModel = require("../../db/model.js")

module.exports = {
  category: "notes",
  data: new SlashCommandBuilder()
    .setName("newnote")
    .setDescription("Add a new note to your list.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the note.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description of the note.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content of the note.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("priority")
        .setDescription("The priority of the note. (1-10)"),
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription(
          "The category of the note. (e.g., Homework, Study, Project) 30 characters max.",
        )
        .setMaxLength(30),
    )
    .addStringOption((option) =>
      option
        .setName("image_url")
        .setDescription("The URL of the image associated with the note."),
    )
    .addStringOption((option) =>
      option
        .setName("tags")
        .setDescription(
          "The tags associated with the note. (e.g., Adventure Survival Project) 30 characters max.",
        )
        .setMaxLength(30),
    ),
  async execute(interaction) {
    const userId = interaction.user.id
    const username = interaction.user.username
    const globalName =
      interaction.user.globalName ||
      interaction.user.displayName ||
      interaction.user.username

    const userModel = new UserModel()

    try {
      const newUser = await userModel.createUser({
        userId,
        username,
        globalName,
      })

      if (!newUser) {
        return await interaction.reply({
          content: "❌\tFailed to create your profile. Please try again later.",
          ephemeral: true,
        })
      }

      let tags = interaction.options.getString("tags")
      const title = interaction.options.getString("title")
      const description = interaction.options.getString("description")
      const content = interaction.options.getString("content")
      const priority = parseInt(interaction.options.getString("priority")) || 1
      const category = interaction.options.getString("category") || "General"
      const image_url = interaction.options.getString("image_url") || ""

      if (!tags) {
        tags = []
      } else {
        tags = tags.split(" ")
      }

      const dataNewNote = {
        userId,
        title,
        description,
        content,
        priority,
        category,
        image_url,
        tags,
      }

      const regexIMG =
        /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w._-]+\/?)*(\?[\w_-]+=[^?/&]*(&[\w_-]+=[^?/&]*)*)?)?$/

      if (image_url !== "" && !regexIMG.test(image_url)) {
        return await interaction.reply({
          content:
            "❌\tThe image URL provided is not valid. Please provide a valid image URL or leave it blank.",
          ephemeral: true,
        })
      }

      const note = await userModel.createUserNote(dataNewNote)

      if (!note) {
        return await interaction.reply({
          content: "❌ Failed to create your note. Please try again later.",
          ephemeral: true,
        })
      }

      await interaction.reply({
        content: ":white_check_mark:\tNote created successfully!",
      })

      // followUp envia uma nova mensagem mencionando a mensagem anterior enviada
      // const notesText = await userModel.getUserNotes(userId)

      // await interaction.followUp({
      //   content: notesText,
      // })
    } catch (error) {
      console.error("Erro ao criar nota:", error)
      await interaction.reply({
        content:
          "❌\tAn error occurred when trying to create your note. Please try again later.",
        ephemeral: true,
      })
    }
  },
}
