const express = require("express")
const path = require("path")
const routes = require("./routes")
const notFound = require("./middlewares/notFound")
const errorHandler = require("./middlewares/errorHandler")

const createApp = () => {
  const app = express()

  app.use(express.json())

  // static demo UI (before routes + notFound)
  app.use(express.static(path.resolve(__dirname, "..", "public")))

  app.get("/health", (req, res) => {
    res.json({ data: { status: "ok" } })
  })

  app.use("/", routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = { createApp }
