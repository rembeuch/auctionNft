require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      //accounts : Merci hardhat :D !
      chainId: 31337,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [`${process.env.MNEMONIC}`],
      chainId: 11155111,
    }
  },
  solidity: "0.8.19",
};