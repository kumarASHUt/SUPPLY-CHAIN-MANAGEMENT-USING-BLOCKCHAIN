// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum Status { 
        RetailerRequested,               // 0
        ForwardedToManager,              // 1
        ProductAvailableAndShippingSoon, // 2
        RawMaterialRequested,            // 3 (By Manager)
        InstructionToWarehouse,          // 4 (By Manager)
        RawMaterialReceived,             // 5 (By Manufacturer)
        Manufacturing,                   // 6 (By Manufacturer)
        SentToWarehouse,                 // 7 (By Manufacturer)
        ProductReceivedByWarehouse,      // 8 (By Warehouse Officer)
        SentToDistributor,               // 9 (By Warehouse Officer)
        ProductReceivedByDistributor,    // 10 (By Distributor)
        DeliveredToRetailer,             // 11 (By Distributor)
        FinalReceiptVerified             // 12 (By Retailer)
    }

    struct Order {
        string id;
        string product;
        uint256 quantity;
        uint256 unitPrice;
        uint256 totalPrice;
        address retailer;
        address distributor;
        address manager;
        address warehouse;
        address manufacturer;
        address supplier;
        Status status;
        uint256 timestamp;
        bool exists;
    }

    struct HistoryEntry {
        string orderId;
        Status status;
        address actor;
        string role;
        uint256 timestamp;
    }

    mapping(string => Order) public orders;
    mapping(string => HistoryEntry[]) public orderHistory;
    string[] public orderIds;

    event OrderCreated(string orderId, string product, uint256 quantity, address retailer);
    event StatusUpdated(string orderId, Status status, address actor, string role, uint256 timestamp);

    modifier orderExists(string memory _orderId) {
        require(orders[_orderId].exists, "Order does not exist");
        _;
    }

    function createOrder(
        string memory _orderId, 
        string memory _product, 
        uint256 _quantity, 
        uint256 _unitPrice
    ) public {
        require(!orders[_orderId].exists, "Order ID already exists");
        
        orders[_orderId] = Order({
            id: _orderId,
            product: _product,
            quantity: _quantity,
            unitPrice: _unitPrice,
            totalPrice: _unitPrice * _quantity,
            retailer: msg.sender,
            distributor: address(0),
            manager: address(0),
            warehouse: address(0),
            manufacturer: address(0),
            supplier: address(0),
            status: Status.RetailerRequested,
            timestamp: block.timestamp,
            exists: true
        });

        orderIds.push(_orderId);
        
        _updateHistory(_orderId, Status.RetailerRequested, "Retailer");
        emit OrderCreated(_orderId, _product, _quantity, msg.sender);
    }

    function updateStatus(string memory _orderId, Status _newStatus, string memory _role) 
        public 
        orderExists(_orderId) 
    {
        Order storage order = orders[_orderId];
        order.status = _newStatus;
        
        // Assign roles based on who interacts
        if (_newStatus == Status.ForwardedToManager || _newStatus == Status.ProductAvailableAndShippingSoon) order.distributor = msg.sender;
        if (_newStatus == Status.RawMaterialRequested || _newStatus == Status.InstructionToWarehouse) order.manager = msg.sender;
        if (_newStatus == Status.RawMaterialReceived) order.supplier = msg.sender;
        if (_newStatus == Status.Manufacturing) order.manufacturer = msg.sender;
        if (_newStatus == Status.ProductReceivedByWarehouse || _newStatus == Status.SentToDistributor) order.warehouse = msg.sender;
        if (_newStatus == Status.ProductReceivedByDistributor) order.distributor = msg.sender;

        _updateHistory(_orderId, _newStatus, _role);
    }

    function _updateHistory(string memory _orderId, Status _status, string memory _role) internal {
        HistoryEntry memory entry = HistoryEntry({
            orderId: _orderId,
            status: _status,
            actor: msg.sender,
            role: _role,
            timestamp: block.timestamp
        });
        
        orderHistory[_orderId].push(entry);
        emit StatusUpdated(_orderId, _status, msg.sender, _role, block.timestamp);
    }

    function getOrderHistory(string memory _orderId) public view returns (HistoryEntry[] memory) {
        return orderHistory[_orderId];
    }

    function getAllOrderIds() public view returns (string[] memory) {
        return orderIds;
    }
}
