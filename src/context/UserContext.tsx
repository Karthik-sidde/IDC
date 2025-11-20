
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { type User, type UserRole, mockUsers } from "@/lib/mock-data";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
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

  const login = (email: string) => {
    setLoading(true);
    // Find a user that matches the email
    const foundUser = mockUsers.find(
      (u) => u.email === email
    );

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

  const setUser = (user: User) => {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    setUserState(user);
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
