// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Shambles.sol";
import "./Shamblx.sol";

contract StakingShambles {
    uint public totalStaked;
    struct Staking {
        uint24 tokenId;
        uint48 stakingStartTime;
        address owner;
    }

    mapping(uint => Staking) public ShambleStaked;

    uint rewardsPerHour = 10000;
    Shamblx token;
    Shambles nft;

    event Staked(address indexed owner, uint tokenId, uint value);
    event Unstaked(address indexed owner, uint tokenId, uint value);
    event Claimed(address indexed owner, uint amount);

    constructor(Shamblx _token, Shambles _nft) {
        token = _token;
        nft = _nft;
    }

    function getStaked() public view returns (Staking[] memory) {
        uint stakedTokenCount = 0;

        for (uint tokenId = 1; tokenId <= nft.getAllNFTs().length; tokenId++) {
            if (ShambleStaked[tokenId].owner == msg.sender) {
                stakedTokenCount++;
            }
        }

        Staking[] memory stakedTokens = new Staking[](stakedTokenCount);
        uint currentIndex = 0;

        for (uint tokenId = 1; tokenId <= nft.getAllNFTs().length; tokenId++) {
            if (ShambleStaked[tokenId].owner == msg.sender) {
                stakedTokens[currentIndex] = ShambleStaked[tokenId];
                currentIndex++;
            }
        }

        return stakedTokens;
    }

    function Stake(uint tokenId) external {
        totalStaked += 1;
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(ShambleStaked[tokenId].stakingStartTime == 0, "already Staked");
        nft.transferFrom(msg.sender, address(this), tokenId);

        emit Staked(msg.sender, tokenId, block.timestamp);

        ShambleStaked[tokenId] = Staking({
            tokenId: uint24(tokenId),
            stakingStartTime: uint48(block.timestamp),
            owner: msg.sender
        });
    }

    function _unstake(address owner, uint tokenId) internal {
        totalStaked -= 1;
        require(ShambleStaked[tokenId].owner == msg.sender, "not the owner");

        emit Unstaked(msg.sender, tokenId, block.timestamp);
        delete ShambleStaked[tokenId];

        nft.transferFrom(address(this), owner, tokenId);
    }

    function claim(uint tokenId) external {
        _claim(msg.sender, tokenId, false);
    }

    function unstake(uint tokenId) external {
        _claim(msg.sender, tokenId, true);
    }

    function _claim(address owner, uint tokenId, bool _unstaked) internal {
        uint earned;
        Staking memory thisStake = ShambleStaked[tokenId];
        require(thisStake.owner == owner, "not the owner");
        uint stakingStartTime = thisStake.stakingStartTime;

        earned = ((block.timestamp - stakingStartTime) * rewardsPerHour) / 3600;
        ShambleStaked[tokenId] = Staking({
            tokenId: uint24(tokenId),
            stakingStartTime: uint48(block.timestamp),
            owner: owner
        });

        if (earned > 0) {
            token.mint(owner, earned);
        }
        if (_unstaked) {
            _unstake(owner, tokenId);
        }
        emit Claimed(owner, earned);
    }

    function getRewardAmount(
        address owner,
        uint tokenId
    ) external view returns (uint) {
        uint earned;
        Staking memory thisStake = ShambleStaked[tokenId];
        require(thisStake.owner == owner, "not the owner");
        uint stakingStartTime = thisStake.stakingStartTime;
        earned = ((block.timestamp - stakingStartTime) * rewardsPerHour) / 3600;
        return earned;
    }
}
