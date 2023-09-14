const { ethers, providers } = require("ethers");
const node =
  "https://wild-proportionate-isle.discover.quiknode.pro/eda5fce76b636cb16d58380bfe310b43ebddca43/";
const provider = new ethers.JsonRpcProvider(node);
const address = "0xA7EFAe728D2936e78BDA97dc267687568dD593f3";

async function account() {
  const balance = await provider.getBalance(address);
  console.log(ethers.formatEther(balance));
}

account();
