'use client';

import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { User, LogOut, LogIn, UserPlus, Clock, Map } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between p-3 px-6 md:px-12 border-b-[1px] shadow-soft dark:shadow-soft-dark dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-6 md:gap-12 items-center text-md">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="logo" width={140} height={70} priority className="" />
        </Link>
        <div className="hidden md:flex gap-8 text-lg">
          <Link href="/booking">
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-lg cursor-pointer transition-all">
              <Map size={20} className="mr-2.5 text-primary-500" />
              <span className="font-medium text-gray-700 dark:text-gray-200">Ride Booking</span>
            </div>
          </Link>
          <Link href="/ride-history">
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-lg cursor-pointer transition-all">
              <Clock size={20} className="mr-2.5 text-primary-500" />
              <span className="font-medium text-gray-700 dark:text-gray-200">History</span>
            </div>
          </Link>
          <Link href="/profile">
            <div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-lg cursor-pointer transition-all">
              <User size={20} className="mr-2.5 text-primary-500" />
              <span className="font-medium text-gray-700 dark:text-gray-200">Profile</span>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400 hidden md:block">
              {user.firstName || user.username}
            </span>
            <button
              onClick={logout}
              className="px-5 py-2.5 font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut size={22} />
              <span className="hidden md:inline text-md">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 font-medium text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <LogIn size={22} />
              <span className="hidden md:inline text-lg">Login</span>
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 flex items-center gap-2 transition-colors"
            >
              <UserPlus size={22} />
              <span className="hidden md:inline text-lg">Register</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
