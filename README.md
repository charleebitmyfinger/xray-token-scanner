# 🩻 X-Ray Token Scanner

![Moltiverse Hackathon 2026](https://img.shields.io/badge/Moltiverse%20Hackathon%202026-Competing-blueviolet)
![Monad](https://img.shields.io/badge/Built%20on-Monad-green)
![Nad.fun](https://img.shields.io/badge/Trade%20on-Nad.fun-orange)

> **$XRAY Token:** [`0xD50229E9594B4A4B5F456fdC5759510c763F7777`](https://nad.fun/tokens/0xD50229E9594B4A4B5F456fdC5759510c763F7777)
>
> **[🚀 Buy $XRAY on Nad.fun](https://nad.fun/tokens/0xD50229E9594B4A4B5F456fdC5759510c763F7777)**
>
> **Moltiverse Hackathon 2026 Entry** — Agent + Token Track 🏆

**The CT Scanner for Crypto - See What Whales See**

## Overview

X-Ray Token Scanner is your unfair advantage in crypto. While whales hunt with perfect vision, regular degens are flying blind. We built the CT scanner that gives you the same insights whales have - but designed for the community, not the predators.

Built for the **Moltiverse Hackathon 2026**, $XRAY combines AI analysis with real-time blockchain data to stop degens from being exit liquidity.

## 🎯 Why This Matters

Every day, degens get rekt not because they're stupid, but because they're flying blind. $XRAY changes that equation by giving you whale-level intelligence.

## ✨ Features

- **🐋 Whale Vision** - See wallet concentration before you ape
- **🤖 AI Risk Scoring** - 15+ factors analyzed in real-time  
- **⚡ Sub-second Scans** - Built on Monad for speed that kills
- **🛡️ Security Analysis** - Honeypot detection, tax analysis, mint risks
- **📊 Real-time Data** - Live market data from Nad.fun
- **🔗 RESTful API** - Easy integration for bots and tools

## 🖼️ Demo & Screenshots

### Live Demo
**[🚀 Try the Scanner Now](https://nad.fun/tokens/0xD50229E9594B4A4B5F456fdC5759510c763F7777)**

### Screenshots
*Screenshots coming soon - check the live demo above for real examples*

#### Scanner Interface
- **Risk Score Dashboard** - 0-100 risk score with detailed breakdown
- **Whale Analysis** - See exactly who holds what percentage
- **Real-time Alerts** - Get notified when risk factors change

#### API Responses
```json
{
  "risk": {
    "score": 23,
    "level": "LOW",
    "insights": ["Minimal whale concentration", "Verified contract", "Healthy liquidity"]
  },
  "holders": {
    "total": 1234,
    "top10": "15.2%",
    "gini": 0.42
  }
}
```

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