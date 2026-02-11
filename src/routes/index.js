const express = require("express")
const simulationsRoutes = require("./simulations.routes")
const marketdataRoutes = require("./marketdata.routes")

const router = express.Router()

router.use("/simulations", simulationsRoutes)
router.use("/marketdata", marketdataRoutes)

module.exports = router
