import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Edit2, Trash2, ArrowLeft, X, Trophy, Book, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  completed_levels: number;
}

interface UserProgress {
  level_title: string;
  path_title: string;
  completed_at: string;
}

interface Level {
  id: string;
  title: string;
  path: {
    id: string;
    title: string;
    section: {
      id: string;
      title: string;
    };
  };
}

const UserManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingLevel, setIsAddingLevel] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [levelSearch, setLevelSearch] = useState('');

  // Fetch users
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress_view')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Fetch user progress
  const { data: userProgress = [], isLoading: loadingProgress } = useQuery({
    queryKey: ['user-progress', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          level_id,
          completed_at,
          levels:levels (
            title,
            paths:paths (
              title
            )
          )
        `)
        .eq('user_id', selectedUser.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        level_title: item.levels.title,
        path_title: item.levels.paths.title,
        completed_at: item.completed_at
      }));
    },
    enabled: !!selectedUser
  });

  // Fetch available levels
  const { data: levels = [], isLoading: loadingLevels } = useQuery({
    queryKey: ['levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('levels')
        .select(`
          id,
          title,
          paths:paths (
            id,
            title,
            sections:sections (
              id,
              title
            )
          )
        `)
        .order('rank');

      if (error) throw error;
      return data.map(level => ({
        id: level.id,
        title: level.title,
        path: {
          id: level.paths.id,
          title: level.paths.title,
          section: level.paths.sections
        }
      }));
    }
  });

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      if (!userData.full_name.trim()) {
        throw new Error('Full name is required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([{ 
          full_name: userData.full_name.trim(),
          avatar_url: userData.avatar_url.trim() || null
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddingUser(false);
      setNewUser({ full_name: '', avatar_url: '' });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      if (!userData.full_name?.trim()) {
        throw new Error('Full name is required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          full_name: userData.full_name.trim(),
          avatar_url: userData.avatar_url?.trim() || null
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUser(prev => prev ? { ...prev, ...data } : null);
      setIsEditing(false);
      setEditedUser(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUser(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Add completed level mutation
  const addCompletedLevel = useMutation({
    mutationFn: async (levelId: string) => {
      if (!selectedUser) throw new Error('No user selected');

      const { error } = await supabase
        .from('user_progress')
        .insert([{
          user_id: selectedUser.id,
          level_id: levelId,
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', selectedUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddingLevel(false);
      setLevelSearch('');
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleAddUser = async () => {
    try {
      await createUser.mutateAsync(newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLevels = levels.filter(level =>
    level.title.toLowerCase().includes(levelSearch.toLowerCase()) ||
    level.path.title.toLowerCase().includes(levelSearch.toLowerCase()) ||
    level.path.section.title.toLowerCase().includes(levelSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </motion.button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <button
          onClick={() => {
            setIsAddingUser(true);
            setError(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-dark-200 rounded-lg border border-white/10 focus:border-purple-500 transition-colors outline-none"
            />
          </div>

          <div className="space-y-2">
            {loadingUsers ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              filteredUsers.map(user => (
                <motion.button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    selectedUser?.id === user.id
                      ? "bg-purple-500/20 hover:bg-purple-500/30"
                      : "hover:bg-white/5"
                  )}
                >
                  <img
                    src={user.avatar_url || 'https://via.placeholder.com/40'}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.full_name}</div>
                  </div>
                  <div className="text-sm text-purple-400">
                    {user.completed_levels} levels
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="flex items-start justify-between">
                  {isEditing ? (
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={editedUser?.avatar_url || selectedUser.avatar_url || 'https://via.placeholder.com/80'}
                          alt={editedUser?.full_name || selectedUser.full_name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editedUser?.full_name || ''}
                            onChange={e => setEditedUser(prev => ({ ...prev!, full_name: e.target.value }))}
                            className="w-full px-4 py-2 bg-dark-300 rounded-lg border border-white/10 focus:border-purple-500 transition-colors outline-none"
                            placeholder="Full Name"
                          />
                          <input
                            type="url"
                            value={editedUser?.avatar_url || ''}
                            onChange={e => setEditedUser(prev => ({ ...prev!, avatar_url: e.target.value }))}
                            className="w-full px-4 py-2 bg-dark-300 rounded-lg border border-white/10 focus:border-purple-500 transition-colors outline-none"
                            placeholder="Avatar URL"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedUser(null);
                            setError(null);
                          }}
                          className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateUser.mutate(editedUser!)}
                          className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <img
                          src={selectedUser.avatar_url || 'https://via.placeholder.com/80'}
                          alt={selectedUser.full_name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                          <h2 className="text-2xl font-bold">{selectedUser.full_name}</h2>
                          <p className="text-gray-400">{selectedUser.completed_levels} levels completed</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditedUser(selectedUser);
                            setError(null);
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                          title="Edit user"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this user?')) {
                              deleteUser.mutate(selectedUser.id);
                            }
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Completed Levels */}
                {!isEditing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-purple-400" />
                        Completed Levels
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddingLevel(true);
                          setError(null);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Level
                      </button>
                    </div>
                    <div className="space-y-2">
                      {loadingProgress ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                          ))}
                        </div>
                      ) : userProgress.length > 0 ? (
                        userProgress.map((progress, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <Book className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white">{progress.level_title}</div>
                              <div className="text-sm text-gray-400">
                                {progress.path_title} • Completed {new Date(progress.completed_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-8">
                          No levels completed yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center text-gray-400"
              >
                Select a user to view details
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddingUser(false);
              setError(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-dark-200 rounded-xl w-full max-w-md p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add New User</h2>
                <button
                  onClick={() => {
                    setIsAddingUser(false);
                    setError(null);
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-300 rounded-lg border border-white/10 focus:border-purple-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Avatar URL (optional)</label>
                  <input
                    type="url"
                    value={newUser.avatar_url}
                    onChange={e => setNewUser({ ...newUser, avatar_url: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-300 rounded-lg border border-white/10 focus:border-purple-500 transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingUser(false);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUser.full_name.trim()}
                  className={cn(
                    "px-4 py-2 rounded-lg bg-purple-500 text-white transition-colors",
                    !newUser.full_name.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-purple-600"
                  )}
                >
                  Add User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Level Modal */}
        {isAddingLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddingLevel(false);
              setError(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-dark-200 rounded-xl w-full max-w-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add Completed Level</h2>
                <button
                  onClick={() => {
                    setIsAddingLevel(false);
                    setError(null);
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={levelSearch}
                  onChange={e => setLevelSearch(e.target.value)}
                  placeholder="Search levels..."
                  className="w-full pl-10 pr-4 py-2 bg-dark-300 rounded-lg border border-white/10 focus:border-purple-500 transition-colors outline-none"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {loadingLevels ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  filteredLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => addCompletedLevel.mutate(level.id)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white">{level.title}</div>
                        <div className="text-sm text-gray-400">
                          {level.path.section.title} • {level.path.title}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;