const mongoose = require("mongoose")

const connectDb = async (mongoUri) => {
  mongoose.set("strictQuery", true)

  await mongoose.connect(mongoUri)

  return mongoose.connection
}

module.exports = { connectDb }
