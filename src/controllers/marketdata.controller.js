const marketDataService = require("../services/marketdata/marketDataService")
const HttpError = require("../utils/httpError")

const normalizeCoinId = (value) => String(value || "").trim().toLowerCase()
const normalizeVs = (value) => String(value || "").trim().toLowerCase()

module.exports = {
  getPrice: async (req, res, next) => {
    try {
      const coinId = normalizeCoinId(req.query.coinId || req.query.coin || "bitcoin")
      const vsCurrency = normalizeVs(req.query.vsCurrency || req.query.vs || "usd")

      if (!coinId) throw new HttpError(400, "VALIDATION_ERROR", "coinId is required")
      if (!vsCurrency) throw new HttpError(400, "VALIDATION_ERROR", "vsCurrency is required")

      const data = await marketDataService.getPrice({ coinId, vsCurrency })

      res.json({ data })
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
