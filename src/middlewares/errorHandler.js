module.exports = (err, req, res, next) => {
  const status = err.status || 500
  const code = err.code || "INTERNAL_ERROR"
  const message = err.message || "Internal error"

  if (status >= 500) {
    console.error("[error]", err)
  }

  res.status(status).json({
    error: { message, code, details: err.details }
  })
}
