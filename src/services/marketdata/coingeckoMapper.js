const mapSimplePrice = ({ coinId, vsCurrency, raw }) => {
  const price = raw?.[coinId]?.[vsCurrency]

  if (typeof price !== "number") {
    return {
      coinId,
      vsCurrency,
      price: null,
      source: "coingecko"
    }
  }

  return {
    coinId,
    vsCurrency,
    price,
    source: "coingecko"
  }
}

const mapMarketChart = ({ coinId, vsCurrency, raw }) => {
  const prices = Array.isArray(raw?.prices) ? raw.prices : []

  return {
    coinId,
    vsCurrency,
    points: prices
      .filter(p => Array.isArray(p) && p.length >= 2)
      .map(p => ({
        timestampMs: p[0],
        price: p[1]
      })),
    source: "coingecko"
  }
}

module.exports = {
  mapSimplePrice,
  mapMarketChart
}
