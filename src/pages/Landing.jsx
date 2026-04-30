import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Factory, Store, ArrowRight, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Transparent Supply Chain <br />
            <span className="text-blue-200">Powered by Blockchain</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Verify provenance, track real-time shipments, and ensure immutability 
            at every step of the product lifecycle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center gap-2">
              Explore Demo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Unified Network for All Stakeholders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform bridges the gap between suppliers, manufacturers, and retailers with a single source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Supplier', desc: 'Manage raw materials and fulfill requests with verified digital signatures.', color: 'text-blue-600' },
              { icon: Factory, title: 'Manufacturer', desc: 'Monitor BoM automation and track production progress in real-time.', color: 'text-green-600' },
              { icon: Truck, title: 'Distributor', desc: 'Optimize logistics and provide instant billing transparency.', color: 'text-orange-600' },
              { icon: Store, title: 'Retailer', desc: 'Directly request products and verify authentic delivery history.', color: 'text-purple-600' },
            ].map((item, idx) => (
              <div key={idx} className="p-8 border border-gray-100 rounded-2xl bg-gray-50 hover:shadow-xl transition-shadow group">
                <item.icon className={`w-12 h-12 mb-6 ${item.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Pipeline Preview */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto bg-white p-12 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <Activity className="text-blue-600 w-8 h-8" />
            <h2 className="text-2xl font-bold">Immutable Lifecycle Tracking</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {['Order Placed', 'Raw Material Sent', 'Manufacturing', 'Distributed', 'Delivered'].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${i === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <span className="mt-2 font-medium text-sm">{step}</span>
                </div>
                {i < 4 && <div className="hidden md:block h-px flex-1 bg-gray-200"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
