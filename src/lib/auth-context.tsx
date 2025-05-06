"use client"; // Ensure client-side behavior

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // On initial mount, check if there's a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Protect routes based on the authentication status
  useEffect(() => {
    if (isAuthenticated === null) return; // Skip redirect logic while loading the authentication status

    const publicRoutes = ["/login", "/register", "/verify"];
    const currentPath = pathname;

    // If not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && !publicRoutes.includes(currentPath)) {
      router.push("/login");
    }

    // If authenticated and trying to access public routes, redirect to home
    if (isAuthenticated && publicRoutes.includes(currentPath)) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(isAuthenticated), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
