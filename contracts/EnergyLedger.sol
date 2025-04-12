// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EnergyLedger {
    enum Status { Pending, Confirmed, Settled }

    struct Transaction {
        address seller;
        address buyer;
        uint256 kWh;
        uint256 price;
        uint256 timestamp;
        Status status;
    }

    Transaction[] public transactions;

    event TransactionAdded(uint256 id, address indexed seller, address indexed buyer, uint256 kWh, uint256 price, Status status);

    function addTransaction(address _buyer, uint256 _kWh, uint256 _price, Status _status) external {
        Transaction memory txData = Transaction({
            seller: msg.sender,
            buyer: _buyer,
            kWh: _kWh,
            price: _price,
            timestamp: block.timestamp,
            status: _status
        });

        transactions.push(txData);
        emit TransactionAdded(transactions.length - 1, msg.sender, _buyer, _kWh, _price, _status);
    }

    function getTransaction(uint256 index) public view returns (Transaction memory) {
        return transactions[index];
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}
