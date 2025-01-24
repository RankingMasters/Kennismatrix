import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { usePaths, useCreatePath, useUpdatePath, useDeletePath } from '../hooks/useSupabaseQuery';
import { useAdmin } from '../contexts/AdminContext';
import EditableCard from '../components/EditableCard';
import { cn } from '../lib/utils';

const SectionPaths = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { isAdmin } = useAdmin();
  const { data: paths, isLoading } = usePaths(sectionId);
  const createPath = useCreatePath();
  const updatePath = useUpdatePath();
  const deletePath = useDeletePath();

  const handleCreatePath = async () => {
    if (!sectionId) return;
    try {
      await createPath.mutateAsync({
        section_id: sectionId,
        title: 'New Path',
        description: 'Enter path description',
        hours: 0,
        order: paths?.length || 0
      });
    } catch (error) {
      console.error('Failed to create path:', error);
    }
  };

  const handleUpdatePath = async (id: string, data: any) => {
    try {
      await updatePath.mutateAsync({
        id,
        data: {
          ...data,
          hours: parseInt(data.hours) || 0
        }
      });
    } catch (error) {
      console.error('Failed to update path:', error);
    }
  };

  const handleDeletePath = async (id: string) => {
    try {
      await deletePath.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete path:', error);
    }
  };

  const movePath = async (index: number, direction: 'up' | 'down') => {
    if (!paths) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= paths.length) return;

    const currentPath = paths[index];
    const targetPath = paths[newIndex];

    try {
      // First update the target path
      await updatePath.mutateAsync({
        id: targetPath.id,
        data: { order: index }
      });

      // Then update the current path
      await updatePath.mutateAsync({
        id: currentPath.id,
        data: { order: newIndex }
      });
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-gray-700 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-48 bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Learning Paths</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths?.map((path, index) => (
            <div key={path.id} className="relative group">
              {isAdmin && (
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => movePath(index, 'up')}
                    disabled={index === 0}
                    className={cn(
                      "p-1 rounded-full hover:bg-white/5 transition-colors",
                      index === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => movePath(index, 'down')}
                    disabled={index === paths.length - 1}
                    className={cn(
                      "p-1 rounded-full hover:bg-white/5 transition-colors",
                      index === paths.length - 1 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              <EditableCard
                title={path.title}
                description={path.description}
                isEditing={isAdmin}
                onSave={(data) => handleUpdatePath(path.id, data)}
                onDelete={() => handleDeletePath(path.id)}
                additionalFields={[
                  {
                    label: 'Estimated Hours',
                    name: 'hours',
                    type: 'number',
                    value: path.hours,
                    min: 0,
                    placeholder: 'Enter estimated hours'
                  }
                ]}
              >
                <div
                  className="path-card"
                  onClick={() => navigate(`/path/${path.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{path.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{path.hours}h</span>
                    </div>
                  </div>
                  <p className="text-gray-400">{path.description}</p>
                </div>
              </EditableCard>
            </div>
          ))}

          {isAdmin && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="path-card border-2 border-dashed border-white/10 hover:border-purple-500/50 transition-colors"
              onClick={handleCreatePath}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-gray-400">Add new path</p>
              </div>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SectionPaths;