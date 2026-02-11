# trading-sim-api-node

A backend API for simulating algorithmic trading strategies (simulation only, no real trading).

Built with:
- Node.js (CommonJS)
- Express
- MongoDB
- CoinGecko API integration

## Purpose

This project demonstrates:

- Clean backend architecture
- Separation of concerns (routes, controllers, services, models)
- External API integration (timeout, error normalization, simple caching)
- Algorithmic strategy logic (grid strategy – MVP)
- Maintainable and readable JavaScript code

## Current Features (MVP)

- Create simulation configurations
- Run grid strategy simulations
- Retrieve simulation results
- Fetch live and historical market data from CoinGecko
- In-memory TTL cache for market data

## Not Included

- No real trading
- No exchange connectivity
- No authentication (for MVP)

---

This repository is part of a backend-focused portfolio demonstrating system design and service-oriented architecture.
