import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  ShieldCheck, Box, Send, CheckCircle2, Clock, Truck, 
  History, LayoutDashboard, Search, Package, ChevronDown 
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const SupplierDashboard = () => {
  const { orders, updateOrderStatus, bom, history, registeredUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const materialRequests = orders.filter(o => o.status === 'Raw Material Requested');

  const getMaterialsForProduct = (productName, quantity) => {
    const item = bom.find(b => b.product === productName);
    if (!item) return [];
    return item.materials.map(m => {
      const qtyVal = parseFloat(m.qty) || 1;
      const unit = m.qty.replace(/[0-9.]/g, '');
      return { name: m.name, totalQty: `${qtyVal * quantity}${unit}` };
    });
  };

  const rawMaterialHistory = history
    .filter(h => h.action === 'Raw Material Received' || h.action === 'Raw Material Requested')
    .map(h => {
      const order = orders.find(o => o.id === h.orderId);
      const materials = order ? getMaterialsForProduct(order.product, order.quantity) : [];
      return { ...h, materials };
    });

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 gap-4 md:gap-8">
        {[
          { id: 'dashboard', label: 'Material Requests', icon: LayoutDashboard },
          { id: 'history-tab', label: 'Shipment History', icon: History },
          { id: 'system-history', label: 'System Logs', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-bold transition-all ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Box className="w-6 h-6" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">Ready Stock</p><p className="text-2xl font-bold text-gray-900">Verified</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Clock className="w-6 h-6" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">Pending Fulfillment</p><p className="text-2xl font-bold text-gray-900">{materialRequests.length} Batches</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">Fulfillment Rate</p><p className="text-2xl font-bold text-gray-900">100%</p></div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-3"><Truck className="text-blue-600 w-6 h-6" /><h2 className="text-xl font-bold">Incoming Material Requests</h2></div>
            {materialRequests.length === 0 ? (
              <div className="bg-white py-16 rounded-2xl border border-dashed border-gray-200 text-center">
                <Box className="w-12 h-12 mx-auto text-gray-200 mb-4" /><p className="text-gray-500 font-medium">No pending requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {materialRequests.map(order => {
                  const materials = getMaterialsForProduct(order.product, order.quantity);
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden border-l-4 border-blue-600">
                      <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">SUPPL-BATCH-{order.id.split('-')[1]}</span><span className="text-[10px] font-bold text-gray-400 uppercase">• Request ID: {order.id}</span></div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Request for {order.product} (x{order.quantity})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {materials.map((m, i) => (
                              <div key={i} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{m.name}</span>
                                <span className="text-sm font-bold text-gray-900">Qty: {m.totalQty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="md:w-64 flex flex-col justify-center gap-3 bg-blue-50/30 p-4 rounded-xl border border-blue-50">
                          <div className="mb-2">
                            <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Order Status</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-bold text-orange-900">Awaiting Fulfillment</span>
                            </div>
                          </div>
                          <button onClick={() => updateOrderStatus(order.id, 'Raw Material Received', 'Supplier')} 
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2 transition-all active:scale-95">
                            <Send className="w-4 h-4" /> Ship Materials & Verify
                          </button>
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

      {activeTab === 'history-tab' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b flex justify-between items-center bg-blue-600 text-white">
            <h3 className="text-xl font-bold">Raw Material Fulfillment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Materials & Quantities</th>
                  <th className="px-6 py-4">Strict Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rawMaterialHistory.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No shipments logged yet.</td></tr>
                ) : (
                  rawMaterialHistory.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{log.orderId}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${log.action.includes('Received') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {log.materials.map((m, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              {m.name}: <span className="font-bold">{m.totalQty}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system-history' && (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HistoryView history={history} orders={orders} registeredUsers={registeredUsers} userRole="Supplier" />
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
