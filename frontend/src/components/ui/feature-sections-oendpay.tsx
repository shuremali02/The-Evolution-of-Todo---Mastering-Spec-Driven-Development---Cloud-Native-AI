"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, FileText, Zap } from "lucide-react";

export default function FeatureSectionsOendpay() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: "Real-time Analytics",
      description: "Get instant insights into your finances with live dashboards and spending patterns visualization.",
      color: "from-blue-500 to-sky-500"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Smart User Management",
      description: "Easily manage multiple accounts, set permissions, and control access for your team or family.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "Advanced Invoicing",
      description: "Create professional invoices, track payments, and automate recurring billing with ease.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Lightning Fast Processing",
      description: "Experience millisecond transaction speeds with our optimized infrastructure.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything you need to manage, track, and grow your finances, securely and efficiently.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`rounded-2xl bg-gradient-to-br ${feature.color} h-48 flex items-center justify-center p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl`}>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl w-full h-full flex items-center justify-center">
                  <div className="bg-white/30 rounded-full w-16 h-16 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">{feature.title}</h3>
              <p className="text-gray-600 mt-3">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}