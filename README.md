# EthData: Decentralized Inventory Management

## Introduction
EthData is a blockchain-based inventory management system designed to address challenges faced by traditional data warehouses, such as inefficiencies, high operational costs, and lack of transparency. By leveraging the Ethereum blockchain, EthData ensures secure, decentralized, and immutable data handling for inventory management. This project is implemented using Solidity, Hardhat, and Ether.js, with a frontend built using React.js and MetaMask for authentication.

## Features
- **Decentralized Data Storage**: All data transactions, from ingestion to retrieval, are securely stored on the blockchain.
- **Immutable Ledger**: Provides auditability and accountability with an unalterable history of transactions.
- **Role-Based Access Control**: Smart contracts define user roles (e.g., vendors, administrators) with specific permissions for secure data handling.
- **Automated Transaction Monitoring**: Unprocessed or delayed requests are flagged and reallocated for reprocessing, ensuring timely data access.
- **MetaMask Integration**: Secure user authentication and transaction management directly from the browser.
- **Real-Time Updates**: Users can view inventory updates and status in real-time.

## Technology Stack
- **Blockchain Platform**: Ethereum
- **Smart Contract Language**: Solidity
- **Development Environment**: Hardhat
- **Frontend Framework**: React.js
- **Blockchain Interaction**: Ether.js
- **User Authentication**: MetaMask

### Prerequisites
- Node.js (LTS version recommended)
- MetaMask browser extension
- Hardhat
- An Ethereum network (local Hardhat node or testnet like Rinkeby)
