// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Shambles is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Shamble {
        bool forSale;
        uint price;
        address seller;
        string id;
        bool auction;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
    }

    mapping(uint256 => Shamble) public _shambles;

    event TokenBuy(address seller, address buyer, uint tokenId, uint price);

    constructor() ERC721("Shambles", "SHMBL") {
        createShamble();
    }

    function createShamble() public onlyOwner {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _mint(msg.sender, newTokenId);
        _shambles[newTokenId] = Shamble(
            false,
            0.01 ether,
            msg.sender,
            string(abi.encodePacked(Strings.toString(newTokenId))),
            true,
            block.timestamp + 1 days,
            msg.sender,
            0.01 ether
        );
        _setTokenURI(
            newTokenId,
            string(
                abi.encodePacked(
                    "https://aqua-variable-hummingbird-314.mypinata.cloud/ipfs/Qmb7n8Dtv7cJBmCE8FtFb5UjSCn2tHkBUPLtgdSpSJB8FQ/",
                    string(abi.encodePacked(Strings.toString(newTokenId))),
                    ".png"
                )
            )
        );
    }

    function placeBid(uint256 tokenId) external payable nonReentrant {
        require(
            block.timestamp <= _shambles[tokenId].auctionEndTime,
            "Auction is over"
        );
        require(msg.sender != owner(), "you are the owner");

        require(
            msg.value > _shambles[tokenId].highestBid,
            "Bid must be higher than the current highest bid"
        );

        if (_shambles[tokenId].highestBidder != owner()) {
            // Return funds to the previous highest bidder
            payable(_shambles[tokenId].highestBidder).transfer(
                _shambles[tokenId].highestBid
            );
        }

        _shambles[tokenId].highestBidder = msg.sender;
        _shambles[tokenId].highestBid = msg.value;
    }

    function endAuction(uint256 tokenId) external onlyOwner nonReentrant {
        require(
            block.timestamp > _shambles[tokenId].auctionEndTime,
            "Auction is still active"
        );

        require(
            _shambles[tokenId].highestBidder != owner(),
            "No bids received"
        );
        _shambles[tokenId].auction = false;
        _shambles[tokenId].seller = _shambles[tokenId].highestBidder;

        // Transfer the NFT to the highest bidder
        safeTransferFrom(
            ownerOf(tokenId),
            _shambles[tokenId].highestBidder,
            tokenId
        );

        payable(owner()).transfer(address(this).balance);
        createShamble();
    }

    function setForSale(uint256 tokenId, uint price) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "Only the owner can set for sale");
        require(_shambles[tokenId].forSale == false, "Already set");
        require(_shambles[tokenId].auction == false, "NFT in auction sell");
        _shambles[tokenId].forSale = true;
        _shambles[tokenId].price = (price * 1 ether) / 100;
    }

    function unSale(uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "Only the owner can set for sale");
        require(_shambles[tokenId].forSale == true, "Already set");
        _shambles[tokenId].forSale = false;
    }

    function buyShamble(uint256 tokenId) public payable nonReentrant {
        require(msg.sender != ownerOf(tokenId), "You are the owner");
        require(_shambles[tokenId].forSale, "Token is not for sale");
        require(
            msg.value >= _shambles[tokenId].price,
            "Ether value must be greater than price"
        );
        address owner = ownerOf(tokenId);

        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed.");
        _transfer(owner, msg.sender, tokenId);
        approve(address(this), tokenId);
        _shambles[tokenId].forSale = false;
        _shambles[tokenId].seller = msg.sender;
        emit TokenBuy(owner, msg.sender, tokenId, _shambles[tokenId].price);
    }

    function getAllNFTs() public view returns (Shamble[] memory) {
        uint nftCount = _tokenIdCounter.current();
        Shamble[] memory tokens = new Shamble[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < nftCount; i++) {
            currentId = i + 1;
            Shamble storage currentItem = _shambles[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return tokens;
    }

    function getMyNFTs() public view returns (Shamble[] memory) {
        uint totalItemCount = _tokenIdCounter.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                itemCount += 1;
            }
        }

        Shamble[] memory items = new Shamble[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                currentId = i + 1;
                Shamble storage currentItem = _shambles[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
