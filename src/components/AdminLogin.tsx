import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, LogIn } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { cn } from '../lib/utils';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(password);
      if (success) {
        onClose();
        setPassword('');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-200 rounded-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Admin Login</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-dark-300 rounded-lg px-4 py-2 outline-none",
                    "border border-white/10 focus:border-purple-500 transition-colors",
                    error && "border-red-500"
                  )}
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-2 rounded-lg font-medium",
                  "bg-gradient-to-r from-purple-500 to-pink-500",
                  "hover:opacity-90 transition-opacity",
                  "flex items-center justify-center gap-2",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminLogin;