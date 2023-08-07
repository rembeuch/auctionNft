const hre = require("hardhat");

async function main() {

  const Shambles = await hre.ethers.getContractFactory("Shambles");
  const shambles = await Shambles.deploy();

  await shambles.deployed();

  console.log(
    `shambles deployed to ${shambles.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
