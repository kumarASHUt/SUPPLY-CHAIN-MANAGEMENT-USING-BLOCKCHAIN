import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Truck, ArrowRight, FileText, CheckCircle2, Clock, MapPin, 
  History, LayoutDashboard, Search, Filter, ChevronDown, 
  Store, Factory, ShieldCheck, Plus, Package, CheckCircle, Printer, X, User
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const DistributorDashboard = () => {
  const { orders, updateOrderStatus, history, registeredUsers, inventory } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);

  const pendingRequests = orders.filter(o => o.status === 'Retailer Requested');
  const outboundShipments = orders.filter(o => o.status === 'Product Received by Distributor');

  const getRetailer = (retailerId) => {
    return registeredUsers.find(u => u.id.toLowerCase() === retailerId.toLowerCase());
  };

  const handlePrint = () => {
    window.print();
  };

  const BillModal = ({ order, onClose }) => {
    const retailer = getRetailer(order.retailerId);
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
        <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl print:shadow-none">
          <div className="p-6 border-b flex justify-between items-center print:hidden">
            <h3 className="text-xl font-bold text-gray-900">Generate Invoice</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
          </div>
          <div id="printable-bill" className="p-12 space-y-8 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-black text-blue-600 tracking-tighter">BlockSupply</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Official Distributor Network</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-gray-500 font-mono text-sm">#{order.id.split('-')[1]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 border-y border-gray-100 py-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Bill To:</p>
                <h4 className="font-bold text-gray-900 text-lg">{retailer?.name || order.retailerId}</h4>
                <p className="text-gray-500 text-sm">{retailer?.address}</p>
                <p className="text-gray-500 text-sm">PH: {retailer?.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Distributor Center:</p>
                <h4 className="font-bold text-gray-900 text-lg">Main Logistics Hub</h4>
                <p className="text-gray-500 text-sm">Industrial Estate, Sector 5</p>
                <p className="text-gray-500 text-sm">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-4 text-xs font-bold uppercase">Description</th>
                  <th className="text-right py-4 text-xs font-bold uppercase">Qty</th>
                  <th className="text-right py-4 text-xs font-bold uppercase">Unit Price</th>
                  <th className="text-right py-4 text-xs font-bold uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-6"><p className="font-bold text-gray-900">{order.product}</p><p className="text-xs text-gray-400">Standard Fulfillment</p></td>
                  <td className="text-right py-6 font-medium">{order.quantity}</td>
                  <td className="text-right py-6 font-medium">₹{order.unitPrice.toLocaleString()}</td>
                  <td className="text-right py-6 font-bold">₹{order.totalPrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-8">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{order.totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>Tax (GST 0%)</span><span>₹0</span></div>
                <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-3"><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="pt-12 text-center border-t border-dashed border-gray-200 mt-12">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Authenticity Verified via Ethereum Blockchain</p>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 print:hidden">
            <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"><Printer className="w-4 h-4" /> Print Invoice</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 gap-4 md:gap-8">
        {[
          { id: 'dashboard', label: 'Order Management', icon: LayoutDashboard },
          { id: 'retailers', label: 'Retailer Network', icon: User },
          { id: 'history', label: 'System History', icon: History },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-orange-600 w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-800">Incoming Requests</h2>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 italic">No new requests.</div>
            ) : (
              pendingRequests.map(order => {
                const retailer = getRetailer(order.retailerId);
                const isAvailable = (inventory[order.product] || 0) >= order.quantity;
                return (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${isAvailable ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <h3 className="font-mono font-bold text-gray-900 mt-1">{order.id}</h3>
                        <p className="text-sm text-gray-500">{order.product} (x{order.quantity})</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isAvailable ? (
                          <button onClick={() => {
                            if(window.confirm("Product is available in stock. Start shipping process?"))
                              updateOrderStatus(order.id, 'Product is available and will be shipped soon', 'Distributor')
                          }} 
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-green-100">
                            Approve & Ship <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => {
                            if(window.confirm("Product not in stock. Forward this request to the Supply Chain Manager?"))
                              updateOrderStatus(order.id, 'Forwarded to Manager', 'Distributor')
                          }} 
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black flex items-center gap-2 transition-all active:scale-95">
                            Forward to Manager <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Store className="w-3 h-3" /><span>{retailer?.name || order.retailerId}</span></div>
                      <span className="text-xs font-bold text-gray-400">{retailer?.address}</span>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="text-blue-600 w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-800">Fulfillment & Billing</h2>
            </div>
            {outboundShipments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 italic">Nothing ready to ship.</div>
            ) : (
              outboundShipments.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-2xl border-blue-100 border-2 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Verified Receipt</span>
                      <h3 className="font-mono font-bold text-gray-900 mt-1">{order.id}</h3>
                      <p className="text-sm text-gray-500 font-bold">{order.product} (x{order.quantity})</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => updateOrderStatus(order.id, 'Delivered to Retailer', 'Distributor')} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95">
                        Ship Now <Truck className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelectedOrderForBill(order)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                        View Bill <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}

      {activeTab === 'retailers' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">Registered Retailers</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
              {registeredUsers.filter(u => u.role === 'Retailer').length} Partners
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
            {registeredUsers.filter(u => u.role === 'Retailer').map(r => (
              <div key={r.id} className="p-6 border rounded-2xl bg-gray-50 hover:border-blue-500 transition-all group">
                <div className="flex gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm"><Store className="w-8 h-8 text-blue-600" /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{r.name}</h4>
                    <p className="text-xs font-mono text-gray-400 mb-4">{r.id}</p>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /> {r.address}</p>
                      <p className="text-sm flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400" /> Member since 2026</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Order Count: {orders.filter(o => o.retailerId === r.id).length}</span>
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">View Profile <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HistoryView history={history} orders={orders} registeredUsers={registeredUsers} userRole="Distributor" />
        </div>
      )}

      {selectedOrderForBill && <BillModal order={selectedOrderForBill} onClose={() => setSelectedOrderForBill(null)} />}
    </div>
  );
};

export default DistributorDashboard;
