const hre = require("hardhat")
const ethers = require("ethers")
const fs = require("fs")
const path = require("path")
const lighthouse = require("@lighthouse-web3/sdk")

const dataPool = require("../deployments/goerli/DataPool.json")

let apiKey = "27a3f333.4bcd0e387e0c4bdbad99c430b778a880"
//27a3f333.4bcd0e387e0c4bdbad99c430b778a880
async function main() {
    console.log("starting!")

    const signer = await hre.ethers.getSigners()
    let deployerwallet = signer[0]

    const datapool = new ethers.Contract(dataPool.address, dataPool.abi, deployerwallet)

    //DATA SHIT

    const dataPath = "./data"
    const cancerImagesPath = path.join(dataPath, "Cancer")
    const nonCancerImagesPath = path.join(dataPath, "Non_Cancer")

    let cancerImages = []
    let nonCancerImages = []

    fs.readdir(cancerImagesPath, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err)
            process.exit(1)
        }

        files.forEach((file, index) => {
            if (path.extname(file) === ".jpg" || path.extname(file) === ".JPG") {
                cancerImages.push(path.join(cancerImagesPath, file))
            }
        })
    })

    fs.readdir(nonCancerImagesPath, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err)
            process.exit(1)
        }

        files.forEach((file, index) => {
            if (path.extname(file) === ".jpg" || path.extname(file) === ".JPG") {
                nonCancerImages.push(path.join(nonCancerImagesPath, file))
            }
        })
    })

    setTimeout(async () => {
        console.log("uploading time!")

        for (let i = 0; i < cancerImages.length; i++) {
            const response = await lighthouse.upload(cancerImages[0], apiKey)
            let url = "https://gateway.lighthouse.storage/ipfs/" + response.data.Hash
            console.log(url)
            let tx = await datapool.addData(url, url, true)
            tx.wait()
            console.log("added to contract: ", tx.hash)
        }

        for (let i = 0; i < nonCancerImages.length; i++) {
            const response = await lighthouse.upload(cancerImages[0], apiKey)
            let url = "https://gateway.lighthouse.storage/ipfs/" + response.data.Hash
            console.log(url)
            let tx = await datapool.addData(url, url, false)
            tx.wait()
            console.log("added to contract: ", tx.hash)
        }
    }, 2000)
}

main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
})
