import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  ShoppingCart, Package, Clock, CheckCircle2, ArrowRight, 
  Info, CreditCard, History, LayoutDashboard, Search, 
  ChevronDown, Store, Factory, ShieldCheck, Truck, Plus 
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const RetailerDashboard = () => {
  const { user, products, orders, createOrder, updateOrderStatus, history, registeredUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedDistributorId, setSelectedDistributorId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const myOrders = orders.filter(o => o.retailerId.toLowerCase() === user.id.toLowerCase());
  const selectedProduct = products.find(p => p.name === selectedProductName);
  const totalPrice = selectedProduct ? selectedProduct.price * (parseInt(quantity) || 0) : 0;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedProductName || quantity < 1 || !selectedDistributorId) {
      alert("Please fill all fields!");
      return;
    }
    // Note: the original createOrder only took (productName, retailerId, quantity)
    // I should ideally pass the distributorId too if the contract supports it.
    // Since the current createOrder doesn't, I'll stick to it but maybe update the role assignment logic.
    createOrder(selectedProductName, user.id, quantity);
    setSelectedProductName('');
    setSelectedDistributorId('');
    setQuantity(1);
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-8">
        {[
          { id: 'dashboard', label: 'Order Center', icon: LayoutDashboard },
          { id: 'history', label: 'System History', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-bold transition-all ${
              activeTab === tab.id 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* New Inventory Request */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="text-purple-600 w-6 h-6" />
              <h2 className="text-xl font-bold">New Inventory Request</h2>
            </div>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Select Product</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
                    value={selectedProductName}
                    onChange={(e) => setSelectedProductName(e.target.value)}
                    required
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Nearby Distributor</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
                    value={selectedDistributorId}
                    onChange={(e) => setSelectedDistributorId(e.target.value)}
                    required
                  >
                    <option value="">Select Distributor...</option>
                    {registeredUsers.filter(u => u.role === 'Distributor').map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.address})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase">Quantity</label>
                  <input type="number" min="1" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              {selectedProduct && (
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><CreditCard className="text-purple-600 w-6 h-6" /></div>
                    <div>
                      <p className="text-xs font-bold text-purple-400 uppercase">Pricing Breakdown</p>
                      <p className="text-lg font-medium text-gray-700">₹{selectedProduct.price} <span className="text-sm text-gray-400">per unit</span></p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xs font-bold text-purple-400 uppercase">Net Total Price</p>
                    <p className="text-3xl font-extrabold text-purple-700">₹{totalPrice.toLocaleString()}</p>
                  </div>
                  <button type="submit" className="w-full md:w-auto px-10 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
                    Place Order <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Manage Active Requests */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Plus className="text-purple-600 w-6 h-6" />
              <h2 className="text-xl font-bold">Manage Active Requests</h2>
            </div>
            {myOrders.filter(o => o.status !== 'Final Receipt Verified').length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center text-gray-400 italic">No active orders.</div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myOrders.filter(o => o.status !== 'Final Receipt Verified').map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-l-4 border-purple-600 p-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase">Tracking ID</span>
                      <h4 className="font-mono font-bold text-gray-900">{order.id}</h4>
                      <p className="text-sm text-gray-600">{order.product} (x{order.quantity})</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                      <p className="text-sm font-extrabold text-purple-700 uppercase">{order.status}</p>
                    </div>
                    {order.status === 'Delivered to Retailer' && (
                      <button onClick={() => updateOrderStatus(order.id, 'Final Receipt Verified', 'Retailer')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all active:scale-95">
                        Verify Receipt
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HistoryView history={history} orders={myOrders} registeredUsers={registeredUsers} userRole="Retailer" />
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;
