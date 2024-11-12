"use client"
import { useEffect, useState } from "react";
import { getContract } from "../../../utils/contracts";

// Define the Item type to ensure type safety
interface Item {
    itemId: number;
    itemName: string;
    quantity: number;
    price: number;
    description: string;
}

export default function Home() {
    const [inventory, setInventory] = useState<Item[]>([]);
    const [itemName, setItemName] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    // Fetch Inventory on component load
    useEffect(() => {
        fetchInventory();
    }, []);

    // Fetch the inventory from the contract
    const fetchInventory = async () => {
        try {
            const contract = await getContract();
            if (contract) {
                const items: Item[] = await contract.getInventory();
                setInventory(items);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    // Add a new item to the inventory
    const addItem = async () => {
        try {
            const contract = await getContract();
            if (contract) {
                const tx = await contract.addItem(itemName, quantity, price);
                await tx.wait(); // Wait for transaction to be mined
                fetchInventory(); // Refresh inventory list
            }
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <div>
            <h1>Inventory Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={addItem}>Add Item</button>
            </div>
            <h2>Inventory</h2>
            <ul>
                {inventory.map((item: Item) => (
                    <li key={item.itemId}>
                        <strong>{item.itemName}</strong>: {item.quantity} units - ${item.price}
                        <p>{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
