import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect() {
    const [currentAccount, setCurrentAccount] = useState("");

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            try {
                const accounts = await provider.send("eth_requestAccounts", []);
                setCurrentAccount(accounts[0]);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask is not installed!");
        }
    };

    return (
        <button onClick={connectWallet}>
            {currentAccount ? `Connected: ${currentAccount}` : "Connect Wallet"}
        </button>
    );
}
