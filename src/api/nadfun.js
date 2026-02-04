const axios = require('axios');

class NadFunClient {
  constructor() {
    this.baseUrl = process.env.NADFUN_API_URL || 'https://api.nadapp.net';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getToken(tokenAddress) {
    try {
      const response = await this.client.get(`/api/v1/tokens/${tokenAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token from Nad.fun:', error.message);
      return null;
    }
  }

  async getTokenHolders(tokenAddress) {
    try {
      const response = await this.client.get(`/api/v1/tokens/${tokenAddress}/holders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching holders from Nad.fun:', error.message);
      return [];
    }
  }

  async getTokenPairs(tokenAddress) {
    try {
      const response = await this.client.get(`/api/v1/tokens/${tokenAddress}/pairs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pairs from Nad.fun:', error.message);
      return [];
    }
  }

  async getPrice(tokenAddress) {
    try {
      const response = await this.client.get(`/api/v1/prices/${tokenAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price from Nad.fun:', error.message);
      return null;
    }
  }

  async getTrendingTokens(limit = 20) {
    try {
      const response = await this.client.get('/api/v1/tokens/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error.message);
      return [];
    }
  }
}

module.exports = NadFunClient;
