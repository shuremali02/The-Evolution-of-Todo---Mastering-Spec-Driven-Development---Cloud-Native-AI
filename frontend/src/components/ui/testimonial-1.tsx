"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star, CheckCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Freelance Designer",
    company: "Creative Studio",
    content: "Oendpay has completely transformed how I manage my freelance income. The instant transfers and multi-currency support have saved me hours every month.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    verified: true
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "E-commerce Owner",
    company: "TechGadgets Inc",
    content: "The analytics dashboard gives me insights I never had before. I've increased my profit margins by 18% just by understanding my spending patterns.",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 5,
    verified: true
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Digital Marketer",
    company: "GrowthHackers",
    content: "As someone who works with international clients, Oendpay's global accessibility is a game-changer. Sending and receiving payments has never been easier.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    verified: true
  }
];

const stats = [
  { value: "98%", label: "Customer Satisfaction" },
  { value: "2.5M+", label: "Transactions/Month" },
  { value: "15s", label: "Avg. Transfer Time" },
  { value: "24/7", label: "Support Availability" }
];

export default function Testimonial1() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trusted by Thousands Worldwide
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join over 10 million users who have transformed their financial management with Oendpay
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-sky-100 rounded-3xl transform -rotate-3 blur-xl opacity-70"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              <Quote className="w-12 h-12 text-blue-500 mb-6" />
              
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover mr-6"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                    </p>
                    <div className="flex items-center mt-2">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      {testimonials[currentIndex].verified && (
                        <span className="flex items-center text-green-600 ml-3">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            By the numbers
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Why users love Oendpay
            </h4>
            <ul className="space-y-3">
              {[
                "Bank-level security with military-grade encryption",
                "Instant transfers to 180+ countries",
                "AI-powered financial insights and budgeting tools",
                "24/7 customer support in 12 languages",
                "Seamless integration with major accounting software"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}