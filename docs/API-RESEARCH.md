# Nad.fun API Research - Holder Data

## Key Endpoints

### Base URLs
- **Mainnet:** `https://api.nadapp.net`
- **Testnet:** `https://dev-api.nad.fun`

### Holder Data Endpoints

```
GET /agent/market/:token_id
→ Returns: holder_count, price_usd, volume, market_cap

GET /agent/holdings/:account_id
→ Returns: tokens held by account with balances

GET /agent/swap-history/:token_id
→ Returns: swap history for building holder analysis
```

## Authentication

- **No auth required** for basic functionality
- **Rate limits:**
  - Without API key: 10 req/min
  - With API key: 100 req/min

### Getting an API Key
```typescript
POST /api-key
Body: { name, description, expires_in_days }
Header: Cookie: nadfun-v3-api=<token>
→ Returns: { api_key }

// Usage
Headers: { "X-API-Key": api_key }
```

## Sample Responses

### Market Data
```json
{
  "market_info": {
    "market_type": "bonding_curve",
    "price_usd": "0.0000456",
    "holder_count": 2847,
    "volume_24h": "12.45",
    "market_cap": "45678.90"
  }
}
```

## Integration Patterns

### Quick Holder Count
```typescript
const response = await fetch(`${API_URL}/agent/market/${tokenAddress}`)
const { market_info } = await response.json()
return market_info.holder_count
```

### Historical via Events
```typescript
const transfers = await publicClient.getContractEvents({
  address: tokenAddress,
  abi: erc20Abi,
  eventName: "Transfer",
  fromBlock: startBlock,
  toBlock: endBlock
})
```

## Performance Tips
1. Use REST API for holder counts (faster than event scanning)
2. Batch blockchain queries with multicall
3. Cache frequently accessed data
4. Get API key for higher rate limits
