const marketDataService = require("../services/marketdata/marketDataService")
const HttpError = require("../utils/httpError")

const normalizeCoinId = (value) => String(value || "").trim().toLowerCase()
const normalizeVs = (value) => String(value || "").trim().toLowerCase()


const toInt = (value) => {
  const n = Number.parseInt(String(value), 10)
  return Number.isFinite(n) ? n : null
}

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
      const coinId = normalizeCoinId(req.query.coinId || req.query.coin || "bitcoin")
      const vsCurrency = normalizeVs(req.query.vsCurrency || req.query.vs || "usd")

      const days = toInt(req.query.days || 30)
      const interval = req.query.interval ? String(req.query.interval).trim().toLowerCase() : undefined

      if (!coinId) throw new HttpError(400, "VALIDATION_ERROR", "coinId is required")
      if (!vsCurrency) throw new HttpError(400, "VALIDATION_ERROR", "vsCurrency is required")

      if (!days || days <= 0) throw new HttpError(400, "VALIDATION_ERROR", "days must be a positive integer")
      if (days > 3650) throw new HttpError(400, "VALIDATION_ERROR", "days is too large")

      if (interval && !["daily", "hourly"].includes(interval)) {
        throw new HttpError(400, "VALIDATION_ERROR", "interval must be 'daily' or 'hourly'")
      }

      const data = await marketDataService.getHistory({ coinId, vsCurrency, days, interval })

      res.json({ data })
    } catch (err) {
      next(err)
    }
  }
}
