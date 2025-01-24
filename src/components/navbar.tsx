import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut, Users } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLogin from './AdminLogin';
import { cn } from '../lib/utils';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAdmin();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
      <nav className="glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://rankingmasters.nl/wp-content/uploads/2025/01/RM-600w-wit-png-2.png" 
                alt="Ranking Masters"
                className="w-[200px] h-auto"
              />
            </Link>

            <div className="flex items-center space-x-4">
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/users')}
                  className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center cursor-pointer"
                  title="Manage users"
                >
                  <Users className="w-5 h-5 text-purple-400" />
                </motion.button>
              )}
              {isAdmin ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center cursor-pointer"
                  title="Logout from admin mode"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAdminLogin(true)}
                  className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center cursor-pointer"
                  title="Enter admin mode"
                >
                  <Shield className="w-5 h-5 text-purple-400" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </>
  );
};

export default Navbar;