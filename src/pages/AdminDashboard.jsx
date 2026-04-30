import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Users, Package, History, Plus, Trash2, Search, Filter, 
  ChevronDown, Store, Factory, ShieldCheck, Truck, ArrowRight,
  UserPlus, CreditCard, ClipboardList, Clock, CheckCircle2, LayoutDashboard
} from 'lucide-react';
import HistoryView from '../components/HistoryView';

const AdminDashboard = () => {
  const { 
    history, products, setProducts, 
    registeredUsers, registerUser, orders 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('users');

  // Form States
  const [newUser, setNewUser] = useState({ id: '', name: '', role: 'Retailer', pass: '', address: '', phone: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', materials: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    if (registeredUsers.find(u => u.id.toLowerCase() === newUser.id.toLowerCase())) {
      alert('Error: This User ID is already taken.');
      return;
    }
    registerUser({ ...newUser });
    setNewUser({ id: '', name: '', role: 'Retailer', pass: '', address: '', phone: '' });
    alert('User Registered Successfully');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const bomArray = newProduct.materials.split(',').map(m => {
      const parts = m.trim().split(':');
      const name = parts[0];
      const qty = parts[1] || '1 unit';
      return { material: name, qty: qty };
    });
    setProducts([...products, { id: `p${Date.now()}`, name: newProduct.name, price: parseInt(newProduct.price), bom: bomArray }]);
    setNewProduct({ name: '', price: '', materials: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap border-b border-gray-200 gap-2 md:gap-8">
        {[
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'products', label: 'Product & BoM', icon: Package },
          { id: 'history', label: 'Global History', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-bold transition-all ${
              activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'users' && (
          <div className="p-6 space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5" /> Register New Entity</h3>
              <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input required placeholder="Unique ID" className="p-3 rounded-xl border border-gray-300" value={newUser.id} onChange={e=>setNewUser({...newUser, id: e.target.value})} />
                <input required placeholder="Full Name" className="p-3 rounded-xl border border-gray-300" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} />
                <select className="p-3 rounded-xl border border-gray-300 bg-white" value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})}>
                  <option value="Retailer">Retailer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Manager">Manager</option>
                  <option value="Warehouse">Warehouse Officer</option>
                </select>
                <input required type="password" placeholder="Password" className="p-3 rounded-xl border border-gray-300" value={newUser.pass} onChange={e=>setNewUser({...newUser, pass: e.target.value})} />
                <input required placeholder="Phone Number" className="p-3 rounded-xl border border-gray-300" value={newUser.phone} onChange={e=>setNewUser({...newUser, phone: e.target.value})} />
                <input required placeholder="Address" className="p-3 rounded-xl border border-gray-300" value={newUser.address} onChange={e=>setNewUser({...newUser, address: e.target.value})} />
                <button type="submit" className="md:col-span-3 bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-black transition-colors">Add User to Network</button>
              </form>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-xs font-bold text-gray-500 uppercase"><th className="px-6 py-4">ID</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Phone</th><th className="px-6 py-4">Address</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registeredUsers.filter(u => u.role !== 'Admin').map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">{u.id}</td>
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'Retailer' ? 'bg-purple-100 text-purple-700' : 
                          u.role === 'Distributor' ? 'bg-orange-100 text-orange-700' :
                          u.role === 'Manufacturer' ? 'bg-green-100 text-green-700' :
                          u.role === 'Supplier' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.phone}</td>
                      <td className="px-6 py-4 text-gray-500">{u.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-6 space-y-8">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Define Product & Raw Materials (BoM)</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Product Name" className="p-3 rounded-xl border border-emerald-200" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} />
                <input required type="number" placeholder="Price (₹)" className="p-3 rounded-xl border border-emerald-200" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} />
                <textarea required placeholder="BoM: Material:Qty (e.g. Sugar:5g, Water:10ml)" className="p-3 rounded-xl border border-emerald-200 md:col-span-2" value={newProduct.materials} onChange={e=>setNewProduct({...newProduct, materials: e.target.value})} />
                <button type="submit" className="md:col-span-2 bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Save Product</button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(p => (
                <div key={p.id} className="p-5 border rounded-2xl flex flex-col hover:border-emerald-500 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div><h4 className="text-xl font-bold text-gray-900">{p.name}</h4><p className="text-emerald-600 font-bold">₹{p.price}</p></div>
                    <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Required Raw Materials:</p>
                    <div className="flex flex-wrap gap-2">{p.bom.map((m, i) => (<span key={i} className="px-3 py-1 bg-white border rounded-lg text-xs font-medium text-gray-600">{m.material}: <span className="font-bold text-emerald-600">{m.qty}</span></span>))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <HistoryView history={history} orders={orders} registeredUsers={registeredUsers} userRole="Admin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
