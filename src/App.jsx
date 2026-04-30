import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import WarehouseDashboard from './pages/WarehouseDashboard';

const DashboardLayout = () => {
  const { user } = useAppContext();
  
  const renderDashboard = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Supplier':
        return <SupplierDashboard />;
      case 'Manufacturer':
        return <ManufacturerDashboard />;
      case 'Distributor':
        return <DistributorDashboard />;
      case 'Retailer':
        return <RetailerDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'Warehouse':
        return <WarehouseDashboard />;
      default:
        return <div>Access Denied</div>;
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user.role} Control Center</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Secure Blockchain Interface Active</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Network Status</p>
            <p className="text-sm font-bold text-green-500 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Synchronized
            </p>
          </div>
        </div>
      </div>
      {renderDashboard()}
    </div>
  );
};

const App = () => {
  const { user } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard/*" element={user ? <DashboardLayout /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
