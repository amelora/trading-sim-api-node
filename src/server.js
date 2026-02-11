require("dotenv").config()

const env = require("./config/env")
const { connectDb } = require("./config/db")
const { createApp } = require("./app")

const start = async () => {
  try {
    await connectDb(env.mongoUri)

    const app = createApp()

    app.listen(env.port, () => {
      console.log(`[server] listening on port ${env.port}`)
    })
  } catch (err) {
    console.error("[server] failed to start", err)
    process.exit(1)
  }
}

start()
