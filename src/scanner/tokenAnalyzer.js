const MonadClient = require('../api/monad');
const NadFunClient = require('../api/nadfun');

class TokenAnalyzer {
  constructor() {
    this.monadClient = new MonadClient();
    this.nadFunClient = new NadFunClient();
  }

  async analyze(tokenAddress) {
    try {
      console.log(`🔍 Analyzing token: ${tokenAddress}`);

      // Fetch all data in parallel
      const [
        tokenInfo,
        tokenData,
        holderDistribution,
        socialMetrics,
        tokenAge,
        securityScore,
        creationBlock,
        isVerified
      ] = await Promise.all([
        this.monadClient.getTokenInfo(tokenAddress),
        this.nadFunClient.getTokenData(tokenAddress),
        this.nadFunClient.getHolderDistribution(tokenAddress),
        this.nadFunClient.getTokenSocialMetrics(tokenAddress),
        this.nadFunClient.getTokenAge(tokenAddress),
        this.nadFunClient.getTokenSecurityScore(tokenAddress),
        this.monadClient.getContractCreationBlock(tokenAddress),
        this.monadClient.isContractVerified(tokenAddress)
      ]);

      // Calculate risk score
      const riskScore = this.calculateRiskScore({
        tokenData,
        holderDistribution,
        socialMetrics,
        tokenAge,
        securityScore,
        creationBlock,
        isVerified
      });

      // Analyze holder distribution
      const holderAnalysis = this.analyzeHolderDistribution(holderDistribution);

      // Generate insights
      const insights = this.generateInsights({
        tokenInfo,
        tokenData,
        holderDistribution,
        securityScore,
        riskScore,
        tokenAge
      });

      return {
        token: {
          address: tokenAddress,
          ...tokenInfo,
          creationBlock,
          isVerified
        },
        market: {
          price: tokenData.price,
          marketCap: tokenData.marketCap,
          volume24h: tokenData.volume24h,
          priceChange24h: tokenData.priceChange24h,
          liquidity: tokenData.liquidity,
          transactions24h: tokenData.transactions24h
        },
        holders: {
          total: holderDistribution.totalHolders,
          whaleCount: holderDistribution.whaleCount,
          ...holderAnalysis
        },
        security: securityScore,
        social: socialMetrics,
        age: tokenAge,
        risk: {
          score: riskScore,
          level: this.getRiskLevel(riskScore),
          insights
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error(`Failed to analyze token: ${error.message}`);
    }
  }

  calculateRiskScore(data) {
    let score = 0;
    const maxScore = 100;

    // Security risks
    if (data.securityScore.isHoneypot) score += 30;
    score += data.securityScore.honeypotRisk * 0.5;
    score += data.securityScore.mintRisk * 0.3;
    score += Math.max(data.securityScore.sellTax, data.securityScore.buyTax) * 0.2;

    // Holder concentration risk
    if (data.holderDistribution.distribution.top10 > 50) score += 15;
    if (data.holderDistribution.distribution.top10 > 80) score += 10;
    if (data.holderDistribution.totalHolders < 10) score += 20;
    if (data.holderDistribution.totalHolders < 100) score += 10;

    // Liquidity risk
    if (data.tokenData.liquidity < 1000) score += 15;
    if (data.tokenData.liquidity < 10000) score += 10;

    // Volume risk
    if (data.tokenData.volume24h < 1000) score += 10;

    // Age risk
    if (data.tokenAge.daysOld < 1) score += 15;
    if (data.tokenAge.daysOld < 7) score += 10;

    // Social risk
    if (data.socialMetrics.socialScore < 10) score += 10;

    // Verification risk
    if (!data.isVerified) score += 5;

    return Math.min(score, maxScore);
  }

  analyzeHolderDistribution(holderDistribution) {
    const { distribution, topHolders } = holderDistribution;
    
    const whaleThreshold = 1000000; // $1M+ holders
    const topHolderPercentage = distribution.top10;
    const concentrationRisk = topHolderPercentage > 50 ? 'High' : 
                             topHolderPercentage > 30 ? 'Medium' : 'Low';

    const giniCoefficient = this.calculateGiniCoefficient(topHolders);

    return {
      concentrationRisk,
      giniCoefficient,
      top10Hold: distribution.top10,
      top50Hold: distribution.top50,
      top100Hold: distribution.top100,
      decentralized: giniCoefficient < 0.4 && topHolderPercentage < 30
    };
  }

  calculateGiniCoefficient(holders) {
    if (!holders || holders.length === 0) return 0;
    
    const balances = holders.map(h => parseFloat(h.balance) || 0).sort((a, b) => a - b);
    const n = balances.length;
    const sum = balances.reduce((a, b) => a + b, 0);
    
    if (sum === 0) return 0;
    
    let cumulative = 0;
    balances.forEach((balance, i) => {
      cumulative += (i + 1) * balance;
    });
    
    return (2 * cumulative) / (n * sum) - (n + 1) / n;
  }

  generateInsights(data) {
    const insights = [];

    // Security insights
    if (data.securityScore.isHoneypot) {
      insights.push({
        type: 'CRITICAL',
        message: '🚨 HONEYPOT DETECTED - Token has honeypot characteristics',
        category: 'security'
      });
    }

    if (data.securityScore.honeypotRisk > 50) {
      insights.push({
        type: 'WARNING',
        message: `⚠️ High honeypot risk: ${data.securityScore.honeypotRisk.toFixed(1)}%`,
        category: 'security'
      });
    }

    // Holder insights
    if (data.holders.concentrationRisk === 'High') {
      insights.push({
        type: 'WARNING',
        message: `🐋 High whale concentration: Top 10 hold ${data.holders.top10Hold.toFixed(1)}%`,
        category: 'holders'
      });
    }

    if (data.holders.total < 50) {
      insights.push({
        type: 'WARNING',
        message: `👥 Very few holders: Only ${data.holders.total} total`,
        category: 'holders'
      });
    }

    // Liquidity insights
    if (data.market.liquidity < 10000) {
      insights.push({
        type: 'WARNING',
        message: `💧 Low liquidity: $${data.market.liquidity.toLocaleString()}`,
        category: 'liquidity'
      });
    }

    // Age insights
    if (data.age.daysOld < 1) {
      insights.push({
        type: 'WARNING',
        message: `🆕 Brand new token - less than 1 day old`,
        category: 'age'
      });
    }

    // Positive insights
    if (data.securityScore.securityScore > 80) {
      insights.push({
        type: 'INFO',
        message: `✅ Good security score: ${data.securityScore.securityScore}/100`,
        category: 'security'
      });
    }

    if (data.holders.decentralized) {
      insights.push({
        type: 'INFO',
        message: `🎯 Well distributed token - low concentration`,
        category: 'holders'
      });
    }

    if (data.market.volume24h > 100000) {
      insights.push({
        type: 'INFO',
        message: `📈 High trading volume: $${data.market.volume24h.toLocaleString()}/24h`,
        category: 'volume'
      });
    }

    return insights;
  }

  getRiskLevel(score) {
    if (score >= 80) return 'EXTREME';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'MINIMAL';
  }
}

module.exports = TokenAnalyzer;