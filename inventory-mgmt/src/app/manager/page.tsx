"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../../../utils/contracts";

const ManagerPage = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [orderList, setOrderList] = useState<any[]>([]);
    const [inventoryList, setInventoryList] = useState<any[]>([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [vendorAddress, setVendorAddress] = useState("");

    useEffect(() => {
        checkRegistration();
    }, []);

    const checkRegistration = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = await getContract();
            const isManager = await contract?.isManager(signer.getAddress());
            console.log(isManager);
            setIsRegistered(isManager);
            fetchOrders();
            fetchInventory(); // Fetch inventory when the component mounts
        } catch (error) {
            console.error("Error checking registration:", error);
        }
    };

    const registerAsManager = async () => {
        try {
            const contract = await getContract();
            const tx = await contract?.registerAsManager();
            await tx.wait();
            alert("Successfully registered as Manager!");
            setIsRegistered(true);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const contract = await getContract();
            const orders = await contract?.getOrdersByManager();
            setOrderList(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchInventory = async () => {
        try {
            const contract = await getContract();
            const inventory = await contract?.getInventory();
            setInventoryList(inventory); // Set the inventory data to state
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const createOrder = async () => {
        if (!itemName || quantity <= 0 || price <= 0 || !vendorAddress) {
            alert("Please fill all fields correctly");
            return;
        }
        try {
            const contract = await getContract();
            const tx = await contract?.createOrder(
                itemName,
                quantity,
                price,
                vendorAddress
            );
            await tx.wait();
            alert("Order created successfully!");
            fetchOrders();
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    const confirmOrder = async (orderId: number) => {
        try {
            const contract = await getContract();
            const tx = await contract?.confirmOrder(orderId);
            await tx.wait();
            alert("Order confirmed successfully!");
            fetchOrders();
        } catch (error) {
            console.error("Error confirming order:", error);
        }
    };

    // Function to determine the CSS class based on order status
    const getOrderStatusClass = (order: any) => {
        if (!order.isAccepted) {
            return "notAccepted"; // Red for not accepted
        }
        if (!order.isConfirmed) {
            return "notConfirmed"; // Yellow for not confirmed
        }
        return "verified"; // Green for verified (completed)
    };

    if (!isRegistered) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Manager Registration</h2>
                <button onClick={registerAsManager}>Register as Manager</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manager Dashboard</h2>

            {/* Create Order Section */}
            <div>
                <input
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <input
                    placeholder="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <input
                    placeholder="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <input
                    placeholder="Vendor Address"
                    value={vendorAddress}
                    onChange={(e) => setVendorAddress(e.target.value)}
                />
                <button onClick={createOrder}>Create Order</button>
            </div>

            {/* Display Order List */}
            <h3>Order List</h3>
            <ul>
                {orderList.length === 0 ? (
                    <p>No orders available.</p>
                ) : (
                    orderList.map((order: any, index: number) => (
                        <li key={index} className={getOrderStatusClass(order)}>
                            <p>
                                <strong>Item:</strong> {order.itemName} |{" "}
                                <strong>Quantity:</strong> {order.quantity} |{" "}
                                <strong>Price:</strong> {order.price}
                            </p>
                            {order.isAccepted && !order.isConfirmed && (
                                <button onClick={() => confirmOrder(order.orderId)}>
                                    Confirm Order
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>

            {/* Display Inventory List */}
            <h3>Inventory</h3>
            <ul>
                {inventoryList.length === 0 ? (
                    <p>No items in the inventory.</p>
                ) : (
                    inventoryList.map((item: any, index: number) => (
                        <li
                            key={index}
                            style={{ padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
                        >
                            <p>
                                <strong>Item:</strong> {item.itemName} |{" "}
                                <strong>Quantity:</strong> {item.quantity} |{" "}
                                <strong>Price:</strong> {item.price} |{" "}
                                <strong>Vendor:</strong> {item.vendor}
                            </p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ManagerPage;
