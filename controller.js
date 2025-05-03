const fs = require("fs")

const { Signale } = require("signale")

module.exports = function ({ text, type }) {
  if (typeof text !== "string" || typeof type !== "string") {
    throw new Error("Logger params must be strings")
  }

  const logger = new Signale()

  const types = {
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    success: logger.success.bind(logger),
    debug: logger.debug.bind(logger),
  }

  const dateNow = new Date().toLocaleDateString()
  const timeNow = new Date().toLocaleTimeString()
  const textLog = `[${dateNow} ${timeNow} | ${new Date().getTime()} ms] - ${text}`

  if (types[type]) {
    types[type](textLog)
  } else {
    throw new Error(`Invalid log type: ${type}`)
  }

  fs.writeFileSync("logs.txt", `\n${textLog}`, { flag: "a" })
}
