// app/vendor/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../../../utils/contracts";

const VendorPage = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);

    useEffect(() => {
        checkRegistration();
    }, []);

    

    const checkRegistration = async () => {
        try {
            // Set up provider and contract
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            // console.log(signer);
            
            const contract = await getContract();
            const isVendor = await contract?.isVendor(signer.getAddress());
            console.log(`isVendor: ${isVendor}`);

            // const inventory = await contract?.getInventory();
            // console.log(inventory);
            


            

            setIsRegistered(isVendor);
            fetchPendingOrders();
        } catch (error) {
            console.error("Error checking registration:", error);
        }
    };

    const registerAsVendor = async () => {
        try {
            const contract = await getContract();
            const tx = await contract.registerAsVendor();
            await tx.wait();
            alert("Successfully registered as Vendor!");
            setIsRegistered(true);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const fetchPendingOrders = async () => {
        try {
            const contract = await getContract();
            const orders = await contract.getPendingOrdersForVendor();
            setPendingOrders(orders);
        } catch (error) {
            console.error("Error fetching pending orders:", error);
        }
    };

    const acceptOrder = async (orderId: number) => {
        try {
            const contract = await getContract();
            const tx = await contract.acceptOrder(orderId);
            await tx.wait();
            alert("Order accepted successfully!");
            fetchPendingOrders();
        } catch (error) {
            console.error("Error accepting order:", error);
        }
    };

    if (!isRegistered) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Vendor Registration</h2>
                <button onClick={registerAsVendor}>Register as Vendor</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Vendor Dashboard</h2>
            <button onClick={fetchPendingOrders}>Refresh Pending Orders</button>
            <ul>
                {pendingOrders.length === 0 ? (
                    <p>No pending orders available.</p>
                ) : (
                    pendingOrders.map((order: any, index: number) => (
                        <li key={index}>
                            <p>
                                <strong>Item:</strong> {order.itemName} |{" "}
                                <strong>Quantity:</strong> {order.quantity} |{" "}
                                <strong>Price:</strong> {order.price}
                            </p>
                            <button onClick={() => acceptOrder(order.orderId)}>
                                Accept Order
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default VendorPage;
