const ethers = require("ethers")
const hre = require("hardhat")

const naiveExamplesClient = require("../deployments/goerli/DataPool.json")

async function main() {
    console.log("starting!")

    const signer = await hre.ethers.getSigners()
    let deployerwallet = signer[0]

    console.log("deployer address:")
    console.log(deployerwallet.address)

    // Get the balance of the deployer wallet
    let balance = await deployerwallet.getBalance()
    console.log("deployer wallet balance:", ethers.utils.formatEther(balance))

    const examplesContract = new ethers.Contract(
        naiveExamplesClient.address,
        naiveExamplesClient.abi,
        deployerwallet
    )

    let price = await examplesContract.lilypadFee()

    console.log("got price:", price.toString())

    // let estimate = await examplesContract.estimateGas.StableDiffusion("A cute orange cat")

    //console.log(`Estimated gas: ${estimate.toNumber()}`)

    let all = await examplesContract.allImages({
        gasLimit: 1000000,
    })
    console.log("images:", all)

    let tx = await examplesContract.StableDiffusion("A cute orange cat", {
        value: price,
        gasLimit: 1000000000,
    })

    console.log(tx.hash)

    tx.wait()

    console.log("got trnasaction went through")

    examplesContract.on("NewImageGenerated", (jobID, cid) => {
        console.log(`jobID: ${jobID}`)
        console.log(`results CID: ${cid}`)
        console.log(`https://ipfs.io/ipfs/${cid}`)
        process.exit(0)
    })
}

main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
})
