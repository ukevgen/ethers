const BigNumber = require("bignumber.js");
const qs = require("qs");
const { ethers } = require("ethers");
const web3 = require("web3");

const node =
  "https://intensive-powerful-putty.discover.quiknode.pro/d5bbd9c5811edc5cbad5b4450107a9a454e2d0d9/";
const provider = new ethers.JsonRpcProvider(node);

const ZERO_EX_ADDRESS = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";
const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC token address
const erc20abi =
  '[{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]';

const senderKey = "SENDER_KEY";
const wallet = new ethers.Wallet(senderKey, provider);

const contract = new ethers.Contract(tokenAddress, erc20abi, wallet);

const senderAddress = "0xb4272f48d04cdc290D1aecDa8b50919f2137BFbF";
const amountToSend = 30 * Math.pow(10, 6);

const sellToken = "USDC";
const buyToken = "ETH";

// Getting data for the transaction

async function swap(ownerAddress, spenderAddress, amount) {
  console.log("Trying swap");
  console.log("Getting Fee");

  const feeData = await provider.getFeeData();

  const allowed = await isAllowed(ownerAddress, spenderAddress, amount);
  if (allowed) {
    console.log("Already allowed");
  } else {
    console.log("Doing allowance");
    const approvedTx = await approve(spenderAddress, amount);
  }

  const quote = await getQuote(ownerAddress, amount, sellToken, buyToken);

  sendTransaction(quote, feeData);
}

/**
 *
 * @param {wallet address} ownerAddress
 * @param {address that what to take contains} spenderAddress
 * @param {amount to spend in } amount
 * @returns
 */
async function isAllowed(ownerAddress, spenderAddress, amount) {
  const currentAllowance = new BigNumber(
    await contract.allowance(ownerAddress, spenderAddress)
  );

  console.log("Current Allowance: ", currentAllowance.toString());
  console.log("Amount: ", amount);

  return currentAllowance >= amount;
}

async function approve(spenderAddres, amount) {
  const transaction = await contract.approve(spenderAddres, amount);
  return transaction;
}

async function getQuote(ownerAddress, amount, sellToken, buyToken) {
  console.log("Getting Quote for Address: ", ownerAddress);

  const params = {
    sellToken: sellToken,
    buyToken: buyToken,
    sellAmount: amount,
    takerAddress: ownerAddress,
  };

  const headers = { "0x-api-key": "02fcb787-6c69-4f8f-9929-f521d05598f0" };

  // Fetch the swap Quote.
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
    { headers: headers }
  );

  const data = await response.json();
  console.log("Quote: ", data);
  return data;
}

async function sendTransaction(quote, fee) {
  const tx = {
    gasLimit: quote.gas,
    to: quote.to,
    data: quote.data,
    value: quote.value,
    chainId: quote.chainId,
    maxPriorityFeePerGas: fee["maxPriorityFeePerGas"],
    maxFeePerGas: fee["gasPrice"],
  };

  console.log("Send Transaction");
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
  swap(senderAddress, ZERO_EX_ADDRESS, amountToSend);
}

main();
