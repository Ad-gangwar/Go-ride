"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Clock, MapPin, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [imageIndex, setImageIndex] = useState(0);
  const images = ['1.png', '2.png', '3.png', '4.png', '5.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-orange-300 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-14 items-center relative z-10"
        >
          {/* Text Content */}
          <div className="max-w-2xl text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white drop-shadow-sm"
            >
              Your Ride, <span className="text-orange-700 dark:text-yellow-400">Your Way</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl text-gray-800 dark:text-gray-200 leading-relaxed"
            >
              Fast, reliable, and convenient taxi service. Book in seconds and travel in comfort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/booking"
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition duration-300 shadow-md hover:shadow-xl"
              >
                Book a Ride
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-orange-700 border border-orange-600 dark:border-yellow-400 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition duration-300 shadow-sm hover:shadow-md"
              >
                Sign Up
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>

          {/* Rotating Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[420px] w-full rounded-3xl overflow-hidden ring-4 ring-white/40 dark:ring-gray-700 shadow-2xl transform hover:scale-[1.03] transition duration-500"
          >
            <Image
              src={`/${images[imageIndex]}`}
              alt="Taxi Preview"
              fill
              className="object-cover transition-opacity duration-500"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Overlay Gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-orange-400/20 dark:from-gray-900/40 dark:to-transparent pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
          >
            Why Choose <span className="text-yellow-600">Taxi Go</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: <Clock className="w-8 h-8 text-yellow-600" />,
                title: "Fast & Reliable",
                description: "Reach your destination on time, every time. Our drivers are punctual and routes are optimized."
              },
              {
                icon: <Shield className="w-8 h-8 text-yellow-600" />,
                title: "Safe Journeys",
                description: "Every ride is backed by strict safety standards. Verified drivers, sanitized cars, and 24/7 support."
              },
              {
                icon: <MapPin className="w-8 h-8 text-yellow-600" />,
                title: "Go Anywhere",
                description: "Local or outstation — Taxi Go ensures smooth rides across cities with extensive service coverage."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl border border-yellow-100 dark:border-gray-700 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-yellow-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
          >
            What Our <span className="text-yellow-600">Riders Say</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-yellow-50 dark:bg-gray-800 border border-yellow-100 dark:border-gray-700 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-300 mb-6">
                  &quot;The service was excellent! The driver was professional and got me to my destination on time. Will definitely use again.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden mr-4">
                    <Image src={`/${i}.png`} alt="Customer" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Customer {i}</h4>
                    <p className="text-gray-500 dark:text-gray-400">Regular Rider</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Ready to Experience <span className="text-yellow-600">Taxi Go</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-300"
          >
            Join thousands of satisfied customers and make every ride stress-free, safe, and stylish.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/booking"
              className="inline-block px-10 py-4 bg-yellow-600 text-white font-bold rounded-full text-xl hover:bg-yellow-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Book Your Ride Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
