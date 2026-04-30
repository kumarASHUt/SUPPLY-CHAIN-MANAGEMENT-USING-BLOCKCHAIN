import React, { useState } from 'react';
import { 
  Search, ChevronDown, Package, Clock, CheckCircle2, User, 
  Store, Truck, Factory, ShieldCheck, Warehouse, ArrowRight, LayoutDashboard
} from 'lucide-react';
import { STATUS_ENUM } from '../utils/contract';

const HistoryView = ({ history, orders, registeredUsers, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRetailer, setFilterRetailer] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStepLog = (orderId, stepName) => {
    return (history || []).find(h => 
      h.orderId === orderId && 
      (h.action === stepName || h.action.includes(stepName) || stepName.includes(h.action))
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRetailer ? order.retailerId === filterRetailer : true;
    return matchesSearch && matchesFilter;
  });

  const pipelineSteps = STATUS_ENUM;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            placeholder="Search Order ID..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {(userRole === 'Admin' || userRole === 'Distributor' || userRole === 'Manager') && (
          <div className="relative">
            <select 
              className="pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 appearance-none bg-white font-medium"
              value={filterRetailer}
              onChange={e => setFilterRetailer(e.target.value)}
            >
              <option value="">All Retailers</option>
              {registeredUsers?.filter(u => u.role === 'Retailer').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isSelected = selectedOrder === order.id;
          return (
            <div key={order.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${isSelected ? 'border-blue-600 shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}>
              <div 
                onClick={() => setSelectedOrder(isSelected ? null : order.id)}
                className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{order.product} (x{order.quantity})</h4>
                    <p className="text-xs text-gray-500 font-mono">ID: {order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Current Status</p>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${order.status.includes('Verified') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isSelected && (
                <div className="border-t border-gray-100">
                  {/* Interactive Visual Pipeline */}
                  <div className="p-8 bg-slate-50 overflow-x-auto">
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Live Tracking Pipeline
                    </h5>
                    <div className="flex flex-row min-w-[1200px] justify-between relative pb-12">
                      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
                      {pipelineSteps.map((step, idx) => {
                        const log = getStepLog(order.id, step);
                        const isDone = order.steps.includes(step);
                        const isCurrent = order.status === step;
                        const icon = getStepIcon(step);

                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 relative z-10 flex-1 px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                              isDone ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 
                              isCurrent ? 'bg-white border-blue-600 text-blue-600 animate-pulse shadow-lg scale-110' : 
                              'bg-white border-gray-200 text-gray-300'
                            }`}>
                              {isDone ? <CheckCircle2 className="w-5 h-5" /> : icon}
                            </div>
                            <div className="text-center space-y-1.5 min-h-[140px]">
                              <p className={`text-[10px] font-bold leading-tight uppercase max-w-[110px] mx-auto ${isDone || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step}
                              </p>
                              {log ? (
                                <div className="animate-in fade-in zoom-in-95 duration-700 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                  <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                    {log.role}
                                  </span>
                                  <div className="mt-2 flex flex-col items-center border-t border-gray-50 pt-1">
                                    <p className="text-[8px] text-gray-500 font-mono font-bold leading-none">{log.timestamp.split(', ')[1]}</p>
                                    <p className="text-[8px] text-gray-400 font-mono leading-none mt-1">{log.timestamp.split(', ')[0]}</p>
                                  </div>
                                  {log.actor && (
                                    <p className="text-[7px] text-blue-400 font-mono mt-2 truncate w-20 mx-auto" title={log.actor}>
                                      {log.actor.substring(0, 6)}...{log.actor.substring(log.actor.length - 4)}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="h-6 flex items-center justify-center">
                                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vertical Timeline View */}
                  <div className="p-6 bg-white border-t border-gray-100">
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Comprehensive Immutable Logs
                    </h5>
                    <div className="space-y-6 relative ml-4">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                      {history.filter(h => h.orderId === order.id).map((log, i) => (
                        <div key={i} className="flex gap-4 relative z-10 group">
                          <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {getStepIcon(log.action)}
                          </div>
                          <div className="flex-1 pb-4 border-b border-gray-50 last:border-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{log.action}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">{log.role}</span>
                                  <span className="text-[10px] text-gray-400">• {log.timestamp}</span>
                                </div>
                              </div>
                              <div className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                Block Verified: {log.actor?.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getStepIcon = (status) => {
  if (status.includes('Retailer')) return <Store className="w-4 h-4" />;
  if (status.includes('Distributor')) return <Truck className="w-4 h-4" />;
  if (status.includes('Manager')) return <User className="w-4 h-4" />;
  if (status.includes('Warehouse')) return <Warehouse className="w-4 h-4" />;
  if (status.includes('Supplier')) return <ShieldCheck className="w-4 h-4" />;
  if (status.includes('Manufacturer') || status.includes('Manufacturing')) return <Factory className="w-4 h-4" />;
  return <Package className="w-4 h-4" />;
};

export default HistoryView;
