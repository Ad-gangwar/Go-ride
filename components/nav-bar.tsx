'use client';

import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { User, LogOut, LogIn, UserPlus, Clock, Map } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between p-3 px-4 md:px-10 border-b-[1px] shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-4 md:gap-10 items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="logo" width={120} height={60} priority className="" />
        </Link>
        <div className="hidden md:flex gap-6">
          <Link href="/">
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition-all">
              <Map size={18} className="mr-2 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-200">Home</span>
            </div>
          </Link>
          <Link href="/ride-history">
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition-all">
              <Clock size={18} className="mr-2 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-200">History</span>
            </div>
          </Link>
          <Link href="/profile">
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer transition-all">
              <User size={18} className="mr-2 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-200">Profile</span>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
              {user.firstName || user.username}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-md flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <LogIn size={16} />
              <span className="hidden md:inline">Login</span>
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span className="hidden md:inline">Register</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
