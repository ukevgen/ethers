// receiver

// address 0x6ddabb8d7120067f876303ae6cfdff24b348e570
// key 42867b3b5125e9e96ec2168c70d43afd65a1bf453233fe6ce3d862ff7dab7368

// sender
// address 0x368b0c44a303a223963ec5e317aa188ee10d364d
// key 9f122ad4107259411d6438245f5b4a0b5db4063c9e080693ece2f36993ff64c8

const { ethers, providers } = require("ethers");
const node =
  "https://attentive-aged-dawn.ethereum-goerli.discover.quiknode.pro/0dbc7d3aa0131515db625729e2cfea991f93131f/";
const provider = new ethers.JsonRpcProvider(node);

const senderAddress = "0x6ddabb8d7120067f876303ae6cfdff24b348e570";
const senderKey =
  "42867b3b5125e9e96ec2168c70d43afd65a1bf453233fe6ce3d862ff7dab7368";
const receiverAddress = "0x368b0c44a303a223963ec5e317aa188ee10d364d";

const wallet = new ethers.Wallet(senderKey, provider);

async function main() {
  const senderBalance = await provider.getBalance(wallet.address);
  const receiverBalance = await provider.getBalance(receiverAddress);
  console.log(ethers.formatEther(senderBalance));
  console.log(ethers.formatEther(receiverBalance));

  sendTransaction(receiverAddress, "0.05", senderKey).then(
    (transaction) => {
      console.log("Transaction hash", transaction.hash);
    }
  );
}

function sendTransaction(to, amount, key) {
  const wallet = new ethers.Wallet(key, provider);

  return wallet.sendTransaction({
    to: to,
    value: ethers.parseEther(amount),
  });
}

main();
