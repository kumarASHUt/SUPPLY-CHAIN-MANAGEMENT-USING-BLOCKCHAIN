import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, STATUS_ENUM, getContract } from '../utils/contract';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'admin', role: 'Admin', pass: 'admin123', name: 'System Admin', address: 'Main Office', phone: '000-000' },
    { id: 'supplier', role: 'Supplier', pass: 'supply123', name: 'Global Materials Co', address: 'Industrial Zone', phone: '111-222' },
    { id: 'manufacturer', role: 'Manufacturer', pass: 'manu123', name: 'Mega Factory', address: 'Assembly Line A', phone: '333-444' },
    { id: 'distributor', role: 'Distributor', pass: 'dist123', name: 'Quick Ship Ltd', address: 'Warehouse 5', phone: '555-666' },
    { id: 'retailer', role: 'Retailer', pass: 'retail123', name: 'Corner Store', address: 'Market St 12', phone: '777-888' },
    { id: 'manager', role: 'Manager', pass: 'manage123', name: 'Global Manager', address: 'HQ', phone: '999-999' },
    { id: 'warehouse', role: 'Warehouse', pass: 'ware123', name: 'Central Warehouse', address: 'Logistics Hub', phone: '888-888' }
  ]);

  const [inventory, setInventory] = useState({
    'Smartphone': 12,
    'Packet of Biscuits': 45
  });

  const [products, setProducts] = useState([
    { 
      id: 'p1', 
      name: 'Smartphone', 
      price: 15000, 
      bom: [
        { material: 'Battery', qty: '1 unit' }, 
        { material: 'Screen', qty: '1 unit' }, 
        { material: 'Processor', qty: '1 unit' }
      ] 
    },
    { 
      id: 'p2', 
      name: 'Packet of Biscuits', 
      price: 20, 
      bom: [
        { material: 'Sugar', qty: '5g' }, 
        { material: 'Besan', qty: '10g' }, 
        { material: 'Water', qty: '10ml' }
      ] 
    }
  ]);

  // Connect Wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    try {
      setIsWalletConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
      
      console.log("Connected to wallet:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsWalletConnecting(false);
    }
  };

  // Sync data from Blockchain
  const syncBlockchainData = useCallback(async () => {
    if (!contract) return;

    try {
      const orderIds = await contract.getAllOrderIds();
      const fetchedOrders = [];
      const fetchedHistory = [];

      for (const id of orderIds) {
        const orderData = await contract.orders(id);
        const orderHistory = await contract.getOrderHistory(id);

        fetchedOrders.push({
          id: orderData.id,
          product: orderData.product,
          quantity: Number(orderData.quantity),
          unitPrice: Number(orderData.unitPrice),
          totalPrice: Number(orderData.totalPrice),
          retailerId: orderData.retailer,
          distributorId: orderData.distributor,
          managerId: orderData.manager,
          warehouseId: orderData.warehouse,
          manufacturerId: orderData.manufacturer,
          supplierId: orderData.supplier,
          status: STATUS_ENUM[Number(orderData.status)],
          requestedAt: new Date(Number(orderData.timestamp) * 1000).toLocaleString(),
          steps: orderHistory.map(h => STATUS_ENUM[Number(h.status)])
        });

        orderHistory.forEach(h => {
          fetchedHistory.push({
            id: `HIST-${id}-${h.timestamp}`,
            orderId: id,
            action: STATUS_ENUM[Number(h.status)],
            role: h.role,
            actor: h.actor,
            timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString()
          });
        });
      }

      setOrders(fetchedOrders);
      setHistory(fetchedHistory.reverse());
    } catch (error) {
      console.error("Error syncing blockchain data:", error);
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      syncBlockchainData();
    }
  }, [contract, syncBlockchainData]);

  const login = (id, pass) => {
    const normalizedId = id.toLowerCase();
    const foundUser = registeredUsers.find(u => u.id.toLowerCase() === normalizedId && u.pass === pass);
    if (foundUser) {
      setUser({ id: foundUser.id, role: foundUser.role, name: foundUser.name });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setAccount(null);
    setContract(null);
  };

  const registerUser = (newUser) => {
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const createOrder = async (productName, retailerId, quantity) => {
    if (!contract) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const product = products.find(p => p.name === productName);
      const qty = parseInt(quantity) || 1;
      const unitPrice = product ? product.price : 0;
      const orderId = `ORD-${Math.random().toString(36).toUpperCase().substr(2, 6)}`;

      const tx = await contract.createOrder(orderId, productName, qty, unitPrice);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Order created on blockchain!");
      
      await syncBlockchainData();
    } catch (error) {
      console.error("Error creating order on blockchain:", error);
      alert("Failed to create order on blockchain.");
    }
  };

  const updateOrderStatus = async (orderId, statusName, role) => {
    if (!contract) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const statusIndex = STATUS_ENUM.indexOf(statusName);
      if (statusIndex === -1) throw new Error("Invalid status name");

      const tx = await contract.updateStatus(orderId, statusIndex, role);
      console.log("Updating status transaction sent:", tx.hash);
      await tx.wait();
      console.log("Status updated on blockchain!");

      // Mock inventory adjustment if needed
      if (statusName === 'Product Received by Warehouse') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          setInventory(prev => ({
            ...prev,
            [order.product]: (prev[order.product] || 0) + order.quantity
          }));
        }
      }
      if (statusName === 'Delivered to Retailer') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          setInventory(prev => ({
            ...prev,
            [order.product]: Math.max(0, (prev[order.product] || 0) - order.quantity)
          }));
        }
      }

      await syncBlockchainData();
    } catch (error) {
      console.error("Error updating status on blockchain:", error);
      alert("Failed to update status on blockchain.");
    }
  };

  const bom = products.map(p => ({
    id: p.id,
    product: p.name,
    materials: p.bom.map(m => ({ name: m.material, qty: m.qty }))
  }));

  return (
    <AppContext.Provider value={{
      user, login, logout, registerUser,
      orders, createOrder, updateOrderStatus,
      history, products, setProducts,
      registeredUsers, inventory, setInventory,
      bom,
      account, connectWallet, isWalletConnecting
    }}>
      {children}
    </AppContext.Provider>
  );
};
