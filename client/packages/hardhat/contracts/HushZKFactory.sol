// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

contract HushZKFactory {
    
    address public immutable owner;
    uint256 public numUsers = 0;
    mapping(address => address[]) public userReportsContractIDs;

    event ProfileCreated(address indexed creator, uint256 value);

    constructor(address _owner) {
        owner = _owner;
    }

    function createSecretProfile() public payable {
        require(userReportsContractIDs[msg.sender].length == 0, "You have already created a profile, please log in!");
        numUsers++;
        userReportsContractIDs[msg.sender] = new address[](0);
        emit ProfileCreated(msg.sender, numUsers);
    }
}
