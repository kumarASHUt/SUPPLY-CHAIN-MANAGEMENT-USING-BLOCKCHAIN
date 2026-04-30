import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xA57380c51afAcF63D362BCa81c336401bDa8d68D";

export const STATUS_ENUM = [
  "Retailer Requested",               // 0
  "Forwarded to Manager",              // 1
  "Raw Material Requested",            // 2 (By Manager)
  "Instruction to Warehouse",          // 3 (By Manager)
  "Raw Material Received",             // 4 (By Manufacturer)
  "Manufacturing",                   // 5 (By Manufacturer)
  "Sent to Warehouse",                 // 6 (By Manufacturer)
  "Product Received by Warehouse",      // 7 (By Warehouse Officer)
  "Sent to Distributor",               // 8 (By Warehouse Officer)
  "Product Received by Distributor",    // 9 (By Distributor)
  "Delivered to Retailer",             // 10 (By Distributor)
  "Final Receipt Verified"             // 11 (By Retailer)
];

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "orderId", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "product", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "retailer", "type": "address" }
    ],
    "name": "OrderCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "orderId", "type": "string" },
      { "indexed": false, "internalType": "enum SupplyChain.Status", "name": "status", "type": "uint8" },
      { "indexed": false, "internalType": "address", "name": "actor", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "role", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "StatusUpdated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_orderId", "type": "string" },
      { "internalType": "string", "name": "_product", "type": "string" },
      { "internalType": "uint256", "name": "_quantity", "type": "uint256" },
      { "internalType": "uint256", "name": "_unitPrice", "type": "uint256" }
    ],
    "name": "createOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllOrderIds",
    "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_orderId", "type": "string" }
    ],
    "name": "getOrderHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "orderId", "type": "string" },
          { "internalType": "enum SupplyChain.Status", "name": "status", "type": "uint8" },
          { "internalType": "address", "name": "actor", "type": "address" },
          { "internalType": "string", "name": "role", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct SupplyChain.HistoryEntry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_orderId", "type": "string" },
      { "internalType": "enum SupplyChain.Status", "name": "_newStatus", "type": "uint8" },
      { "internalType": "string", "name": "_role", "type": "string" }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "name": "orders",
    "outputs": [
      { "internalType": "string", "name": "id", "type": "string" },
      { "internalType": "string", "name": "product", "type": "string" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "internalType": "uint256", "name": "unitPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "totalPrice", "type": "uint256" },
      { "internalType": "address", "name": "retailer", "type": "address" },
      { "internalType": "address", "name": "distributor", "type": "address" },
      { "internalType": "address", "name": "manager", "type": "address" },
      { "internalType": "address", "name": "warehouse", "type": "address" },
      { "internalType": "address", "name": "manufacturer", "type": "address" },
      { "internalType": "address", "name": "supplier", "type": "address" },
      { "internalType": "enum SupplyChain.Status", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const getContract = async (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};
