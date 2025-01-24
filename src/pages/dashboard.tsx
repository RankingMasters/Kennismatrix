import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import RankingBoard from '../components/ranking-board';
import EditableCard from '../components/EditableCard';
import { useAdmin } from '../contexts/AdminContext';
import { cn } from '../lib/utils';
import { useSections, useUpdateSection, useDeleteSection, useCreateSection, useUpdateSectionOrder } from '../hooks/useSupabaseQuery';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { data: sections = [], isLoading, error } = useSections();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const createSection = useCreateSection();
  const updateOrder = useUpdateSectionOrder();

  const handleSaveSection = async (id: string, data: any) => {
    try {
      await updateSection.mutateAsync({ id, data });
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      await deleteSection.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleAddSection = async () => {
    try {
      await createSection.mutateAsync({
        title: 'New Section',
        description: 'Enter section description',
        icon: 'Code',
        color: 'from-purple-500 to-pink-500',
        order: sections.length
      });
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const currentSection = sections[index];
    const targetSection = sections[newIndex];

    try {
      // First update the target section
      await updateOrder.mutateAsync({
        id: targetSection.id,
        order: index
      });

      // Then update the current section
      await updateOrder.mutateAsync({
        id: currentSection.id,
        order: newIndex
      });
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Error loading sections</h1>
          <p className="text-gray-400">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Ranking Masters Kennismatrix
        </h1>
      </motion.div>

      <div className="relative">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg" />
                  <div className="w-20 h-8 bg-gray-700 rounded" />
                </div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-full" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => {
              const Icon = Icons[section.icon as keyof typeof Icons] || Icons.Code;
              return (
                <div key={section.id} className="relative group">
                  {isAdmin && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className={cn(
                          "p-1 rounded-full hover:bg-white/5 transition-colors",
                          index === 0 && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sections.length - 1}
                        className={cn(
                          "p-1 rounded-full hover:bg-white/5 transition-colors",
                          index === sections.length - 1 && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <EditableCard
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    color={section.color}
                    isEditing={isAdmin}
                    onSave={(data) => handleSaveSection(section.id, data)}
                    onDelete={() => handleDeleteSection(section.id)}
                  >
                    <div className="card">
                      <div
                        className="relative"
                        onClick={() => navigate(`/section/${section.id}`)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn(
                            'w-12 h-12 rounded-lg flex items-center justify-center',
                            'bg-gradient-to-br',
                            section.color
                          )}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-2xl font-bold text-white/80">
                            {section.paths_count || 0} paths
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                        <p className="text-sm text-gray-400">{section.description}</p>

                        <div className="mt-4 flex gap-2">
                          {Array.from({ length: section.paths_count || 0 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                'h-1 flex-1 rounded-full',
                                'bg-gradient-to-r',
                                section.color
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </EditableCard>
                </div>
              );
            })}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "card group border-2 border-dashed border-white/10",
                  "hover:border-purple-500/50 transition-colors"
                )}
                onClick={handleAddSection}
              >
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-gray-400">Add new section</p>
                </div>
              </motion.button>
            )}
          </div>
        )}
      </div>

      <RankingBoard />
    </div>
  );
};

export default Dashboard;