const express = require("express")
const controller = require("../controllers/simulations.controller")

const router = express.Router()

router.post("/", controller.createSimulation)
router.get("/:id", controller.getSimulationById)
router.post("/:id/run", controller.runSimulation)

module.exports = router
