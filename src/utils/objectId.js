const mongoose = require("mongoose")

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""))

module.exports = { isValidObjectId }
