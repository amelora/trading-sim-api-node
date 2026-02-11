const simulationService = require("../services/simulations/simulationService")
const runSimulationService = require("../services/simulations/runSimulation")
const HttpError = require("../utils/httpError")

module.exports = {
  createSimulation: async (req, res, next) => {
    try {
      const body = req.body || {}
      const strategy = body.strategy || "grid"
      const params = body.params || {}

      const doc = await simulationService.create({ strategy, params })

      res.status(201).json({
        data: {
          id: doc._id,
          strategy: doc.strategy,
          status: doc.status,
          params: doc.params,
          createdAt: doc.createdAt
        }
      })
    } catch (err) {
      next(err)
    }
  },

  getSimulationById: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw new HttpError(400, "VALIDATION_ERROR", "id is required")

      const doc = await simulationService.getById(id)

      res.json({
        data: {
          id: doc._id,
          strategy: doc.strategy,
          status: doc.status,
          params: doc.params,
          result: doc.result,
          error: doc.error,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        }
      })
    } catch (err) {
      next(err)
    }
  },

  runSimulation: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw new HttpError(400, "VALIDATION_ERROR", "id is required")

      const doc = await runSimulationService(id)

      res.json({
        data: {
          id: doc._id,
          status: doc.status,
          result: doc.result,
          error: doc.error,
          updatedAt: doc.updatedAt
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
