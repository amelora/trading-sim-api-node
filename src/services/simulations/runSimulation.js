const Simulation = require("../../models/Simulation")
const HttpError = require("../../utils/httpError")
const marketDataService = require("../marketdata/marketDataService")
const { runGridStrategy } = require("./strategies/gridStrategy")
const { isValidObjectId } = require("../../utils/objectId")

const runSimulation = async (id) => {
  if (!isValidObjectId(id)) throw new HttpError(400, "VALIDATION_ERROR", "Invalid simulation id")
  const sim = await Simulation.findById(id)
  if (!sim) throw new HttpError(404, "NOT_FOUND", "Simulation not found")

  if (sim.strategy !== "grid") {
    throw new HttpError(400, "VALIDATION_ERROR", "Only 'grid' strategy is supported in MVP")
  }

  const p = sim.params.grid

  const history = await marketDataService.getHistory({
    coinId: p.coinId,
    vsCurrency: p.vsCurrency,
    days: p.days,
    interval: p.interval
  })

  const result = runGridStrategy({
    prices: history.points,
    initialCash: p.initialCash,
    gridLevels: p.gridLevels,
    gridSpacingPct: p.gridSpacingPct,
    orderSizePct: p.orderSizePct
  })

  sim.status = "ran"
  sim.result = {
    summary: result.summary,
    trades: result.trades,
    equity: result.equity,
    ranAt: new Date()
  }
  sim.error = { message: null, code: null }

  await sim.save()

  return sim
}

module.exports = runSimulation
