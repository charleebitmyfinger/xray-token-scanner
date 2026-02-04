const { createPublicClient, createWalletClient, http, parseEther, decodeEventLog } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const fs = require('fs');
const path = require('path');

// Monad chain definition
const monad = {
  id: 143,
  name: 'Monad',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://monad-mainnet.drpc.org'] } },
};

// Config
const CONFIG = {
  apiUrl: 'https://api.nadapp.net',
  CURVE: '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE',
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

// ABIs
const bondingCurveRouterAbi = [
  {
    inputs: [{
      components: [
        { name: 'name', type: 'string', internalType: 'string' },
        { name: 'symbol', type: 'string', internalType: 'string' },
        { name: 'tokenURI', type: 'string', internalType: 'string' },
        { name: 'amountOut', type: 'uint256', internalType: 'uint256' },
        { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
        { name: 'actionId', type: 'uint8', internalType: 'uint8' }
      ],
      name: 'params',
      type: 'tuple',
      internalType: 'struct IBondingCurveRouter.TokenCreationParams'
    }],
    name: 'create',
    outputs: [
      { name: 'token', type: 'address', internalType: 'address' },
      { name: 'pool', type: 'address', internalType: 'address' }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
];

const curveAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token', type: 'address' },
      { indexed: false, name: 'pool', type: 'address' },
      { indexed: false, name: 'name', type: 'string' },
      { indexed: false, name: 'symbol', type: 'string' },
      { indexed: false, name: 'tokenURI', type: 'string' }
    ],
    name: 'CurveCreate',
    type: 'event'
  }
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
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <circle cx="200" cy="200" r="150" fill="none" stroke="url(#xray)" stroke-width="3" opacity="0.3"/>
  <circle cx="200" cy="200" r="120" fill="none" stroke="url(#xray)" stroke-width="2" opacity="0.5"/>
  <text x="200" y="180" font-family="Arial Black" font-size="80" fill="url(#xray)" text-anchor="middle">X</text>
  <text x="200" y="260" font-family="Arial" font-size="36" fill="#00ffcc" text-anchor="middle">RAY</text>
</svg>`;
}

async function main() {
  console.log('🩻 X-Ray Token Deployment (viem)');
  console.log('='.repeat(50));

  // Load wallet
  const walletConfig = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../.config/wallet.json'), 'utf8'
  ));
  
  const account = privateKeyToAccount(walletConfig.privateKey);
  console.log(`Wallet: ${account.address}`);

  const publicClient = createPublicClient({
    chain: monad,
    transport: http('https://monad-mainnet.drpc.org'),
  });

  const walletClient = createWalletClient({
    account,
    chain: monad,
    transport: http('https://monad-mainnet.drpc.org'),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${Number(balance) / 1e18} MON`);

  // Step 1: Upload image
  console.log('\n📸 Step 1: Uploading image...');
  const svgImage = createXrayLogo();
  
  const imageResponse = await fetch(`${CONFIG.apiUrl}/agent/token/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/svg+xml' },
    body: svgImage,
  });
  
  if (!imageResponse.ok) throw new Error(`Image upload failed: ${await imageResponse.text()}`);
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
  
  if (!metadataResponse.ok) throw new Error(`Metadata upload failed: ${await metadataResponse.text()}`);
  const { metadata_uri } = await metadataResponse.json();
  console.log(`Metadata URI: ${metadata_uri}`);

  // Step 3: Mine salt
  console.log('\n⛏️ Step 3: Mining salt...');
  const saltResponse = await fetch(`${CONFIG.apiUrl}/agent/salt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creator: account.address,
      name: TOKEN.name,
      symbol: TOKEN.symbol,
      metadata_uri,
    }),
  });
  
  if (!saltResponse.ok) throw new Error(`Salt mining failed: ${await saltResponse.text()}`);
  const { salt, address: predictedAddress } = await saltResponse.json();
  console.log(`Salt: ${salt}`);
  console.log(`Predicted Address: ${predictedAddress}`);

  // Step 4: Create token (no initial buy to simplify)
  console.log('\n🚀 Step 4: Creating token...');
  const deployFee = parseEther('9'); // Trying with 9 MON
  
  const createArgs = {
    name: TOKEN.name,
    symbol: TOKEN.symbol,
    tokenURI: metadata_uri,
    amountOut: 0n, // No initial buy
    salt: salt,
    actionId: 0, // uint8 - try 0 for simple create
  };
  
  console.log('Args:', createArgs);
  console.log(`Value: ${Number(deployFee) / 1e18} MON (trying lower fee)`);

  // Simulate first
  console.log('Simulating...');
  try {
    const simResult = await publicClient.simulateContract({
      address: CONFIG.BONDING_CURVE_ROUTER,
      abi: bondingCurveRouterAbi,
      functionName: 'create',
      args: [createArgs],
      account: account.address,
      value: deployFee,
    });
    console.log('Simulation passed!');
  } catch (simError) {
    console.log('Simulation failed:', simError.message);
    console.log('Trying anyway...');
  }

  // Estimate gas first
  console.log('Estimating gas...');
  let gas;
  try {
    gas = await publicClient.estimateContractGas({
      address: CONFIG.BONDING_CURVE_ROUTER,
      abi: bondingCurveRouterAbi,
      functionName: 'create',
      args: [createArgs],
      account: account.address,
      value: deployFee,
    });
    gas = gas + gas / 10n; // +10% buffer
    console.log(`Estimated gas: ${gas}`);
  } catch (e) {
    console.log('Gas estimation failed, using default:', e.message);
    gas = 7000000n;
  }

  // Send transaction
  const hash = await walletClient.writeContract({
    address: CONFIG.BONDING_CURVE_ROUTER,
    abi: bondingCurveRouterAbi,
    functionName: 'create',
    args: [createArgs],
    value: deployFee,
    gas,
  });
  
  console.log(`TX Hash: ${hash}`);
  console.log('Waiting for confirmation...');
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`Status: ${receipt.status}`);
  console.log(`Block: ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed}`);

  // Find token address from logs
  let tokenAddress = predictedAddress;
  for (const log of receipt.logs) {
    try {
      const event = decodeEventLog({
        abi: curveAbi,
        data: log.data,
        topics: log.topics
      });
      if (event.eventName === 'CurveCreate') {
        tokenAddress = event.args.token;
        console.log(`Token from event: ${tokenAddress}`);
      }
    } catch {}
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ TOKEN DEPLOYED!');
  console.log('='.repeat(50));
  console.log(`Token: ${TOKEN.name} (${TOKEN.symbol})`);
  console.log(`Address: ${tokenAddress}`);
  console.log(`Trade: https://nad.fun/token/${tokenAddress}`);

  // Save info
  fs.writeFileSync(
    path.join(__dirname, '../.config/deployment.json'),
    JSON.stringify({
      tokenName: TOKEN.name,
      tokenSymbol: TOKEN.symbol,
      tokenAddress,
      txHash: hash,
      nadFunUrl: `https://nad.fun/token/${tokenAddress}`,
      deployedAt: new Date().toISOString(),
    }, null, 2)
  );
}

main().catch(e => {
  console.error('Error:', e.message);
  if (e.cause) console.error('Cause:', e.cause);
});
