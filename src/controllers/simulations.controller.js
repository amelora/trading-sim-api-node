module.exports = {
  createSimulation: async (req, res, next) => {
    try {
      res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } })
    } catch (err) {
      next(err)
    }
  },

  getSimulationById: async (req, res, next) => {
    try {
      res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } })
    } catch (err) {
      next(err)
    }
  },

  runSimulation: async (req, res, next) => {
    try {
      res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } })
    } catch (err) {
      next(err)
    }
  }
}
