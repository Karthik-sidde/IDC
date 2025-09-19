"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { type User, type UserRole, mockUsers } from "@/lib/mock-data";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("currentUser");
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, role: UserRole) => {
    setLoading(true);
    // Find a user that matches the email or just the role for mock purposes
    let foundUser = mockUsers.find(
      (u) => u.email === email && u.role === role
    );
    if (!foundUser) {
        foundUser = mockUsers.find((u) => u.role === role);
    }

    if (foundUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(foundUser));
      setUserState(foundUser);
    }
    setLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem("currentUser");
    setUserState(null);
  };

  const switchRole = (role: UserRole) => {
    const newUser = mockUsers.find((u) => u.role === role);
    if (newUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(newUser));
      setUserState(newUser);
    }
  };
  
  const setUser = (user: User) => {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    setUserState(user);
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, switchRole, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
