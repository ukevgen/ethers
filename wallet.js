const { ethers, providers } = require("ethers");
const node =
  "https://multi-orbital-butterfly.discover.quiknode.pro/2395b00eb021a5b5439829a96cbcfeb50e6acb27/";
const provider = new ethers.JsonRpcProvider(node);

async function main() {
  const wallet = ethers.Wallet.createRandom();
  console.log(wallet.address);
  console.log(wallet.mnemonic.phrase);
  console.log(wallet.privateKey);
}

main();