import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Warehouse, LayoutDashboard, History, Package, Clock, 
  Truck, CheckCircle2, AlertCircle, Search, Filter, 
  ChevronDown, ArrowRight, ClipboardCheck, Zap, XCircle
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const WarehouseDashboard = () => {
  const { orders, updateOrderStatus, inventory, history, registeredUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const inboundShipments = orders.filter(o => o.status === 'Sent to Warehouse');
  const outboundShipments = orders.filter(o => 
    o.status === 'Instruction to Warehouse' || 
    o.status === 'Product is available and will be shipped soon'
  );

  const stats = [
    { label: 'Total SKU', value: Object.keys(inventory).length, icon: Package, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Inbound Pending', value: inboundShipments.length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Ready for Dispatch', value: outboundShipments.length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Today', value: orders.filter(o => o.status.includes('Warehouse') && o.timestamp > (Date.now()/1000 - 86400)).length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 gap-4 md:gap-8">
        {[
          { id: 'dashboard', label: 'Warehouse Logistics', icon: LayoutDashboard },
          { id: 'inventory', label: 'Inventory Management', icon: Warehouse },
          { id: 'history', label: 'Global Logs', icon: History },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}><s.icon className="w-6 h-6" /></div>
                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p><p className="text-2xl font-black text-gray-900">{s.value}</p></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inbound Logistics */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardCheck className="text-orange-600 w-6 h-6" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Inbound Logistics (Manufacturer &rarr; Warehouse)</h2>
              </div>
              {inboundShipments.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 italic">No incoming shipments from manufacturer.</div>
              ) : (
                inboundShipments.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">Incoming Goods</span>
                        <h3 className="font-mono font-bold text-gray-900 mt-1">{order.id}</h3>
                        <p className="text-sm text-gray-600 font-bold">{order.product} (x{order.quantity})</p>
                      </div>
                      <button onClick={() => updateOrderStatus(order.id, 'Product Received by Warehouse', 'Warehouse Officer')} 
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-100">
                        Verify & Audit <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      <Zap className="w-3 h-3 text-orange-400" /> Source: Assembly Line A
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Outbound Logistics */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="text-blue-600 w-6 h-6" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Outbound Logistics (Dispatch Center)</h2>
              </div>
              {outboundShipments.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 italic">No dispatch instructions from manager or distributor.</div>
              ) : (
                outboundShipments.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border-blue-50 border-2 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                          {order.status.includes('available') ? 'Distributor Instruction' : 'Manager Instruction'}
                        </span>
                        <h3 className="font-mono font-bold text-gray-900 mt-1">{order.id}</h3>
                        <p className="text-sm text-gray-600 font-bold">{order.product} (x{order.quantity})</p>
                      </div>                      <button onClick={() => updateOrderStatus(order.id, 'Sent to Distributor', 'Warehouse Officer')} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-100">
                        Dispatch Now <Truck className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700">Priority: Express Fulfillment</span>
                      <span className="text-[10px] font-mono text-blue-400">Target: Distributor Hub</span>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-8 border-b flex justify-between items-center bg-slate-900 text-white">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Warehouse Inventory Audit</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(inventory).map(([name, qty]) => {
              const isLow = qty < 5;
              const isOut = qty === 0;
              const isOver = qty > 50;
              return (
                <div key={name} className={`p-6 border rounded-3xl transition-all ${isOut ? 'bg-red-50 border-red-200' : isLow ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl shadow-sm ${isOut ? 'bg-white text-red-600' : isLow ? 'bg-white text-orange-600' : 'bg-white text-slate-900'}`}><Package className="w-8 h-8" /></div>
                    <div className="flex flex-col items-end gap-1">
                      {isOut && <span className="text-[9px] font-black px-2 py-1 bg-red-600 text-white rounded uppercase flex items-center gap-1"><XCircle className="w-2 h-2" /> Out of Stock</span>}
                      {isLow && !isOut && <span className="text-[9px] font-black px-2 py-1 bg-orange-500 text-white rounded uppercase flex items-center gap-1"><AlertTriangle className="w-2 h-2" /> Low Stock</span>}
                      {isOver && <span className="text-[9px] font-black px-2 py-1 bg-blue-500 text-white rounded uppercase">Overstock</span>}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{name}</h4>
                  <p className={`text-4xl font-black tracking-tighter mt-4 ${isOut ? 'text-red-700' : 'text-slate-900'}`}>{qty} <span className="text-lg text-slate-400 font-bold uppercase tracking-widest ml-1">Units</span></p>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${isOut ? 'w-0' : isLow ? 'bg-orange-500 w-[15%]' : 'bg-emerald-500 w-[65%]'}`}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <HistoryView history={history} orders={orders} registeredUsers={registeredUsers} userRole="Warehouse" />
        </div>
      )}
    </div>
  );
};

export default WarehouseDashboard;
