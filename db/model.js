const Con = require("./connection.js")

module.exports = class UserModel {
  constructor() {
    this.User = Con()
  }

  async #findOrCreateUser({ _id = "", username = "", globalName = "" }) {
    if (
      typeof _id !== "string" ||
      typeof username !== "string" ||
      typeof globalName !== "string"
    ) {
      throw new Error("Invalid input type.")
    }

    let user = await (await this.User).findById(_id)

    if (!user) {
      user = (await this.User).create({ _id, username, globalName })
    }

    return user
  }

  async #createNote({
    userId = "",
    title = "",
    description = "",
    content = "",
    priority = 1,
    category = "General",
    image_url = "",
    tags = [],
  }) {
    if (
      typeof userId !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof content !== "string" ||
      typeof priority !== "number" ||
      typeof category !== "string" ||
      typeof image_url !== "string" ||
      !Array.isArray(tags)
    ) {
      throw new Error("Invalid input type.")
    }

    const user = await (await this.User).findById(userId)

    if (!user) throw new Error("User not found.")

    const newNote = {
      title,
      description,
      content,
      priority,
      category,
      image_url,
      tags,
    }

    user.notes.push(newNote)

    await user.save()

    return user.notes
  }

  async #getNotes(userId) {
    if (typeof userId !== "string") throw new Error("Invalid user ID.")

    return (await (await this.User).findById(userId).populate("notes"))?.notes
  }

  async createUser({ userId, username, globalName }) {
    return await this.#findOrCreateUser({
      _id: userId,
      username,
      globalName,
    })
  }

  async createUserNote({
    userId = "",
    title = "",
    description = "",
    content = "",
    priority = 1,
    category = "General",
    image_url = "",
    tags = [],
  }) {
    return await this.#createNote({
      userId,
      title,
      description,
      content,
      priority,
      category,
      image_url,
      tags,
    })
  }

  async getUserNotes(userId) {
    return await this.#getNotes(userId)
  }
}
