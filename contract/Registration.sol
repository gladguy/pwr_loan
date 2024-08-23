// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registration {
    // Mapping from an Ethereum address to a Bitcoin address ID
    mapping(address => uint256) public addressToBitcoinAddressId;

    // Mapping from an Ethereum address to an array of ordinals
    mapping(address => uint256[]) public addressToOrdinals;

    // Array to store all ordinals added through addOrdinalToAddress
    uint256[] public allOrdinals;

    // Mapping from an Ethereum address to an array of minted ordinals
    mapping(address => uint256[]) public mintedOrdinals;

    address private allowedContract;
    string private ordinalBaseURI;

    modifier onlyAllowedContract() {
        require(msg.sender == allowedContract, "Caller is not the allowed contract");
        _;
    }

    // Function to set the allowed contract address
    function setAllowedContract(address _contract) public {
        allowedContract = _contract;
    }

    // Event to be emitted when a Bitcoin address ID is assigned to an address
    event BitcoinAddressIdAssigned(address indexed _address, uint256 _bitcoinAddressId);

    // Event to be emitted when an ordinal is added to an address
    event OrdinalAdded(address indexed _address, uint256 _ordinal);

    // Function to assign a Bitcoin address ID to an address
    function saveBitcoinAddress(uint256 _bitcoinAddressId, address _address) public returns (bool) {
        if (addressToBitcoinAddressId[_address] != 0) {
            return false; // Return false if the address already has a Bitcoin address ID assigned
        }
        addressToBitcoinAddressId[_address] = _bitcoinAddressId;
        emit BitcoinAddressIdAssigned(_address, _bitcoinAddressId);
        return true; // Return true if the assignment was successful
    }


    // Function to add an ordinal to an address
    function addOrdinal(uint256 _ordinal) public {
        addressToOrdinals[msg.sender].push(_ordinal);
        emit OrdinalAdded(msg.sender, _ordinal);
    }

    // Function to store an ordinal to an address
    // function storeOrdinal(uint256 _ordinal, address _address) public onlyAllowedContract {
    function storeOrdinal(uint256 _ordinal, address _address) public {
        addressToOrdinals[_address].push(_ordinal);
        allOrdinals.push(_ordinal);
    }

    // Function to add an ordinal to an address and store it in allOrdinals array
    function addOrdinalToAddress(uint256 _ordinal, address _address) public {
        addressToOrdinals[_address].push(_ordinal);
        allOrdinals.push(_ordinal);
        emit OrdinalAdded(_address, _ordinal);
    }

    // Function to add a minted ordinal to an address
    // function storeMintedOrdinal(uint256 _ordinal, address _address) public onlyAllowedContract {
    function storeMintedOrdinal(uint256 _ordinal, address _address) public {
        mintedOrdinals[_address].push(_ordinal);
    }

    // Function to check whether an ordinal exists in allOrdinals array
    function ordinalExists(uint256 _ordinal) public view returns (bool) {
        for (uint256 i = 0; i < allOrdinals.length; i++) {
            if (allOrdinals[i] == _ordinal) {
                return true;
            }
        }
        return false;
    }

    // Function to check whether an ordinal belongs to the caller
    function isOrdinalBelongToCaller(uint256 _ordinal) public view returns (bool) {
        uint256[] storage ordinals = addressToOrdinals[msg.sender];
        for (uint256 i = 0; i < ordinals.length; i++) {
            if (ordinals[i] == _ordinal) {
                return true;
            }
        }
        return false;
    }

    // Function to check whether an ordinal belongs to a specific address

    function isOrdinalBelongToAddress(uint256 _ordinal, address _address) public view returns (bool) {
        uint256[] storage ordinals = addressToOrdinals[_address];
        for (uint256 i = 0; i < ordinals.length; i++) {
            if (ordinals[i] == _ordinal) {
                return true;
            }
        }
        return false;
    }

    // Function to check whether an ordinal has already been minted
    function isMinted(uint256 _ordinal) public view returns (bool) {
        for (uint256 i = 0; i < allOrdinals.length; i++) {
            if (allOrdinals[i] == _ordinal) {
                return true;
            }
        }
        return false;
    }

    // Function to retrieve the Bitcoin address ID associated with an address
    function getBitcoinAddressId(address _address) public view returns (uint256) {
        return addressToBitcoinAddressId[_address];
    }

    // Function to retrieve the array of ordinals associated with an address
    function getOrdinals(address _address) public view returns (uint256[] memory) {
        return addressToOrdinals[_address];
    }

    // Function to retrieve the array of minted ordinals associated with an address
    function getMintedOrdinals(address _address) public view returns (uint256[] memory) {
        return mintedOrdinals[_address];
    }
}