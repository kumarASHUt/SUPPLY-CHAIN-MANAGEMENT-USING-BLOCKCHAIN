import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, History, Package, AlertTriangle, CheckCircle2, 
  Clock, ArrowRight, ShieldCheck, Warehouse, Factory, Search,
  TrendingUp, TrendingDown, Bell, Zap, 
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const ManagerDashboard = () => {
  const { orders, updateOrderStatus, inventory, history, registeredUsers, products } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const incomingDemands = orders.filter(o => o.status === 'Forwarded to Manager');
  const activeProduction = orders.filter(o => ['Raw Material Requested', 'Raw Material Received', 'Manufacturing'].includes(o.status));
  
  const lowStockItems = Object.entries(inventory).filter(([name, qty]) => qty < 5);
  const overstockItems = Object.entries(inventory).filter(([name, qty]) => qty > 50);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Decisions', value: incomingDemands.length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'In Production', value: activeProduction.length, icon: Factory, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', value: orders.filter(o => o.status === 'Final Receipt Verified').length, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 gap-4 md:gap-8">
        {[
          { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
          { id: 'inventory', label: 'Inventory Audit', icon: Warehouse },
          { id: 'history', label: 'Global History', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-bold transition-all ${
              activeTab === tab.id 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Top Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}><s.icon className="w-6 h-6" /></div>
                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p><p className="text-2xl font-black text-gray-900">{s.value}</p></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Orders & Demand Decision Section */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><TrendingUp className="text-blue-600 w-6 h-6" /><h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Demand Orchestration</h2></div>
              </div>
              {incomingDemands.length === 0 ? (
                <div className="bg-white py-16 rounded-3xl border border-dashed border-gray-200 text-center">
                  <Zap className="w-12 h-12 mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">No pending demands requiring instructions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {incomingDemands.map(order => {
                    const isAvailable = (inventory[order.product] || 0) >= order.quantity;
                    return (
                      <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {isAvailable ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Order ID: {order.id}</span>
                          </div>
                          <h4 className="text-xl font-black text-gray-900">{order.product} <span className="text-blue-600">x{order.quantity}</span></h4>
                          <p className="text-sm text-gray-500 mt-1 font-medium">Warehouse Level: {inventory[order.product] || 0} units</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            {isAvailable ? (
                              <button onClick={() => {
                                if(window.confirm("Confirm instruction to Warehouse for immediate dispatch?")) 
                                  updateOrderStatus(order.id, 'Instruction to Warehouse', 'Manager')
                              }}
                                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all">
                                Instruct Warehouse <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button onClick={() => {
                                if(window.confirm("Inventory unavailable. Confirm raw material request to Supplier?"))
                                  updateOrderStatus(order.id, 'Raw Material Requested', 'Manager')
                              }}
                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                Instruct Supplier <ShieldCheck className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Demand Forecast Mock Graph */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <TrendingUp className="text-emerald-500 w-5 h-5" /> Demand Forecast (7-Day Projection)
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12.4% vs Last Week</span>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {[45, 62, 38, 85, 54, 72, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div 
                        className="w-full bg-slate-100 rounded-t-lg transition-all duration-500 group-hover:bg-blue-500 relative"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">Day {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div className="space-y-6">
              <div className="flex items-center gap-3"><Bell className="text-red-500 w-6 h-6" /><h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Critical Alerts</h2></div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {lowStockItems.map(([name, qty]) => (
                  <div key={name} className="p-5 flex items-start gap-4 hover:bg-red-50 transition-colors">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Low Stock Alert: {name}</p>
                      <p className="text-xs text-gray-500 mt-1">Current level: {qty} units. Production may be required soon.</p>
                    </div>
                  </div>
                ))}
                {overstockItems.map(([name, qty]) => (
                  <div key={name} className="p-5 flex items-start gap-4 hover:bg-orange-50 transition-colors">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Overstock Alert: {name}</p>
                      <p className="text-xs text-gray-500 mt-1">{qty} units in warehouse. Consider slowing production.</p>
                    </div>
                  </div>
                ))}
                {lowStockItems.length === 0 && overstockItems.length === 0 && (
                  <div className="p-12 text-center text-gray-400 italic text-sm">All inventory levels within normal parameters.</div>
                )}
              </div>
              
              <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                <h4 className="font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> Production Pulse</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs"><span>Manufacturing Efficiency</span><span className="font-mono text-blue-400">94.2%</span></div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[94%]"></div></div>
                  <div className="flex justify-between items-center text-xs"><span>Delivery Reliability</span><span className="font-mono text-emerald-400">99.1%</span></div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[99%]"></div></div>
                </div>
              </div>
            </div>
          </div>
        
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-8 border-b flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Live Inventory Audit</h3>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
              <Printer className="w-4 h-4" /> Export Report
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8 gap-6">
            {Object.entries(inventory).map(([name, qty]) => (
              <div key={name} className="p-6 border rounded-3xl bg-slate-50 hover:border-slate-300 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm"><Package className="w-8 h-8 text-slate-900" /></div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${qty < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {qty < 10 ? 'Restock Soon' : 'Healthy'}
                  </span>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{name}</h4>
                <p className="text-4xl font-black text-slate-900 tracking-tighter mt-4">{qty} <span className="text-lg text-slate-400 font-bold uppercase tracking-widest ml-1">Units</span></p>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Warehouse A (Main)</span>
                    <span>{qty} Units</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <HistoryView history={history} orders={orders} registeredUsers={registeredUsers} userRole="Manager" />
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
