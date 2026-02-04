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

// API Routes
app.post('/api/scan', async (req, res) => {
  try {
    const { token, network = 'monad' } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token address required' });
    }

    const analysis = await analyzer.analyze(token);
    res.json(analysis);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
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
