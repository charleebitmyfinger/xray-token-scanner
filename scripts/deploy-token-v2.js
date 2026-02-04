const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Config
const CONFIG = {
  apiUrl: 'https://api.nadapp.net',
  rpcUrl: 'https://rpc.monad.xyz',
  BONDING_CURVE_ROUTER: '0x6F6B8F1a20703309951a5127c45B49b1CD981A22',
  LENS: '0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea',
};

// Token info
const TOKEN = {
  name: 'X-Ray',
  symbol: 'XRAY',
  description: '🩻 The diagnostic tool for Monad tokens. Scan any project for holder distribution, whale detection, and risk scoring. Hold $XRAY for premium analytics.',
  website: 'https://github.com/charleebitmyfinger/xray-token-scanner',
};

// Full ABI for encoding
const ROUTER_ABI = [
  "function create((string name, string symbol, string tokenURI, uint256 amountOut, bytes32 salt, uint256 actionId)) payable returns (address)"
];

const LENS_ABI = [
  'function getInitialBuyAmountOut(uint256 amountIn) view returns (uint256)',
];

function createXrayLogo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </linearGradient>
    <linearGradient id="xray" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00ff88"/>
      <stop offset="50%" style="stop-color:#00ffcc"/>
      <stop offset="100%" style="stop-color:#00ff88"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <circle cx="200" cy="200" r="150" fill="none" stroke="url(#xray)" stroke-width="3" opacity="0.3"/>
  <circle cx="200" cy="200" r="120" fill="none" stroke="url(#xray)" stroke-width="2" opacity="0.5"/>
  <circle cx="200" cy="200" r="90" fill="none" stroke="url(#xray)" stroke-width="2" opacity="0.7"/>
  <text x="200" y="180" font-family="Arial Black, sans-serif" font-size="80" fill="url(#xray)" text-anchor="middle" filter="url(#glow)">X</text>
  <text x="200" y="260" font-family="Arial, sans-serif" font-size="36" fill="#00ffcc" text-anchor="middle" opacity="0.9">RAY</text>
  <line x1="50" y1="200" x2="100" y2="200" stroke="#00ff88" stroke-width="2" opacity="0.6"/>
  <line x1="300" y1="200" x2="350" y2="200" stroke="#00ff88" stroke-width="2" opacity="0.6"/>
  <line x1="200" y1="50" x2="200" y2="100" stroke="#00ff88" stroke-width="2" opacity="0.6"/>
  <line x1="200" y1="300" x2="200" y2="350" stroke="#00ff88" stroke-width="2" opacity="0.6"/>
  <path d="M60,60 L60,90 M60,60 L90,60" stroke="#00ffcc" stroke-width="3" fill="none"/>
  <path d="M340,60 L340,90 M340,60 L310,60" stroke="#00ffcc" stroke-width="3" fill="none"/>
  <path d="M60,340 L60,310 M60,340 L90,340" stroke="#00ffcc" stroke-width="3" fill="none"/>
  <path d="M340,340 L340,310 M340,340 L310,340" stroke="#00ffcc" stroke-width="3" fill="none"/>
  <circle cx="130" cy="130" r="4" fill="#00ff88" opacity="0.8"/>
  <circle cx="270" cy="130" r="4" fill="#00ff88" opacity="0.8"/>
  <circle cx="130" cy="270" r="4" fill="#00ff88" opacity="0.8"/>
  <circle cx="270" cy="270" r="4" fill="#00ff88" opacity="0.8"/>
