const { ethers, providers } = require("ethers");
const node =
  "https://wild-proportionate-isle.discover.quiknode.pro/eda5fce76b636cb16d58380bfe310b43ebddca43/";
const provider = new ethers.JsonRpcProvider(node);

async function transaction() {
  const blocNumber = await provider.getBlockNumber();
  console.log(blocNumber);

  const block = await provider.getBlock(blocNumber);
  await provider.getTransaction(block.transactions[0]).then((transaction) => {
    console.log(transaction.from);
    console.log(transaction.to);
    console.log(ethers.formatEther(transaction.value));
  });
}

transaction();
