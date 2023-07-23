require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy } = deployments

    console.log("deploying data pool")

    console.log(wallet.address)
    const stableDiffusionCaller = await deploy("DataPool", {
        from: wallet.address,
        log: true,
    })

    console.log("deployed DataPool")
}

module.exports.tags = ["DataPool"]
