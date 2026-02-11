const env = require("../../config/env")
const cache = require("./cache")
const coingeckoClient = require("./coingeckoClient")
const mapper = require("./coingeckoMapper")

const TTL = {
  priceMs: 15_000,
  historyMs: 5 * 60_000
}

const makePriceKey = (coinId, vsCurrency) => `price:${coinId}:${vsCurrency}`
const makeHistoryKey = (coinId, vsCurrency, days, interval) =>
  `history:${coinId}:${vsCurrency}:${days}:${interval || "auto"}`

const getPrice = async ({ coinId, vsCurrency }) => {
  const key = makePriceKey(coinId, vsCurrency)

  if (env.cacheEnabled) {
    const cached = cache.get(key)
    if (cached) return { ...cached, meta: { cached: true } }
  }

  const raw = await coingeckoClient.getSimplePrice({ coinId, vsCurrency })
  const data = mapper.mapSimplePrice({ coinId, vsCurrency, raw })

  if (env.cacheEnabled) {
    cache.set(key, data, TTL.priceMs)
  }

  return { ...data, meta: { cached: false } }
}

const getHistory = async ({ coinId, vsCurrency, days, interval }) => {
  const key = makeHistoryKey(coinId, vsCurrency, days, interval)

  if (env.cacheEnabled) {
    const cached = cache.get(key)
    if (cached) return { ...cached, meta: { cached: true } }
  }

  const raw = await coingeckoClient.getMarketChart({ coinId, vsCurrency, days, interval })
  const data = mapper.mapMarketChart({ coinId, vsCurrency, raw })

  if (env.cacheEnabled) {
    cache.set(key, data, TTL.historyMs)
  }

  return { ...data, meta: { cached: false } }
}

module.exports = {
  getPrice,
  getHistory
}
