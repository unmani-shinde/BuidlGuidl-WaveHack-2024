//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Whistle {

    string metadata;
    uint256 whistleID;

    constructor(string memory _metadata, uint256 id) {
        metadata = _metadata;
        whistleID = id;
    }
}