const getEnv = (key, fallback) => {
  const value = process.env[key]
  if (value === undefined || value === "") return fallback
  return value
}

const requireEnv = (key) => {
  const value = process.env[key]
  if (value === undefined || value === "") {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number(getEnv("PORT", "3000")),
  host: getEnv("HOST", "0.0.0.0"),
  mongoUri: requireEnv("MONGODB_URI"),

  coingecko: {
    baseUrl: getEnv("COINGECKO_BASE_URL", "https://api.coingecko.com/api/v3"),
    timeoutMs: Number(getEnv("COINGECKO_TIMEOUT_MS", "5000"))
  },

  cacheEnabled: getEnv("CACHE_ENABLED", "true") === "true"
}

module.exports = env
