// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Carbon_Offset is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("Carbon_Offset", "COFF")
        Ownable(initialOwner)
        ERC20Permit("Carbon_Offset")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract NFT_Mint is ERC721, ERC721Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin, address minter) ERC721("NEUTroken", "NEU") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }

    function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

contract NEUTroken{
    
    struct User {
        uint256 userID;
        address payable userAddress;
        string userName;
        uint256 userNFTsCount;
        uint256 userCOFFsCount;
        int256 userOnChainGreenReputation;
    }

    uint256 public numUsers = 0;
    mapping(uint256 => User) public Users;


    
    function initializeUser(address payable _userAddress,string memory _userName) internal {
        numUsers++;
        User memory newUser = User({
            userID: numUsers,
            userAddress: _userAddress,
            userName: _userName,
            userNFTsCount: 0,
                userCOFFsCount: 0,
                userOnChainGreenReputation: -1
         });
        Users[numUsers] = newUser;
    }
    
  function compute_on_chain_reputation(uint256 _userId) public {
    require(_userId > 0 && _userId <= numUsers, "Invalid user ID!");
    User storage user = Users[_userId];
    
    // Define weights for each factor (you can adjust these as needed)
    uint256 nftWeight = 100;  // Scaled by 100 for two decimal places
    uint256 coffWeight = 100;  // Scaled by 100 for two decimal places
    uint256 erc20Weight = 10;  // Scaled by 100 for two decimal places

    // Convert user counts to scaled values
    uint256 scaledUserNFTsCount = user.userNFTsCount * 100;
    uint256 scaledUserCOFFsCount = user.userCOFFsCount * 100;

    // Compute reputation score based on factors
    // Positive contribution from COFFs, negative contribution from NFTs, and minor negative contribution from ERC20 tokens
    int256 reputationScore = int256((scaledUserCOFFsCount * coffWeight) - (scaledUserNFTsCount * nftWeight) - (scaledUserCOFFsCount * erc20Weight));

    // Update user's on-chain green reputation
    user.userOnChainGreenReputation = reputationScore;
}


    NFT_Mint nft_mint_contract; 
    Carbon_Offset carbon_offset_contract;

    // constructor(address _nftContractAddress, address _coffContractAddress) {
    //     nft_mint_contract = NFT_Mint(_nftContractAddress);
    //     carbon_offset_contract = Carbon_Offset(_coffContractAddress);
    // }

    function mintNFTAndAllotCOFFs(uint256 _nftId, bool hasOffset, uint256 _coffAmount) external {
        // Mint NFT
        nft_mint_contract.safeMint(msg.sender, _nftId);

        // Allot COFFs
        if(hasOffset){carbon_offset_contract.transferFrom(address(this), msg.sender, _coffAmount);}
    }

    // Other functions for interacting with the contracts...
}
