
const {ethers, providers} = require('ethers')
const node = 'https://wild-proportionate-isle.discover.quiknode.pro/eda5fce76b636cb16d58380bfe310b43ebddca43/'
const provider  =  new ethers.JsonRpcProvider(node)

async function main() {
    const blocNumber = await provider.getBlockNumber()
    console.log(blocNumber)
    const block = await provider.getBlock(blocNumber)
    console.log(block.hash)
    console.log(block.date)
    console.log(block.miner)
}

main()
