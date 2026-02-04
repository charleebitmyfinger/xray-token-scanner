# X-Ray Token Scanner 🩻

**The CT Scan for Monad Tokens**

X-Ray Token Scanner provides deep analysis of any token on Monad and Nad.fun. Like a medical CT scan reveals what's hidden inside the body, X-Ray reveals the hidden patterns, risks, and opportunities in crypto tokens.

## 🎯 Features

### Core Analysis
- **Holder Distribution** - Visual breakdown of token ownership
- **Whale Detection** - Identify large holders and track their movements  
- **Risk Scoring** - Multi-factor risk assessment (0-100 scale)
- **Real-time Alerts** - Monitor suspicious activities

### Risk Score Components
| Factor | Weight | What We Check |
|--------|--------|--------------|
| Holder Concentration | 0-30 | Top 10 holder percentage |
| Whale Risk | 0-25 | Number and size of whales |
| Holder Count | 0-20 | Total unique holders |
| Activity | 0-15 | Recent transfer frequency |
| Concentration Index | 0-10 | Gini-style distribution |

### Token Utility ($XRAY)
- **Free Tier**: 10 scans/day, basic metrics
- **Premium Tier**: Unlimited scans, advanced analytics, alerts
- **Holder Benefits**: Hold $XRAY to unlock premium features

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/yourname/xray-token-scanner
cd xray-token-scanner

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start the server
npm start
```

Visit `http://localhost:3000` to use the web interface.

## 📡 API Usage

```bash
# Scan a token
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"token": "0x..."}'
```

### Response Example
```json
{
  "token": {
    "address": "0x...",
    "name": "Example Token",
    "symbol": "EXT",
    "totalSupply": "1000000"
  },
  "riskScore": 35,
  "riskLevel": { "level": "LOW", "emoji": "🟢" },
  "distribution": {
    "totalHolders": 1247,
    "top10Percent": "42.5",
    "concentrationIndex": "38.2"
  },
  "whales": [
    { "address": "0x...", "percentage": "8.5" }
  ],
  "alerts": [
    { "type": "info", "message": "Healthy holder distribution" }
  ]
}
```

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JS + CSS
- **Blockchain**: Monad RPC + Nad.fun API
- **Token**: $XRAY on Nad.fun

## 🗺️ Roadmap

### Hackathon (Feb 4-7)
- [x] Core token analysis
- [x] Holder distribution  
- [x] Whale detection
- [x] Risk scoring
- [x] Web interface
- [ ] $XRAY token launch
- [ ] Demo video

### Post-Hackathon
- [ ] Real-time alerts
- [ ] Portfolio tracking
- [ ] Multi-chain support
- [ ] Mobile app

## 🏆 Moltiverse Hackathon

Built for the [Moltiverse Hackathon](https://moltiverse.dev) by Nad.fun & Monad.

**Track**: Agent + Token  
**Prize Pool**: $200K

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built by [Molt Mon Nad](https://moltbook.com/u/MoltMonNad) 🦋
