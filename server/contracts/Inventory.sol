// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Inventory {
    // Struct to represent an item
    struct Item {
        uint256 itemId;
        string itemName;
        uint256 quantity;
        uint256 price;
        address vendor;
        bool isVerified;
    }

    // Struct to represent an order
    struct Order {
        uint256 orderId;
        string itemName;
        uint256 quantity;
        uint256 price;
        address manager;
        address vendor;
        bool isAccepted;
        bool isConfirmed;
    }

    uint256 public itemCount = 0;
    uint256 public orderCount = 0;
    
    mapping(uint256 => Item) public items;
    mapping(uint256 => Order) public orders;

    // Role-based mappings
    mapping(address => bool) public isVendor;
    mapping(address => bool) public isManager;
    mapping(address => bool) public hasRegistered;

    // Modifiers
    modifier onlyVendor() {
        require(isVendor[msg.sender], "Not authorized as vendor");
        _;
    }

    modifier onlyManager() {
        require(isManager[msg.sender], "Not authorized as manager");
        _;
    }

    // Self-registration as a vendor
    function registerAsVendor() public {
        require(!hasRegistered[msg.sender], "Already registered");
        isVendor[msg.sender] = true;
        hasRegistered[msg.sender] = true;
    }

    // Self-registration as a manager
    function registerAsManager() public {
        require(!hasRegistered[msg.sender], "Already registered");
        isManager[msg.sender] = true;
        hasRegistered[msg.sender] = true;
    }

    // Manager creates a new order
    function createOrder(
        string memory _itemName,
        uint256 _quantity,
        uint256 _price,
        address _vendor
    ) public onlyManager {
        require(isVendor[_vendor], "Target vendor is not registered");

        orderCount++;
        orders[orderCount] = Order(
            orderCount,
            _itemName,
            _quantity,
            _price,
            msg.sender,
            _vendor,
            false, // Not accepted initially
            false  // Not confirmed initially
        );
    }

    // Vendor accepts an order
    function acceptOrder(uint256 _orderId) public onlyVendor {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid order ID");
        Order storage order = orders[_orderId];
        require(order.vendor == msg.sender, "You are not the assigned vendor");
        require(!order.isAccepted, "Order already accepted");

        order.isAccepted = true;
    }

    // Manager confirms the order and adds it to the inventory
    function confirmOrder(uint256 _orderId) public onlyManager {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid order ID");
        Order storage order = orders[_orderId];
        require(order.manager == msg.sender, "You are not the creator of this order");
        require(order.isAccepted, "Order has not been accepted by the vendor");
        require(!order.isConfirmed, "Order already confirmed");

        // Add the confirmed order as an item in the inventory
        itemCount++;
        items[itemCount] = Item(
            itemCount,
            order.itemName,
            order.quantity,
            order.price,
            order.vendor,
            true // Automatically marked as verified upon confirmation
        );

        order.isConfirmed = true;
    }

    // Fetch all pending orders for a specific vendor
    function getPendingOrdersForVendor() public view onlyVendor returns (Order[] memory) {
        uint256 pendingCount = 0;

        // Calculate the number of pending orders
        for (uint256 i = 1; i <= orderCount; i++) {
            if (orders[i].vendor == msg.sender && !orders[i].isAccepted) {
                pendingCount++;
            }
        }

        Order[] memory pendingOrders = new Order[](pendingCount);
        uint256 index = 0;

        // Populate the list of pending orders
        for (uint256 i = 1; i <= orderCount; i++) {
            if (orders[i].vendor == msg.sender && !orders[i].isAccepted) {
                pendingOrders[index] = orders[i];
                index++;
            }
        }

        return pendingOrders;
    }

    // Fetch all orders created by a manager
    function getOrdersByManager() public view onlyManager returns (Order[] memory) {
        uint256 orderCountByManager = 0;

        // Count orders created by the manager
        for (uint256 i = 1; i <= orderCount; i++) {
            if (orders[i].manager == msg.sender) {
                orderCountByManager++;
            }
        }

        Order[] memory managerOrders = new Order[](orderCountByManager);
        uint256 index = 0;

        // Populate the list of orders by the manager
        for (uint256 i = 1; i <= orderCount; i++) {
            if (orders[i].manager == msg.sender) {
                managerOrders[index] = orders[i];
                index++;
            }
        }

        return managerOrders;
    }

    // Fetch all items in the inventory
    function getInventory() public view returns (Item[] memory) {
        Item[] memory inventory = new Item[](itemCount);
        for (uint256 i = 1; i <= itemCount; i++) {
            inventory[i - 1] = items[i];
        }
        return inventory;
    }
}
