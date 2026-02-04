const { ethers } = require('ethers');

class MonadClient {
  constructor() {
    this.rpcUrl = process.env.MONAD_RPC_URL || 'https://rpc.monad.xyz';
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
  }

  async getTokenInfo(tokenAddress) {
    const erc20Abi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)'
    ];

    try {
      const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);

      return {
        address: tokenAddress,
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals)
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getBalance(tokenAddress, walletAddress) {
    const erc20Abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
    const balance = await contract.balanceOf(walletAddress);
    return balance;
  }

  async getTopHolders(tokenAddress, limit = 100) {
    // Note: This requires indexer or subgraph for efficient queries
    // For MVP, we'll use Nad.fun API or scan transfer events
    // This is a placeholder for the full implementation
    console.log(`Fetching top ${limit} holders for ${tokenAddress}`);
    return [];
  }

  async getRecentTransfers(tokenAddress, blocks = 1000) {
    const erc20Abi = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
    const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
    
    const currentBlock = await this.provider.getBlockNumber();
    const fromBlock = currentBlock - blocks;
    
    const filter = contract.filters.Transfer();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);
    
    return events.map(event => ({
      from: event.args.from,
      to: event.args.to,
      value: event.args.value.toString(),
      blockNumber: event.blockNumber,
      txHash: event.transactionHash
    }));
  }
}

module.exports = MonadClient;
