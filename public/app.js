const $ = (id) => document.getElementById(id)

const setStatus = (text) => {
  $("status").textContent = text || ""
}

const apiFetch = async (path, options) => {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`
    const code = data?.error?.code || "UNKNOWN"
    const err = new Error(message)
    err.code = code
    err.status = res.status
    throw err
  }

  return data
}

const toNum = (v) => Number(v)

const buildPayload = () => ({
  strategy: "grid",
  params: {
    grid: {
      coinId: $("coinId").value,
      vsCurrency: $("vsCurrency").value,
      days: toNum($("days").value),
      interval: $("interval").value,

      initialCash: toNum($("initialCash").value),
      gridLevels: toNum($("gridLevels").value),
      gridSpacingPct: toNum($("gridSpacingPct").value),
      orderSizePct: toNum($("orderSizePct").value)
    }
  }
})

const format = (n) => {
  if (typeof n !== "number") return String(n ?? "")
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const renderResult = ({ id, status, summary, ranAt, resultUrl }) => {
  const kpis = [
    ["Status", status],
    ["Final value", summary?.finalValue],
    ["Profit", summary?.profit],
    ["ROI (%)", summary?.roiPct],
    ["Max drawdown (%)", summary?.maxDrawdownPct],
    ["Trades", summary?.trades],
    ["Sells", summary?.sells],
    ["Win rate (%)", summary?.winRatePct],
    ["Profit factor", summary?.profitFactor],
    ["Ran at", ranAt ? new Date(ranAt).toLocaleString() : ""]
  ]

  const grid = document.createElement("div")
  grid.className = "resultGrid"

  for (const [label, value] of kpis) {
    const card = document.createElement("div")
    card.className = "kpi"

    const l = document.createElement("div")
    l.className = "label"
    l.textContent = label

    const v = document.createElement("div")
    v.className = "value"
    v.textContent = typeof value === "number" ? format(value) : String(value || "")

    card.appendChild(l)
    card.appendChild(v)
    grid.appendChild(card)
  }

  const links = document.createElement("div")
  links.className = "links"

  const a1 = document.createElement("a")
  a1.href = `/simulations/${id}`
  a1.target = "_blank"
  a1.rel = "noreferrer"
  a1.textContent = "Open simulation (summary)"

  const a2 = document.createElement("a")
  a2.href = resultUrl || `/simulations/${id}?include=details`
  a2.target = "_blank"
  a2.rel = "noreferrer"
  a2.textContent = "Open full details"

  links.appendChild(a1)
  links.appendChild(a2)

  const root = $("result")
  root.innerHTML = ""
  root.appendChild(grid)
  root.appendChild(links)
}

const run = async () => {
  $("btnRun").disabled = true
  setStatus("Creating simulation...")

  try {
    const payload = buildPayload()

    const created = await apiFetch("/simulations", {
      method: "POST",
      body: JSON.stringify(payload)
    })

    const id = created?.data?.id
    if (!id) throw new Error("Missing simulation id")

    setStatus(`Running simulation ${id}...`)

    const ran = await apiFetch(`/simulations/${id}/run`, { method: "POST" })

    renderResult(ran.data)
    setStatus("Done")
  } catch (err) {
    setStatus(`Error: ${err.message} (${err.code || "NO_CODE"})`)
  } finally {
    $("btnRun").disabled = false
  }
}

const reset = () => {
  $("coinId").value = "bitcoin"
  $("vsCurrency").value = "usd"
  $("days").value = 30
  $("interval").value = "daily"
  $("initialCash").value = 1000
  $("gridLevels").value = 10
  $("gridSpacingPct").value = 1
  $("orderSizePct").value = 10

  $("result").innerHTML = '<div class="muted">No result yet. Run a simulation.</div>'
  setStatus("")
}

$("btnRun").addEventListener("click", run)
$("btnReset").addEventListener("click", reset)

reset()
