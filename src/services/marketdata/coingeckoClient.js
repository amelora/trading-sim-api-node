const env = require("../../config/env")
const HttpError = require("../../utils/httpError")

const buildUrl = (path, query = {}) => {
  const url = new URL(env.coingecko.baseUrl + path)

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue
    url.searchParams.set(key, String(value))
  }

  return url.toString()
}

const fetchJson = async (url, { timeoutMs }) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: controller.signal
    })

    const text = await res.text()
    const data = text ? safeJsonParse(text) : null

    if (!res.ok) {
      throw new HttpError(
        res.status,
        "COINGECKO_HTTP_ERROR",
        `CoinGecko request failed (${res.status})`,
        { url, response: data }
      )
    }

    return data
  } catch (err) {
    if (err.name === "AbortError") {
      throw new HttpError(504, "COINGECKO_TIMEOUT", "CoinGecko request timed out", { url })
    }

    if (err instanceof HttpError) throw err

    throw new HttpError(502, "COINGECKO_NETWORK_ERROR", "CoinGecko network error", {
      url,
      message: err.message
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

const safeJsonParse = (text) => {
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

const getSimplePrice = async ({ coinId, vsCurrency }) => {
  const url = buildUrl("/simple/price", {
    ids: coinId,
    vs_currencies: vsCurrency
  })

  return fetchJson(url, { timeoutMs: env.coingecko.timeoutMs })
}

const getMarketChart = async ({ coinId, vsCurrency, days, interval }) => {
  const url = buildUrl(`/coins/${coinId}/market_chart`, {
    vs_currency: vsCurrency,
    days,
    interval
  })

  return fetchJson(url, { timeoutMs: env.coingecko.timeoutMs })
}

module.exports = {
  getSimplePrice,
  getMarketChart
}
