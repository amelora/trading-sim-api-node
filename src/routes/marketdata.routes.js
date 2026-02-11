const express = require("express")
const controller = require("../controllers/marketdata.controller")

const router = express.Router()

router.get("/price", controller.getPrice)
router.get("/history", controller.getHistory)

module.exports = router
