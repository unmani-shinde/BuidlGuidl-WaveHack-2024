// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./HushZKReport.sol";

contract HushZKFactory {
    
    address public immutable owner;
    uint256 public numUsers = 0;
    uint256 public numReports = 0;
    mapping(address => address[]) public userReportsContractIDs;
    address[] public userAddresses;

    event ProfileCreated(address indexed creator, uint256 value);

    constructor(address _owner) {
        owner = _owner;
    }

    function checkforWhistleblower(address addr) private view returns (bool) {
        bool flag = true;
        for(uint256 i = 0; i<userAddresses.length && flag; i++){
            if(userAddresses[i]==addr){flag = false;}
        }

        return flag;
    }

    function createSecretProfile() public payable {
        require(checkforWhistleblower(msg.sender), "You have already created a profile, please log in!");
        numUsers++;
        userReportsContractIDs[msg.sender] = new address[](0);
        userAddresses.push(msg.sender);
        emit ProfileCreated(msg.sender, numUsers);
    }

    function deployReport(string memory metadata) external      
    {
        bytes32 _salt = bytes32(block.timestamp);
        require(!(checkforWhistleblower(msg.sender)), "You do not have a profile on Hush. Please create one before moving ahead!");
        address latestReportAddress = Create2.deploy(0,_salt, abi.encodePacked(type(HushZKReport).creationCode, abi.encode(metadata,numReports))
        );
        userReportsContractIDs[msg.sender].push(latestReportAddress);
    
        numReports++;
    }
}
