const hre = require("hardhat");

async function main() {

  const Shambles = await hre.ethers.getContractFactory("Shambles");
  const shambles = await Shambles.deploy();

  await shambles.deployed();

  console.log(
    `shambles deployed to ${shambles.address}`
  );

  const Shamblx = await hre.ethers.getContractFactory("Shamblx");
  const shamblx = await Shamblx.deploy();

  await shamblx.deployed();

  console.log(
    `shamblx deployed to ${shamblx.address}`
  );

  const StakingShambles = await hre.ethers.getContractFactory("StakingShambles");
  const stakingShambles = await StakingShambles.deploy(shamblx.address, shambles.address);

  await stakingShambles.deployed();

  console.log(
    `stakingShambles deployed to ${stakingShambles.address}`
  );

  await shamblx.addAdmin(stakingShambles.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
