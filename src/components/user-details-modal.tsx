import React from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useUserProgress } from '../hooks/useSupabaseQuery';
import { cn } from '../lib/utils';

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  const { data: sections = [], isLoading } = useUserProgress(user.id);

  return (
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
        className="bg-dark-200 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url || 'https://via.placeholder.com/80'}
                alt={user.full_name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500"
              />
              <div>
                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                <p className="text-gray-400">
                  {user.completed_levels} levels completed
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`loading-${i}`} className="bg-white/5 rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sections.length > 0 ? (
            <div className="space-y-8">
              {sections.map(section => {
                const Icon = Icons[section.icon as keyof typeof Icons] || Icons.Folder;
                return (
                  <div key={section.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gradient-to-br",
                        section.color
                      )}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                    </div>

                    <div className="grid gap-4">
                      {section.paths?.map(path => (
                        <div
                          key={`${section.id}-${path.id}`}
                          className="bg-white/5 rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{path.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <BookOpen className="w-4 h-4" />
                                <span>Current: {path.currentLevel}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-400">
                                {path.progress}%
                              </div>
                              <div className="text-sm text-gray-400">completed</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full bg-gradient-to-r",
                                  section.color
                                )}
                                style={{ width: `${path.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>{path.completedLevels?.length || 0} levels completed</span>
                              </div>
                              {path.currentLevel && (
                                <div className="flex items-center gap-1">
                                  <ArrowRight className="w-4 h-4" />
                                  <span>{path.currentLevel}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No progress data available
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDetailsModal;