// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyLedger is ReentrancyGuard, Ownable {
    enum Status { Pending, Confirmed, Settled, Cancelled }

    struct Transaction {
        address seller;
        address buyer;
        uint256 kWh;
        uint256 price;
        uint256 timestamp;
        Status status;
        bool isEscrowActive;
        uint256 escrowAmount;
    }

    Transaction[] public transactions;
    mapping(uint256 => bool) public escrowDeposits;

    event TransactionAdded(uint256 id, address indexed seller, address indexed buyer, uint256 kWh, uint256 price, Status status);
    event EscrowDeposited(uint256 indexed transactionId, address indexed depositor, uint256 amount);
    event EscrowReleased(uint256 indexed transactionId, address indexed recipient, uint256 amount);
    event EscrowRefunded(uint256 indexed transactionId, address indexed recipient, uint256 amount);

    function addTransaction(address _buyer, uint256 _kWh, uint256 _price) external payable {
        require(msg.value >= _price, "Insufficient escrow amount");
        
        Transaction memory txData = Transaction({
            seller: msg.sender,
            buyer: _buyer,
            kWh: _kWh,
            price: _price,
            timestamp: block.timestamp,
            status: Status.Pending,
            isEscrowActive: true,
            escrowAmount: msg.value
        });

        uint256 transactionId = transactions.length;
        transactions.push(txData);
        escrowDeposits[transactionId] = true;

        emit TransactionAdded(transactionId, msg.sender, _buyer, _kWh, _price, Status.Pending);
        emit EscrowDeposited(transactionId, msg.sender, msg.value);
    }

    function confirmTransaction(uint256 _transactionId) external nonReentrant {
        require(_transactionId < transactions.length, "Invalid transaction ID");
        Transaction storage transaction = transactions[_transactionId];
        require(transaction.status == Status.Pending, "Transaction not pending");
        require(transaction.isEscrowActive, "No escrow active");
        require(msg.sender == transaction.buyer, "Only buyer can confirm");

        transaction.status = Status.Confirmed;
        payable(transaction.seller).transfer(transaction.escrowAmount);
        transaction.isEscrowActive = false;

        emit EscrowReleased(_transactionId, transaction.seller, transaction.escrowAmount);
    }

    function cancelTransaction(uint256 _transactionId) external nonReentrant {
        require(_transactionId < transactions.length, "Invalid transaction ID");
        Transaction storage transaction = transactions[_transactionId];
        require(transaction.status == Status.Pending, "Transaction not pending");
        require(transaction.isEscrowActive, "No escrow active");
        require(msg.sender == transaction.seller || msg.sender == transaction.buyer, "Not authorized");

        transaction.status = Status.Cancelled;
        payable(transaction.seller).transfer(transaction.escrowAmount);
        transaction.isEscrowActive = false;

        emit EscrowRefunded(_transactionId, transaction.seller, transaction.escrowAmount);
    }

    function getTransaction(uint256 _index) public view returns (Transaction memory) {
        return transactions[_index];
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}