</svg>`;
}

async function main() {
  console.log('🩻 X-Ray Token Deployment v2');
  console.log('='.repeat(50));

  // Load wallet
  const walletConfig = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../.config/wallet.json'), 'utf8'
  ));
  
  const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
  const wallet = new ethers.Wallet(walletConfig.privateKey, provider);
  
  console.log(`Wallet: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance: ${ethers.formatEther(balance)} MON`);

  // Step 1: Upload image
  console.log('\n📸 Step 1: Creating token image...');
  const svgImage = createXrayLogo();
  
  const imageResponse = await fetch(`${CONFIG.apiUrl}/agent/token/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/svg+xml' },
    body: svgImage,
  });
  
  if (!imageResponse.ok) {
    throw new Error(`Image upload failed: ${await imageResponse.text()}`);
  }
  
  const { image_uri } = await imageResponse.json();
  console.log(`Image URI: ${image_uri}`);

  // Step 2: Upload metadata
  console.log('\n📝 Step 2: Uploading metadata...');
  const metadataResponse = await fetch(`${CONFIG.apiUrl}/agent/token/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_uri,
      name: TOKEN.name,
      symbol: TOKEN.symbol,
      description: TOKEN.description,
      website: TOKEN.website,
    }),
  });
  
  if (!metadataResponse.ok) {
    throw new Error(`Metadata upload failed: ${await metadataResponse.text()}`);
  }
  
  const { metadata_uri } = await metadataResponse.json();
  console.log(`Metadata URI: ${metadata_uri}`);

  // Step 3: Mine salt
  console.log('\n⛏️ Step 3: Mining salt...');
  const saltResponse = await fetch(`${CONFIG.apiUrl}/agent/salt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creator: wallet.address,
      name: TOKEN.name,
      symbol: TOKEN.symbol,
      metadata_uri,
    }),
  });
  
  if (!saltResponse.ok) {
    throw new Error(`Salt mining failed: ${await saltResponse.text()}`);
  }
  
  const { salt, address: predictedAddress } = await saltResponse.json();
  console.log(`Salt: ${salt}`);
  console.log(`Predicted Token Address: ${predictedAddress}`);

  // Step 4: Prepare transaction
  console.log('\n💰 Step 4: Preparing transaction...');
  const deployFee = ethers.parseEther('10');
  const initialBuyAmount = ethers.parseEther('1');
  const totalValue = deployFee + initialBuyAmount;
  
  // Get min tokens with Lens
  const lens = new ethers.Contract(CONFIG.LENS, LENS_ABI, provider);
  const expectedTokens = await lens.getInitialBuyAmountOut(initialBuyAmount);
  const minTokens = expectedTokens * 95n / 100n; // 5% slippage
  
  console.log(`Deploy Fee: ${ethers.formatEther(deployFee)} MON`);
  console.log(`Initial Buy: ${ethers.formatEther(initialBuyAmount)} MON`);
  console.log(`Expected tokens: ~${ethers.formatEther(expectedTokens)} XRAY`);
  console.log(`Total cost: ${ethers.formatEther(totalValue)} MON`);

  // Step 5: Create using Interface to encode
  console.log('\n🚀 Step 5: Creating token on-chain...');
  
  const iface = new ethers.Interface(ROUTER_ABI);
  const createStruct = {
    name: TOKEN.name,
    symbol: TOKEN.symbol,
    tokenURI: metadata_uri,
    amountOut: minTokens,
    salt: salt,
    actionId: 1n
  };
  
  const calldata = iface.encodeFunctionData('create', [createStruct]);
  console.log(`Calldata length: ${calldata.length}`);
  console.log(`Calldata preview: ${calldata.slice(0, 100)}...`);
  
  const tx = await wallet.sendTransaction({
    to: CONFIG.BONDING_CURVE_ROUTER,
    data: calldata,
    value: totalValue,
    gasLimit: 8000000n,
  });
  
  console.log(`TX Hash: ${tx.hash}`);
  console.log('Waiting for confirmation...');
  
  const receipt = await tx.wait();
  
  if (receipt.status === 0) {
    throw new Error('Transaction reverted');
  }
  
  console.log(`Confirmed in block: ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  // Get token address
  const tokenAddress = predictedAddress;
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ TOKEN DEPLOYED SUCCESSFULLY!');
  console.log('='.repeat(50));
  console.log(`Token: ${TOKEN.name} (${TOKEN.symbol})`);
  console.log(`Address: ${tokenAddress}`);
  console.log(`Trade: https://nad.fun/token/${tokenAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    tokenName: TOKEN.name,
    tokenSymbol: TOKEN.symbol,
    tokenAddress,
    imageUri: image_uri,
    metadataUri: metadata_uri,
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
    deployedAt: new Date().toISOString(),
    nadFunUrl: `https://nad.fun/token/${tokenAddress}`,
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../.config/deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  return deploymentInfo;
}

main().catch(console.error);
