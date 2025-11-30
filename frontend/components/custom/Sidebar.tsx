"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Home, PlusCircle, ClipboardList, LogOut, Shield } from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/tasks/add", label: "Add Task", icon: PlusCircle },
  { href: "/dashboard/tasks/list", label: "My Tasks", icon: ClipboardList },
];

const adminLinks = [
  { href: "/dashboard/admin/tasks", label: "All Tasks (Admin)", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Fetch current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    apiRequest("/auth/me", "GET", null, token)
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col shadow-sm">
      <h1 className="text-2xl font-bold px-6 py-6 tracking-tight">
        Task Manager
      </h1>

      <nav className="px-4 space-y-1">
        {/* USER LINKS */}
        {userLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}

        {/* ADMIN LINKS (role==='admin') */}
        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-1 text-xs font-semibold text-gray-500 px-4 uppercase">
              Admin
            </div>

            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                    ${
                      active
                        ? "bg-red-100 text-red-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
