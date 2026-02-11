const mongoose = require("mongoose")

const GridParamsSchema = new mongoose.Schema(
  {
    coinId: { type: String, required: true },
    vsCurrency: { type: String, required: true },

    initialCash: { type: Number, required: true },
    gridLevels: { type: Number, required: true },
    gridSpacingPct: { type: Number, required: true },
    orderSizePct: { type: Number, required: true },

    days: { type: Number, required: true },
    interval: { type: String, default: "daily" }
  },
  { _id: false }
)

const SimulationSchema = new mongoose.Schema(
  {
    strategy: { type: String, enum: ["grid"], required: true, default: "grid" },

    status: { type: String, enum: ["created", "ran", "failed"], default: "created" },

    params: {
      grid: { type: GridParamsSchema, required: true }
    },

    result: {
      summary: { type: Object, default: null },
      trades: { type: Array, default: [] },
      equity: { type: Array, default: [] },
      ranAt: { type: Date, default: null }
    },

    error: {
      message: { type: String, default: null },
      code: { type: String, default: null }
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Simulation", SimulationSchema)
