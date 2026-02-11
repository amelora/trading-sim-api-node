const Simulation = require("../../models/Simulation")
const HttpError = require("../../utils/httpError")

const normalize = (s) => String(s || "").trim().toLowerCase()

const create = async ({ strategy, params }) => {
  const normalizedStrategy = normalize(strategy || "grid")

  if (normalizedStrategy !== "grid") {
    throw new HttpError(400, "VALIDATION_ERROR", "Only 'grid' strategy is supported in MVP")
  }

  const grid = params?.grid || {}

  const doc = await Simulation.create({
    strategy: "grid",
    params: {
      grid: {
        coinId: normalize(grid.coinId || "bitcoin"),
        vsCurrency: normalize(grid.vsCurrency || "usd"),
        initialCash: Number(grid.initialCash ?? 1000),
        gridLevels: Number(grid.gridLevels ?? 10),
        gridSpacingPct: Number(grid.gridSpacingPct ?? 1),
        orderSizePct: Number(grid.orderSizePct ?? 10),
        days: Number(grid.days ?? 30),
        interval: normalize(grid.interval || "daily")
      }
    }
  })

  return doc
}

const getById = async (id) => {
  const doc = await Simulation.findById(id)
  if (!doc) throw new HttpError(404, "NOT_FOUND", "Simulation not found")
  return doc
}

module.exports = {
  create,
  getById
}
