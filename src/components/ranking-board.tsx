import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Clock, X, Award, BookOpen } from 'lucide-react';
import { useTopUsers, useActivityLog } from '../hooks/useSupabaseQuery';
import UserDetailsModal from './user-details-modal';
import { cn } from '../lib/utils';

const getTrophyColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 2:
      return 'text-gray-300';
    case 3:
      return 'text-amber-600';
    default:
      return '';
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'completion':
      return <Trophy className="w-4 h-4 text-yellow-400" />;
    case 'started':
      return <BookOpen className="w-4 h-4 text-blue-400" />;
    case 'achievement':
      return <Award className="w-4 h-4 text-purple-400" />;
    default:
      return <Star className="w-4 h-4 text-gray-400" />;
  }
};

const RankingBoard = () => {
  const { data: users, isLoading: usersLoading } = useTopUsers();
  const { data: activities, isLoading: activitiesLoading } = useActivityLog();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  if (usersLoading || activitiesLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 p-8 card ranking-board"
        >
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                  <div className="h-2 bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 card"
        >
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const maxCompletedLevels = Math.max(...(users?.map(u => u.completed_levels || 0) || [1]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-2 p-8 card ranking-board"
      >
        <div className="space-y-6">
          {users?.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group"
            >
              <div 
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                  "hover:bg-white/5 cursor-pointer"
                )}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <motion.img
                    src={user.avatar_url || ''}
                    alt={user.full_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                  />
                  {index < 3 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Trophy className={`w-5 h-5 ${getTrophyColor(index + 1)}`} />
                    </motion.div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold group-hover:text-purple-400 transition-colors">
                      {user.full_name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {user.completed_levels || 0} levels
                    </span>
                  </div>

                  <div className="relative h-2 bg-dark-300 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((user.completed_levels || 0) / maxCompletedLevels) * 100}%` 
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn(
                        "absolute h-full rounded-full",
                        index < 3
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gray-500'
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
          {activities?.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={activity.profile?.avatar_url || ''}
                  alt={activity.profile?.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 break-words">
                  <span className="font-medium text-purple-400">
                    {activity.profile?.full_name}
                  </span>
                  {' '}{activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getActivityIcon(activity.action_type)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedUser && (
          <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RankingBoard;