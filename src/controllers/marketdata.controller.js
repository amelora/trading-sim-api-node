module.exports = {
  getPrice: async (req, res, next) => {
    try {
      res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } })
    } catch (err) {
      next(err)
    }
  },

  getHistory: async (req, res, next) => {
    try {
      res.status(501).json({ error: { message: "Not implemented", code: "NOT_IMPLEMENTED" } })
    } catch (err) {
      next(err)
    }
  }
}
