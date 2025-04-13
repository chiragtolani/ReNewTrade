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
    mapping(address => uint256) public balances;

    event TransactionAdded(uint256 id, address indexed seller, address indexed buyer, uint256 kWh, uint256 price, Status status);
    event PaymentReceived(address indexed from, address indexed to, uint256 amount);

    function addTransaction(address _buyer, uint256 _kWh, uint256 _price, Status _status) external payable {
        require(msg.value == _price, "Payment amount must match the price");
        require(_buyer != address(0), "Invalid buyer address");
        
        // Create the transaction record
        Transaction memory txData = Transaction({
            seller: msg.sender,
            buyer: _buyer,
            kWh: _kWh,
            price: _price,
            timestamp: block.timestamp,
            status: _status
        });

        // Forward the ETH to the buyer immediately
        (bool success, ) = payable(_buyer).call{value: msg.value}("");
        require(success, "ETH transfer to buyer failed");

        // Store the transaction record
        transactions.push(txData);
        
        emit TransactionAdded(transactions.length - 1, msg.sender, _buyer, _kWh, _price, _status);
        emit PaymentReceived(msg.sender, _buyer, msg.value);
    }

    function getTransaction(uint256 index) public view returns (Transaction memory) {
        require(index < transactions.length, "Transaction does not exist");
        return transactions[index];
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        balances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    // Allow the contract to receive ETH
    receive() external payable {}
}
