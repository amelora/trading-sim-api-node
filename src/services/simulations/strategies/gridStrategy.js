const round2 = (n) => Math.round(n * 100) / 100
const round4 = (n) => Math.round(n * 10000) / 10000

const calcMaxDrawdownPct = (equity) => {
  let peak = -Infinity
  let maxDd = 0

  for (const p of equity) {
    const v = p.value
    if (v > peak) peak = v

    if (peak > 0) {
      const dd = (peak - v) / peak
      if (dd > maxDd) maxDd = dd
    }
  }

  return round4(maxDd * 100)
}


const buildGrid = ({ startPrice, levels, spacingPct }) => {
  const spacing = spacingPct / 100
  const grid = []

  for (let i = 1; i <= levels; i++) {
    const buy = startPrice * (1 - spacing * i)
    const sell = startPrice * (1 + spacing * i)

    grid.push({
      level: i,
      buyPrice: buy,
      sellPrice: sell,
      hasPosition: false,
      entryPrice: null,
      qty: 0
    })
  }

  return grid
}

const runGridStrategy = ({ prices, initialCash, gridLevels, gridSpacingPct, orderSizePct }) => {
  if (!Array.isArray(prices) || prices.length < 2) {
    return {
      summary: { initialCash, finalValue: initialCash, profit: 0, trades: 0 },
      trades: [],
      equity: []
    }
  }

  const startPrice = prices[0].price
  const grid = buildGrid({ startPrice, levels: gridLevels, spacingPct: gridSpacingPct })

  let cash = initialCash
  let holdingsQty = 0
  let sellCount = 0
  let winCount = 0
  let grossProfit = 0
  let grossLoss = 0
  const trades = []
  const equity = []

  const orderCash = initialCash * (orderSizePct / 100)

  for (const point of prices) {
    const price = point.price

    // buy triggers
    for (const level of grid) {
      if (level.hasPosition) continue
      if (price > level.buyPrice) continue

      const spend = Math.min(orderCash, cash)
      if (spend <= 0) continue

      const qty = spend / price

      cash -= spend
      holdingsQty += qty

      level.hasPosition = true
      level.entryPrice = price
      level.qty = qty

      trades.push({
        type: "buy",
        level: level.level,
        timestampMs: point.timestampMs,
        price: round2(price),
        qty
      })
    }

    // sell triggers
    for (const level of grid) {
      if (!level.hasPosition) continue
      if (price < level.sellPrice) continue

      const qty = level.qty
      if (qty <= 0) continue

      const proceeds = qty * price

      cash += proceeds
      holdingsQty -= qty

      const entryPrice = level.entryPrice
      const pnl = (price - entryPrice) * qty

      sellCount += 1
      if (pnl > 0) {
        winCount += 1
        grossProfit += pnl
      } else if (pnl < 0) {
        grossLoss += Math.abs(pnl)
      }

      trades.push({
        type: "sell",
        level: level.level,
        timestampMs: point.timestampMs,
        price: round2(price),
        qty,
        pnl: round2(pnl)
      })

      level.hasPosition = false
      level.entryPrice = null
      level.qty = 0
    }

    const value = cash + holdingsQty * price
    equity.push({
      timestampMs: point.timestampMs,
      value: round2(value),
      cash: round2(cash),
      holdingsValue: round2(holdingsQty * price)
    })
  }

  const lastPrice = prices[prices.length - 1].price
  const finalValue = cash + holdingsQty * lastPrice
  const profit = finalValue - initialCash
  const roiPct = (profit / initialCash) * 100
  const maxDrawdownPct = calcMaxDrawdownPct(equity)
  const winRatePct = sellCount > 0 ? (winCount / sellCount) * 100 : 0
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : 0)

  return {
    summary: {
      initialCash,
      finalValue: round2(finalValue),
      profit: round2(profit),
      roiPct: round2(roiPct),
      trades: trades.length,

      sells: sellCount,
      winRatePct: round2(winRatePct),
      profitFactor: Number.isFinite(profitFactor) ? round2(profitFactor) : profitFactor,
      maxDrawdownPct
    },
    trades,
    equity
  }
}

module.exports = {
  runGridStrategy
}
