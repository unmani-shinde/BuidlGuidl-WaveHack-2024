// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./Whistle.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
contract WhistleFactory {

    uint256 public numWhistles = 0;
    mapping (bytes32=>address) public allWhistles;
    address public latestWhistleAddress;

    // function registerWhistle(string memory metadata,bytes32 _salt) public {
    //     numWhistles++;
    // }

    modifier isWhistleNotRegistered(bytes32 _salt) {
        require(allWhistles[_salt] == address(0), "Whistle already registered for this salt");
        _;
    }

    function computeTokenAddress(bytes32 _salt, string memory metadata)
        public 
        view 
        returns (address) 
    {
        return Create2.computeAddress(
            _salt,
            keccak256(abi.encodePacked(type(Whistle).creationCode, abi.encode(metadata,numWhistles)))
        );
    }

    function deployWhistle(bytes32 _salt, string memory metadata) 
        external 
        isWhistleNotRegistered(_salt) 
        returns (address) 
    {
        latestWhistleAddress = Create2.deploy(0,_salt, abi.encodePacked(type(Whistle).creationCode, abi.encode(metadata,numWhistles))
        );

        allWhistles[_salt] = latestWhistleAddress;
        numWhistles++;
        return latestWhistleAddress;
    }
}
