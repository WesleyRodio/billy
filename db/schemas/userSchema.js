const { default: mongoose } = require("mongoose")

module.exports = {
  _id: { type: String, required: true },
  username: {
    type: String,
    default: "",
  },
  globalName: {
    type: String,
    default: "Usuário sem nome",
  },

  email: {
    type: String,
    default: "Email não cadastrado",
  },
  birthdate: {
    type: String,
    default: "Data de nascimento não cadastrada",
  },
  instagram: {
    type: String,
    default: "@ não cadastrado",
  },
  twitter: {
    type: String,
    default: "@ não cadastrado",
  },
  notes: {
    type: [
      new mongoose.Schema(
        {
          title: {
            type: String,
            required: true,
            default: "Nota sem título",
          },
          description: {
            type: String,
            default: "",
          },
          content: {
            type: String,
            require: true,
          },
          priority: {
            type: Number,
            default: 1,
          },
          category: {
            type: String,
            default: "General",
          },
          image_url: {
            type: String,
            default: "",
          },
          tags: {
            type: [String],
            default: [],
          },
          created_at: {
            type: Date,
            default: Date.now,
          },
        },
        { _id: true },
      ),
    ],
    default: [],
  },
}
