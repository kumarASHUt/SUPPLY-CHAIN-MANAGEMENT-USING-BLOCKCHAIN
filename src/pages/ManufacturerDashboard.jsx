import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Factory, Component, Play, Send, CheckCircle2, AlertCircle, Clock, 
  History, LayoutDashboard, Search, Package, ChevronDown, List, Beaker
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const ManufacturerDashboard = () => {
  const { orders, updateOrderStatus, bom, history, registeredUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const productionQueue = orders.filter(o => 
    ['Raw Material Requested', 'Raw Material Received', 'Manufacturing'].includes(o.status)
  );

  const getMaterialsForProduct = (productName, quantity) => {
    const item = bom.find(b => b.product === productName);
    if (!item) return [];
    return item.materials.map(m => {
      const qtyVal = parseFloat(m.qty) || 1;
      const unit = m.qty.replace(/[0-9.]/g, '');
      return { name: m.name, totalQty: `${qtyVal * quantity}${unit}` };
    });
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 gap-4 md:gap-8">
        {[
          { id: 'dashboard', label: 'Production Line', icon: LayoutDashboard },
          { id: 'raw-materials', label: 'Raw Material Logs', icon: List },
          { id: 'history', label: 'System History', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-bold transition-all ${
              activeTab === tab.id 
                ? 'border-emerald-600 text-emerald-600' 
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
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Factory className="text-emerald-600 w-6 h-6" />
                <h2 className="text-xl font-bold">Active Manufacturing Queue</h2>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">{productionQueue.length} Active Jobs</span>
            </div>

            {productionQueue.length === 0 ? (
              <div className="bg-white py-20 rounded-2xl border border-dashed border-gray-200 text-center">
                <Component className="w-12 h-12 mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium italic">No manufacturing tasks assigned.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {productionQueue.map(order => {
                  const materials = getMaterialsForProduct(order.product, order.quantity);
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-l-4 border-emerald-500">
                      <div className="p-6 flex flex-col lg:grid lg:grid-cols-3 gap-8">
                        <div className="col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Order Ref: {order.id}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">• {order.requestedAt}</span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-6">{order.product} <span className="text-emerald-500">x{order.quantity} Units</span></h3>
                          
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
                              <Beaker className="w-3 h-3" /> Automated Bill of Materials (BoM) Request
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {materials.map((m, i) => (
                                <div key={i} className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                                  order.status === 'Raw Material Received' || order.status === 'Manufacturing' 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                    : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                  <span className="text-[9px] font-bold uppercase opacity-60">{m.name}</span>
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold">{m.totalQty}</span>
                                    {order.status === 'Raw Material Received' || order.status === 'Manufacturing' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 opacity-30" />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                          <div>
                            <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-tighter">Current Production Phase</span>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${order.status === 'Manufacturing' ? 'bg-blue-500 animate-ping' : 'bg-emerald-500'}`}></div>
                              <span className="text-lg font-black text-gray-900 uppercase">{order.status}</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-200 mt-2 space-y-3">
                            {order.status === 'Raw Material Requested' && (
                              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-700">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-xs font-bold leading-tight">Materials pending fulfillment from Supplier dashboard.</p>
                              </div>
                            )}
                            {order.status === 'Raw Material Received' && (
                              <button onClick={() => updateOrderStatus(order.id, 'Manufacturing', 'Manufacturer')} 
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95">
                                <Play className="w-5 h-5 fill-current" /> Start Assembly Line
                              </button>
                            )}
                            {order.status === 'Manufacturing' && (
                              <button onClick={() => updateOrderStatus(order.id, 'Sent to Warehouse', 'Manufacturer')} 
                                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95">
                                <Send className="w-5 h-5" /> Complete & Send to Warehouse
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'raw-materials' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
            <h3 className="text-xl font-bold">Raw Material Acquisition Logs</h3>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest">Read-Only Audit Trail</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Material Name</th>
                  <th className="px-6 py-4">Required Qty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Supplier Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => {
                  const m = getMaterialsForProduct(o.product, o.quantity);
                  return m.map((item, i) => (
                    <tr key={`${o.id}-${i}`} className="hover:bg-slate-50 transition-colors">
                      {i === 0 && <td className="px-6 py-4 font-mono font-bold text-slate-900 border-r" rowSpan={m.length}>{o.id}</td>}
                      <td className="px-6 py-4 font-medium text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 font-mono text-gray-500">{item.totalQty}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                          ['Raw Material Received', 'Manufacturing', 'Sent to Warehouse', 'Product Received by Warehouse', 'Sent to Distributor', 'Product Received by Distributor', 'Delivered to Retailer', 'Final Receipt Verified'].includes(o.status) 
                            ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {['Raw Material Received', 'Manufacturing', 'Sent to Warehouse', 'Product Received by Warehouse', 'Sent to Distributor', 'Product Received by Distributor', 'Delivered to Retailer', 'Final Receipt Verified'].includes(o.status) ? 'Recieved' : 'Requested'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${['Raw Material Received', 'Manufacturing', 'Sent to Warehouse', 'Product Received by Warehouse', 'Sent to Distributor', 'Product Received by Distributor', 'Delivered to Retailer', 'Final Receipt Verified'].includes(o.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-[10px] font-mono text-gray-400">Verified Hash: 0x{Math.random().toString(16).substr(2, 8)}...</span>
                        </div>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HistoryView history={history} orders={orders} registeredUsers={registeredUsers} userRole="Manufacturer" />
        </div>
      )}
    </div>
  );
};

export default ManufacturerDashboard;
