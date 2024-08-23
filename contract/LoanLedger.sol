// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Start of @openzeppelin/contracts/token/ERC721/IERC721.sol
interface IERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}
// End of @openzeppelin/contracts/token/ERC721/IERC721.sol

// Start of @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol
interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}
// End of @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol

// Start of @openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol
contract ERC721Holder is IERC721Receiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
// End of @openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol

// Start of @openzeppelin/contracts/access/Ownable.sol
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
// End of @openzeppelin/contracts/access/Ownable.sol

// Start of @openzeppelin/contracts/utils/Counters.sol
library Counters {
    struct Counter {
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}
// End of @openzeppelin/contracts/utils/Counters.sol

// LoanOffer.sol
contract LoanOffer is ERC721Holder, Ownable(0xf4694b507903977337883DD4517c0CB1d544Ab42) {
    using Counters for Counters.Counter;
    Counters.Counter private _offerIds;

    struct Lending {
        address lender;
        address borrower;
        address nftContract;
        uint256 tokenId;
        uint256 loanStartTime;
        uint256 dueDate;
        uint256 repaymentTime;
        bool isActive;
    }

    struct BorrowRequest {
        uint256 requestId;
        address nftContract;
        uint256 collectionId;
        uint256 tokenId;
        address borrower;
        uint256 duration;
        uint256 loanAmount;
        uint256 repayAmount;
        uint256 platformFee;
        uint256 createdAt;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Lending)) public lendings; // NFT contract address => Token ID => Lending
    mapping(uint256 => BorrowRequest) public borrowRequests; // Request ID => BorrowRequest

    event NFTLent(address indexed lender, address indexed borrower, address indexed nftContract, uint256 tokenId, uint256 dueDate);
    event NFTReturned(address indexed lender, address indexed borrower, address indexed nftContract, uint256 tokenId);
    event BorrowRequestCreated(uint256 indexed requestId, address indexed borrower, address indexed nftContract, uint256 tokenId, uint256 duration, uint256 loanAmount, uint256 repayAmount, uint256 platformFee);
    event BorrowRequestAccepted(uint256 indexed requestId, address indexed borrower, address indexed nftContract, uint256 tokenId);
    event BorrowRequestPaid(address indexed borrower, address indexed lender, uint256 repayAmount, uint256 platformFee);

    function createBorrowRequest(address nftContract, uint256 collectionId, uint256 tokenId, uint256 duration, uint256 loanAmount, uint256 repayAmount, uint256 platformFee) external {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You do not own this NFT");

        _offerIds.increment();
        uint256 requestId = _offerIds.current();

        BorrowRequest memory newRequest = BorrowRequest({
            requestId: requestId,
            nftContract: nftContract,
            collectionId: collectionId,
            tokenId: tokenId,
            borrower: msg.sender,
            duration: duration,
            loanAmount: loanAmount,
            repayAmount: repayAmount,
            platformFee: platformFee,
            createdAt: block.timestamp,
            isActive: true
        });

        borrowRequests[requestId] = newRequest;

        emit BorrowRequestCreated(requestId, msg.sender, nftContract, tokenId, duration, loanAmount, repayAmount, platformFee);
    }

    function approveNFT(address nftContract) external {
        IERC721 nft = IERC721(nftContract);

        // Ensure that the caller has not already approved the contract for all their tokens
        require(!nft.isApprovedForAll(msg.sender, address(this)), "Already approved for all tokens");

        // Set approval for all tokens
        nft.setApprovalForAll(address(this), true);
    }

    function transferCheck(uint256 requestId) external {
        BorrowRequest storage request = borrowRequests[requestId];
        IERC721 nft = IERC721(request.nftContract);
        nft.safeTransferFrom(request.borrower, address(this), request.tokenId);
    }

    function acceptBorrowRequest(uint256 requestId) external payable {
        BorrowRequest storage request = borrowRequests[requestId];
        require(request.isActive, "This borrow request is not active");
        require(msg.value >= request.loanAmount, "Loan amount does not match");

        IERC721 nft = IERC721(request.nftContract);
        require(nft.ownerOf(request.tokenId) == request.borrower, "Borrower does not own this NFT");

        // Transfer loan amount to the lender
        payable(request.borrower).transfer(msg.value);

        nft.safeTransferFrom(request.borrower, address(this), request.tokenId);

        Lending memory newLending = Lending({
            lender: msg.sender,
            borrower: request.borrower,
            nftContract: request.nftContract,
            tokenId: request.tokenId,
            loanStartTime: block.timestamp,
            dueDate: block.timestamp + (86400),
            repaymentTime: 0,
            isActive: true
        });

        lendings[request.nftContract][request.tokenId] = newLending;
        request.isActive = false;

        emit NFTLent(msg.sender, request.borrower, request.nftContract, request.tokenId, newLending.dueDate);
        emit BorrowRequestAccepted(requestId, request.borrower, request.nftContract, request.tokenId);
    }

    function loanRepayment(address nftContract, uint256 tokenId) external payable {
        Lending storage lending = lendings[nftContract][tokenId];
        require(lending.isActive, "This NFT is not lent out");
        require(lending.borrower == msg.sender || lending.dueDate < block.timestamp, "You are not the borrower or the due date has not passed");

        BorrowRequest memory request = _getBorrowRequestByTokenId(nftContract, tokenId);
        require(msg.value >= request.repayAmount, "Repay amount does not match");

        // Transfer the repay amount and platform fee
        uint256 lenderAmount = msg.value - request.platformFee;
        payable(lending.lender).transfer(lenderAmount);
        payable(owner()).transfer(request.platformFee);

        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), lending.borrower, tokenId);

        lending.isActive = false;
        lending.repaymentTime = block.timestamp;

        emit NFTReturned(lending.lender, lending.borrower, nftContract, tokenId);
        emit BorrowRequestPaid(lending.borrower, lending.lender, request.repayAmount, request.platformFee);
    }

    function forceReturnNFT(uint256 requestId) external onlyOwner {
        BorrowRequest storage request = borrowRequests[requestId];
        IERC721 nft = IERC721(request.nftContract);
        nft.safeTransferFrom(request.borrower, address(this), request.tokenId);
    }

    function forcloseLoan(address nftContract, uint256 tokenId) external onlyOwner {
        Lending storage lending = lendings[nftContract][tokenId];
        require(lending.isActive, "This NFT is not lent out");

        // Need to add conditions
        // Forclose Loan after Loan Due
        // Loan Due is close
        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), lending.lender, tokenId);

        lending.isActive = false;

        emit NFTReturned(lending.lender, lending.borrower, nftContract, tokenId);
    }

    function getBorrowRequestByTokenId(address nftContract, uint256 tokenId) external view returns (BorrowRequest memory) {
        for (uint256 i = 1; i <= _offerIds.current(); i++) {
            BorrowRequest storage request = borrowRequests[i];
            if (request.nftContract == nftContract && request.tokenId == tokenId) {
                return request;
            }
        }
        // Return a default BorrowRequest struct if no matching request is found
        return BorrowRequest({
            requestId: 0,
            nftContract: address(0),
            collectionId: 0,
            tokenId: 0,
            borrower: address(0),
            duration: 0,
            loanAmount: 0,
            repayAmount: 0,
            platformFee: 0,
            createdAt: 0,
            isActive: false
        });
    }

    function getBorrowRequestsByUser(address borrower) external view returns (BorrowRequest[] memory) {
        uint256 totalRequests = _offerIds.current();
        uint256 count = 0;

        // First, count the number of borrow requests by the lender
        for (uint256 i = 1; i <= totalRequests; i++) {
            if (borrowRequests[i].borrower == borrower) {
                count++;
            }
        }

        BorrowRequest[] memory requests = new BorrowRequest[](count);
        uint256 index = 0;

        // Then, collect the borrow requests by the lender
        for (uint256 i = 1; i <= totalRequests; i++) {
            if (borrowRequests[i].borrower == borrower) {
                requests[index] = borrowRequests[i];
                index++;
            }
        }

        return requests;
    }

    function getActiveBorrowRequests() external view returns (BorrowRequest[] memory) {
        uint256 totalRequests = _offerIds.current();
        uint256 count = 0;

        // First, count the number of active borrow requests
        for (uint256 i = 1; i <= totalRequests; i++) {
            if (borrowRequests[i].isActive) {
                count++;
            }
        }

        BorrowRequest[] memory activeRequests = new BorrowRequest[](count);
        uint256 index = 0;

        // Then, collect the active borrow requests
        for (uint256 i = 1; i <= totalRequests; i++) {
            if (borrowRequests[i].isActive) {
                activeRequests[index] = borrowRequests[i];
                index++;
            }
        }

        return activeRequests;
    }

    function _getBorrowRequestByTokenId(address nftContract, uint256 tokenId) internal view returns (BorrowRequest memory) {
        for (uint256 i = 1; i <= _offerIds.current(); i++) {
            BorrowRequest storage request = borrowRequests[i];
            if (request.nftContract == nftContract && request.tokenId == tokenId) {
                return request;
            }
        }
        revert("BorrowRequest not found for this tokenId");
    }

    function getBorrowRequest(address nftContract, uint256 tokenId) external view returns (BorrowRequest memory) {
        for (uint256 i = 1; i <= _offerIds.current(); i++) {
            BorrowRequest storage request = borrowRequests[i];
            if (request.nftContract == nftContract && request.tokenId == tokenId) {
                return request;
            }
        }
        revert("BorrowRequest not found for this tokenId");
    }

    function getActiveLoansByBorrower(address borrower) external view returns (Lending[] memory) {
        uint256 totalRequests = _offerIds.current();
        uint256 count = 0;

        // First, count the number of active loans by the borrower
        for (uint256 i = 1; i <= totalRequests; i++) {
            BorrowRequest storage request = borrowRequests[i];
            Lending storage lending = lendings[request.nftContract][request.tokenId];
            if (lending.isActive && lending.borrower == borrower) {
                count++;
            }
        }

        Lending[] memory activeLoans = new Lending[](count);
        uint256 index = 0;

        // Then, collect the active loans by the borrower
        for (uint256 i = 1; i <= totalRequests; i++) {
            BorrowRequest storage request = borrowRequests[i];
            Lending storage lending = lendings[request.nftContract][request.tokenId];
            if (lending.isActive && lending.borrower == borrower) {
                activeLoans[index] = lending;
                index++;
            }
        }

        return activeLoans;
    }

    function getActiveLoansByLender(address lender) external view returns (Lending[] memory) {
        uint256 totalRequests = _offerIds.current();
        uint256 count = 0;

        // First, count the number of active loans by the lender
        for (uint256 i = 1; i <= totalRequests; i++) {
            BorrowRequest storage request = borrowRequests[i];
            Lending storage lending = lendings[request.nftContract][request.tokenId];
            if (lending.isActive && lending.lender == lender) {
                count++;
            }
        }

        Lending[] memory activeLoans = new Lending[](count);
        uint256 index = 0;

        // Then, collect the active loans by the lender
        for (uint256 i = 1; i <= totalRequests; i++) {
            BorrowRequest storage request = borrowRequests[i];
            Lending storage lending = lendings[request.nftContract][request.tokenId];
            if (lending.isActive && lending.lender == lender) {
                activeLoans[index] = lending;
                index++;
            }
        }

        return activeLoans;
    }
}