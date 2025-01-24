import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: async () => false,
  logout: async () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_PASSWORD = 'R-M@sters-007';

  const login = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};