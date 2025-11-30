"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    apiRequest(`/auth/me`, "GET", null, token).then(setUser);
  }, []);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight">
        {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
      </h1>

      {user && (
        <div className="flex items-center gap-3">
          <Badge variant={user.role === "admin" ? "destructive" : "outline"}>
            {user.role.toUpperCase()}
          </Badge>

          <span className="text-gray-700 font-medium text-sm">
            {user.full_name || user.email}
          </span>

          <Avatar>
            <AvatarFallback>
              {user.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
