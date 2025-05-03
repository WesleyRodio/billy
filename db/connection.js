const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()
const typeUserSchema = require("./schemas/userSchema.js")

module.exports = async function Con() {
  await mongoose.connect(process.env.MONGODB_URI)

  const userSchema = new mongoose.Schema(typeUserSchema, { timestamps: true })

  const User = mongoose.models.User || mongoose.model("User", userSchema)

  return User
}
