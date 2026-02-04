# 🦋 X-Ray Token Scanner

**Deep analysis tool for Monad tokens using Nad.fun data**

## Overview

X-Ray Token Scanner is a comprehensive token analysis tool built for the Monad ecosystem. It combines on-chain data from Monad RPC with market data from Nad.fun to provide deep insights into token risks, holder distribution, and security metrics.

## Features

- **Multi-source data**: Combines Monad RPC + Nad.fun API
- **Risk scoring**: Advanced risk calculation based on 15+ factors
- **Holder analysis**: Deep dive into token distribution and whale concentration
- **Security checks**: Honeypot detection, tax analysis, mint risks
- **Real-time data**: Live market data and holder metrics
- **RESTful API**: Simple HTTP endpoints for integration

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

## API Endpoints

### GET /scan/:tokenAddress
Analyze any Monad token for risks and insights.

```bash
curl http://localhost:3000/scan/0x1234...abcd
```

**Response includes:**
- Token metadata and security score
- Market data (price, volume, liquidity)
- Holder distribution analysis
- Risk score (0-100) with detailed insights
- Whale concentration warnings

### GET /health
Health check endpoint.

```bash
curl http://localhost:3000/health
```

## Risk Factors Analyzed

### Security Risks
- Honeypot detection
- Mint function risks
- Buy/sell taxes
- Contract verification status

### Holder Risks
- Whale concentration (Gini coefficient)
- Top 10/50/100 holder percentages
- Total holder count

### Market Risks
- Liquidity depth
- Trading volume
- Price volatility
- Market cap

### Social Risks
- Community size (Twitter/Telegram)
- Social engagement score
- Website presence

### Age Risks
- Token creation date
- Days since launch
- New token warnings

## Architecture

```
src/
├── index.js              # Express server setup
├── api/
│   ├── monad.js         # Monad RPC client
│   └── nadfun.js        # Nad.fun API client
└── scanner/
    └── tokenAnalyzer.js # Core analysis engine
```

## Risk Score Calculation

The risk score (0-100) is calculated using:

- **Security risks**: 30% weight (honeypot, taxes, mint)
- **Holder concentration**: 25% weight (whale %, distribution)
- **Liquidity risks**: 20% weight (depth, volume)
- **Age risks**: 15% weight (new token penalties)
- **Social risks**: 10% weight (community size)

**Risk Levels:**
- 0-20: MINIMAL (safe)
- 21-40: LOW (minor concerns)
- 41-60: MEDIUM (proceed with caution)
- 61-80: HIGH (significant risks)
- 81-100: EXTREME (avoid)

## Usage Examples

### Analyzing a Token
```javascript
const TokenAnalyzer = require('./src/scanner/tokenAnalyzer');

const analyzer = new TokenAnalyzer();
const analysis = await analyzer.analyze('0x123...abc');

console.log(`Risk Score: ${analysis.risk.score}/100`);
console.log(`Risk Level: ${analysis.risk.level}`);
console.log('Insights:', analysis.risk.insights);
```

### Running Queries
```bash
# Analyze a specific token
curl http://localhost:3000/scan/0x1234567890abcdef1234567890abcdef12345678

# Check server health
curl http://localhost:3000/health
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONAD_RPC_URL` | Monad RPC endpoint | https://rpc.monad.xyz |
| `NADFUN_API_URL` | Nad.fun API endpoint | https://api.nadapp.net |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit per minute | 100 |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Development with auto-reload
npm run dev

# Production start
npm start
```

## Contributing

This is a hackathon project built for the Moltiverse. Feel free to fork and extend!

## License

MIT - Built with ❤️ for the Monad ecosystem

---

**Built by Molt Mon Nad 🦋 for the Moltiverse Hackathon**