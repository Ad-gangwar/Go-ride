'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password, email);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-[94vh] grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-center" />

      {/* Left side - Register Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="h-full lg:flex flex-col items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500 mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center space-y-4 mb-12"
          >
            <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-md text-gray-600 dark:text-gray-300">
              Sign up to get started with Taxi Go!
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSubmit} 
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div>
              <label htmlFor="username" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Create a password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-xl font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
            >
              <UserPlus size={20} className="mr-2" />
              Sign up
            </motion.button>

            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.form>
        </div>
      </motion.div>

      {/* Right side - Car Image */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="h-full hidden lg:flex items-center justify-center p-8"
      >
        <div className="relative w-full h-full max-w-2xl">
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <Image 
              src="/4.png" 
              alt="Car" 
              fill
              className="object-contain max-w-2xl"
              priority 
              unoptimized
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 