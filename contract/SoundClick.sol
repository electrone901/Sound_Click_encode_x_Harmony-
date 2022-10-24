// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SoundClick is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public _totalNFTs;
  uint public _totalBeats = 0;
  mapping(uint => BeatsObj) public BeatList;

  struct BeatsObj {
    uint id;
    bool isSold;
    string cid;
    uint price;
    address organizer;
  }

  constructor() ERC721("BeatStore", "BS") {}

  // calldata is read only, use for funct inputs as params
  function createBeat(string calldata _cid, uint _price) public {
      BeatList[_totalBeats] = BeatsObj(_totalBeats,false, _cid, _price, msg.sender);
      _totalBeats++;
  }

  // user should be able to buy Beats
  function buyBeat(uint _id) public payable {
      BeatsObj storage _beat = BeatList[_id];
    _mint(msg.sender, _beat.id);
    // set nft to id
    _setTokenURI(_beat.id, _beat.cid);
    _beat.isSold = true;
  }

  function getAllBeats() public view returns (BeatsObj[] memory) {
      BeatsObj[] memory beatArray = new BeatsObj[](_totalBeats);

      for (uint i = 0; i < _totalBeats; i++) {
          BeatsObj storage currentItem = BeatList[i];
          beatArray[i] = currentItem;
      }
      return beatArray;
  }

}

