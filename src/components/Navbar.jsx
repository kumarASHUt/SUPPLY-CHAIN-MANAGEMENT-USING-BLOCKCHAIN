import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Box, LogOut, User, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout, account, connectWallet, isWalletConnecting } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const truncatedAccount = account 
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
        <Box className="w-8 h-8" />
        <span>ChainVerify</span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Wallet Connection Button */}
        <button
          onClick={connectWallet}
          disabled={isWalletConnecting || account}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            account 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95'
          }`}
        >
          <Wallet className="w-4 h-4" />
          {isWalletConnecting ? 'Connecting...' : account ? truncatedAccount : 'Connect Wallet'}
        </button>

        {user ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
              <User className="w-4 h-4" />
              <span>{user.role}: {user.id}</span>
            </div>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Dashboard</Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
