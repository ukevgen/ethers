const BigNumber = require("bignumber.js");
const qs = require("qs");
const { ethers } = require("ethers");
const web3 = require("web3");

const node =
  "https://intensive-powerful-putty.discover.quiknode.pro/d5bbd9c5811edc5cbad5b4450107a9a454e2d0d9/";
const provider = new ethers.JsonRpcProvider(node);

const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC token address
const erc20abi =
  '[{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]';

const senderKey = "SENDER_KEY";
const wallet = new ethers.Wallet(senderKey, provider);

const contract = new ethers.Contract(tokenAddress, erc20abi, wallet);
const amountToSend = "0.000062";

async function getPrice() {
  console.log("Getting Price");

  const from = "ETH"; // Token address or ETH
  const to = "USDC"; // Token address or USDC
  const decimals = await contract.decimals();

  const amount = ethers.parseEther(amountToSend, decimals);
  const params = {
    sellToken: from,
    buyToken: to,
    sellAmount: amount,
  };

  const headers = { "0x-api-key": "02fcb787-6c69-4f8f-9929-f521d05598f0" };

  // Fetch the swap price.
  const response = await fetch(
    `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
    { headers: headers }
  );

  const data = await response.json();
  console.log("Price: ", data);
}

// Getting data for the transaction
async function getQuote(senderAddress) {
  console.log("Getting Quote for Address: ", senderAddress);

  const from = "ETH";
  const to = "USDC";

  const decimals = await contract.decimals();
  const amount = ethers.parseEther(amountToSend, decimals);

  const params = {
    sellToken: from,
    buyToken: to,
    sellAmount: amount,
    takerAddress: senderAddress,
  };

  const headers = { "0x-api-key": "02fcb787-6c69-4f8f-9929-f521d05598f0" };

  // Fetch the swap price.
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
    { headers: headers }
  );

  const data = await response.json();
  console.log("Quote: ", data);
  return data;
}

async function swap() {
  console.log("Trying swap");

  const quote = await getQuote(wallet.address);
  console.log("Swap: ", quote);

  console.log("Send Transaction");

  const feeData = await provider.getFeeData();
  console.log("Fee Data:", feeData);

  const tx = {
    gasLimit: quote.gas,
    to: quote.to,
    data: quote.data,
    value: quote.value,
    chainId: quote.chainId,
    maxPriorityFeePerGas: feeData["maxPriorityFeePerGas"],
    maxFeePerGas: feeData["maxFeePerGas"],
  };

  console.log("Transaction Data:", tx);

  await wallet.sendTransaction(tx).then(
    (transaction) => {
      console.log("Transaction: ", transaction);
    },
    (err) => {
      console.log("Error: ", err);
    }
  );
}

async function main() {
  swap();
}

main();
