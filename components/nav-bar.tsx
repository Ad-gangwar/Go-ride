'use client';

import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between p-3 px-10 border-b-[1px] shadow-md">
      <div className="flex gap-10 items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={120} height={60} priority />
        </Link>
        <div className="hidden md:flex gap-6 ">
          <Link href="/">
            <h2
              className="hover:bg-gray-100 p-2
                rounded-md cursor-pointer transition-all"
            >
              Home
            </h2>
          </Link>
          <h2
            className="hover:bg-gray-100 p-2
                rounded-md cursor-pointer transition-all"
          >
            History
          </h2>
          <h2
            className="hover:bg-gray-100 p-2
                rounded-md cursor-pointer transition-all"
          >
            Help
          </h2>
        </div>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {user.firstName || user.username}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
