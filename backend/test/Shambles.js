const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');


let contract;
let owner;
describe("deploy Shambles contract", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("Shambles");
    contract = await Contract.deploy();
  });

  it("after deploy should return 1 token", async function () {
    expect(await contract.balanceOf(owner)).to.equal(1);
  });
});

describe("test createShamble ", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("Shambles");
    contract = await Contract.deploy();
  });

  it("should return info token", async function () {
    let shamble1 = await contract._shambles(1)
    expect(shamble1[0]).to.equal(false);
    expect(parseFloat(shamble1[1])).to.equal(1 * (10 ** 16));
    expect(shamble1[2]).to.equal(owner);
    expect(shamble1[3]).to.equal('1');
    expect(await contract.tokenURI(shamble1[3])).to.equal('https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/Qmb7n8Dtv7cJBmCE8FtFb5UjSCn2tHkBUPLtgdSpSJB8FQ/1.png')
  });
});

describe("test getAllNFTs", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("Shambles");
    contract = await Contract.deploy();
  });

  it("should return 1 tokens", async function () {
    const arrayNFT = await contract.getAllNFTs()
    expect(arrayNFT.length).to.equal(1);
  });
});