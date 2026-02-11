const simulationService = require("../services/simulations/simulationService")
const runSimulationService = require("../services/simulations/runSimulation")
const HttpError = require("../utils/httpError")

const toBool = (value) => String(value || "").trim().toLowerCase() === "true"

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

    const include = String(req.query.include || "").trim().toLowerCase()
    const includeDetails = include === "details"

    const doc = await simulationService.getById(id)

    const response = {
      id: doc._id,
      strategy: doc.strategy,
      status: doc.status,
      params: doc.params,
      summary: doc.result?.summary || null,
      ranAt: doc.result?.ranAt || null,
      error: doc.error,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }

    if (includeDetails) {
      response.trades = doc.result?.trades || []
      response.equity = doc.result?.equity || []
    }

    res.json({ data: response })
  } catch (err) {
    next(err)
  }
},

  runSimulation: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw new HttpError(400, "VALIDATION_ERROR", "id is required")

      const force = toBool(req.query.force)

      const doc = await runSimulationService(id, { force })

      res.json({
        data: {
          id: doc._id,
          status: doc.status,
          summary: doc.result?.summary || null,
          ranAt: doc.result?.ranAt || null,
          resultUrl: `/simulations/${doc._id}?include=details`,
          updatedAt: doc.updatedAt
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
