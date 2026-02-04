require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const TokenAnalyzer = require('./scanner/tokenAnalyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web/public')));

// Initialize analyzer
const analyzer = new TokenAnalyzer();

// $XRAY Token Address
const XRAY_TOKEN = '0xD50229E9594B4A4B5F456fdC5759510c763F7777';

// AI Analysis generator (premium feature)
function generateAIAnalysis(analysis) {
  const { riskScore, distribution, whales, alerts } = analysis;
  
  const patterns = [];
  
  // Analyze concentration
  if (distribution.top10Percent > 80) {
    patterns.push('Extremely concentrated token - high manipulation risk');
  } else if (distribution.top10Percent > 50) {
    patterns.push('Moderately concentrated - watch for coordinated dumps');
  } else {
    patterns.push('Well-distributed token - healthy decentralization');
  }
  
  // Analyze whale behavior
  if (whales.length >= 5) {
    const avgWhaleHolding = whales.reduce((s, w) => s + w.percentage, 0) / whales.length;
    if (avgWhaleHolding > 5) {
      patterns.push(`${whales.length} large whales averaging ${avgWhaleHolding.toFixed(1)}% each`);
    }
  }
  
  // Risk assessment
  if (riskScore >= 70) {
    patterns.push('⚠️ HIGH RISK: Multiple red flags detected. Exercise extreme caution.');
  } else if (riskScore >= 40) {
    patterns.push('⚡ MODERATE RISK: Some concerns present. DYOR before investing.');
  } else {
    patterns.push('✅ LOW RISK: Token shows healthy distribution patterns.');
  }
  
  // Check for specific alerts
  const hasDevWallet = alerts.some(a => a.message?.toLowerCase().includes('dev') || a.message?.toLowerCase().includes('creator'));
  if (hasDevWallet) {
    patterns.push('Developer wallet detected among top holders - monitor for sells');
  }
  
  return patterns.join(' | ');
}

// API Routes
app.post('/api/scan', async (req, res) => {
  try {
    const { token, tier = 'FREE', holder } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token address required' });
    }

    const analysis = await analyzer.analyze(token);
    
    // Add AI analysis for WHALE tier
    if (tier === 'WHALE') {
      analysis.aiAnalysis = generateAIAnalysis(analysis);
    }
    
    // Add premium indicator
    analysis.premiumUnlocked = tier !== 'FREE';
    
    res.json(analysis);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// $XRAY token info endpoint
app.get('/api/xray', (req, res) => {
  res.json({
    token: XRAY_TOKEN,
    name: 'X-Ray',
    symbol: 'XRAY',
    nadFunUrl: `https://nad.fun/tokens/${XRAY_TOKEN}`,
    tiers: {
      FREE: { threshold: 0, features: ['Basic scan', 'Whale list'] },
      HOLDER: { threshold: 1000, features: ['Risk alerts', 'Historical data'] },
      WHALE: { threshold: 10000, features: ['AI analysis', 'API access', 'Priority scanning'] }
    }
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🩻 X-Ray Token Scanner running on port ${PORT}`);
  console.log(`   Monad RPC: ${process.env.MONAD_RPC_URL}`);
  console.log(`   Nad.fun API: ${process.env.NADFUN_API_URL}`);
});
