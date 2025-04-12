// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyTrading is ReentrancyGuard, Ownable {
    enum TradeStatus { Pending, Confirmed, Completed, Cancelled }

    struct Trade {
        address homeowner;
        address factory;
        uint256 energyAmount; // in kWh
        uint256 price; // in wei
        uint256 timestamp;
        TradeStatus status;
        bool isEscrowActive;
        uint256 escrowAmount;
        uint256 carbonCredits;
    }

    Trade[] public trades;
    mapping(uint256 => bool) public escrowDeposits;
    mapping(address => uint256) public carbonCredits;

    event TradeCreated(uint256 id, address indexed homeowner, address indexed factory, uint256 energyAmount, uint256 price);
    event TradeConfirmed(uint256 id, address indexed factory);
    event TradeCompleted(uint256 id, address indexed homeowner, address indexed factory);
    event TradeCancelled(uint256 id, address indexed homeowner);
    event CarbonCreditsAwarded(address indexed homeowner, uint256 amount);

    function createTrade(
        address _factory,
        uint256 _energyAmount,
        uint256 _price,
        uint256 _carbonCredits
    ) external payable {
        require(msg.value >= _price, "Insufficient escrow amount");
        require(_factory != address(0), "Invalid factory address");
        require(_energyAmount > 0, "Invalid energy amount");
        require(_price > 0, "Invalid price");

        Trade memory newTrade = Trade({
            homeowner: msg.sender,
            factory: _factory,
            energyAmount: _energyAmount,
            price: _price,
            timestamp: block.timestamp,
            status: TradeStatus.Pending,
            isEscrowActive: true,
            escrowAmount: msg.value,
            carbonCredits: _carbonCredits
        });

        uint256 tradeId = trades.length;
        trades.push(newTrade);
        escrowDeposits[tradeId] = true;

        emit TradeCreated(tradeId, msg.sender, _factory, _energyAmount, _price);
    }

    function confirmTrade(uint256 _tradeId) external nonReentrant {
        require(_tradeId < trades.length, "Invalid trade ID");
        Trade storage trade = trades[_tradeId];
        require(trade.status == TradeStatus.Pending, "Trade not pending");
        require(trade.isEscrowActive, "No escrow active");
        require(msg.sender == trade.factory, "Only factory can confirm");

        trade.status = TradeStatus.Confirmed;
        emit TradeConfirmed(_tradeId, msg.sender);
    }

    function completeTrade(uint256 _tradeId) external nonReentrant {
        require(_tradeId < trades.length, "Invalid trade ID");
        Trade storage trade = trades[_tradeId];
        require(trade.status == TradeStatus.Confirmed, "Trade not confirmed");
        require(trade.isEscrowActive, "No escrow active");
        require(msg.sender == trade.homeowner, "Only homeowner can complete");

        trade.status = TradeStatus.Completed;
        trade.isEscrowActive = false;
        
        // Transfer funds to factory
        payable(trade.factory).transfer(trade.escrowAmount);
        
        // Award carbon credits to homeowner
        carbonCredits[trade.homeowner] += trade.carbonCredits;
        
        emit TradeCompleted(_tradeId, trade.homeowner, trade.factory);
        emit CarbonCreditsAwarded(trade.homeowner, trade.carbonCredits);
    }

    function cancelTrade(uint256 _tradeId) external nonReentrant {
        require(_tradeId < trades.length, "Invalid trade ID");
        Trade storage trade = trades[_tradeId];
        require(trade.status == TradeStatus.Pending, "Trade not pending");
        require(trade.isEscrowActive, "No escrow active");
        require(msg.sender == trade.homeowner, "Only homeowner can cancel");

        trade.status = TradeStatus.Cancelled;
        trade.isEscrowActive = false;
        
        // Refund escrow to homeowner
        payable(trade.homeowner).transfer(trade.escrowAmount);
        
        emit TradeCancelled(_tradeId, trade.homeowner);
    }

    function getTrade(uint256 _tradeId) external view returns (Trade memory) {
        return trades[_tradeId];
    }

    function getCarbonCredits(address _address) external view returns (uint256) {
        return carbonCredits[_address];
    }
} 