"use client";

import { motion } from "framer-motion";

export default function CompaniesTrust() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="bg-gradient-to-r from-slate-800 to-[#4D6EA3] text-transparent bg-clip-text text-3xl md:text-4xl font-bold">
            Trusted by World's Leading Companies
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Join thousands of businesses that rely on Oendpay for their financial operations
          </p>
        </motion.div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-sky-100 rounded-3xl transform rotate-3 blur-xl opacity-70"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <img 
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-7.svg" 
                  alt="Oendpay Dashboard" 
                  className="w-full h-auto object-cover rounded-3xl hover:-translate-y-1 transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Analytics</h3>
                <p className="text-gray-600">
                  Real-time insights into your business finances with customizable dashboards and reporting.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Team Management</h3>
                <p className="text-gray-600">
                  Easily manage multiple accounts, set permissions, and control access for your team.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Invoicing</h3>
                <p className="text-gray-600">
                  Create professional invoices, track payments, and automate recurring billing.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expense Tracking</h3>
                <p className="text-gray-600">
                  Automatically categorize expenses and generate detailed spending reports.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}