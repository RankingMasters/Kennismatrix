import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronDown, Clock, Book, Trophy, CheckCircle2, Target, Sparkles, Youtube, Gift } from 'lucide-react';
import { useLevels, useCreateLevel, useUpdateLevel, useDeleteLevel } from '../hooks/useSupabaseQuery';
import { useAdmin } from '../contexts/AdminContext';
import LevelEditor from '../components/level-editor/LevelEditor';
import { cn } from '../lib/utils';

const PathLevels = () => {
  const navigate = useNavigate();
  const { pathId } = useParams();
  const { isAdmin } = useAdmin();
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const { data: levels = [], isLoading } = useLevels(pathId);
  const createLevel = useCreateLevel();
  const updateLevel = useUpdateLevel();
  const deleteLevel = useDeleteLevel();

  const handleCreateLevel = async () => {
    if (!pathId) return;
    try {
      await createLevel.mutateAsync({
        pathId,
        data: {
          title: 'New Level',
          description: 'Enter level description',
          description_extended: '',
          rank: levels.length,
          process: [],
          time_investment: {},
          learning_materials: {},
          assessment: {},
          rewards_extended: {},
          info: ''
        }
      });
    } catch (error) {
      console.error('Failed to create level:', error);
    }
  };

  const handleUpdateLevel = async (id: string, data: any) => {
    try {
      await updateLevel.mutateAsync({ id, data });
    } catch (error) {
      console.error('Failed to update level:', error);
    }
  };

  const handleDeleteLevel = async (id: string) => {
    try {
      await deleteLevel.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete level:', error);
    }
  };

  const handleMoveLevel = async (id: string, currentRank: number, direction: 'up' | 'down') => {
    const newRank = direction === 'up' ? currentRank - 1 : currentRank + 1;
    if (newRank < 0 || !levels || newRank >= levels.length) return;

    const sortedLevels = [...levels].sort((a, b) => a.rank - b.rank);
    const currentIndex = sortedLevels.findIndex(l => l.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sortedLevels.length) return;

    const targetLevel = sortedLevels[targetIndex];

    try {
      await updateLevel.mutateAsync({
        id: targetLevel.id,
        data: { rank: currentRank }
      });

      await updateLevel.mutateAsync({
        id,
        data: { rank: newRank }
      });
    } catch (error) {
      console.error('Failed to move level:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-gray-700 rounded" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-48 bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortedLevels = [...levels].sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen p-8 space-y-8">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Paths
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Career Levels</h1>
          {isAdmin && (
            <button
              onClick={handleCreateLevel}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
              )}
            >
              <Plus className="w-4 h-4" />
              Add Level
            </button>
          )}
        </div>

        <div className="space-y-6">
          {sortedLevels.map((level, index) => (
            <LevelEditor
              key={level.id}
              level={level}
              isEditing={isAdmin}
              onSave={(data) => handleUpdateLevel(level.id, data)}
              onDelete={() => handleDeleteLevel(level.id)}
              onMove={direction => handleMoveLevel(level.id, level.rank, direction)}
              isFirst={index === 0}
              isLast={index === sortedLevels.length - 1}
            >
              <div
                className={cn(
                  "level-card overflow-hidden",
                  expandedLevel === index && "border border-purple-500/20"
                )}
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedLevel(expandedLevel === index ? null : index)}
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{level.title}</h3>
                    <p className="text-gray-400">{level.description}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedLevel === index ? 180 : 0 }}
                    className="p-2 hover:bg-white/5 rounded-full"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {expandedLevel === index && (
                    <motion.div
                      initial={false}
                      animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {level.description_extended && (
                        <div className="level-card-section">
                          <h4 className="level-card-section-title">
                            <Target className="w-4 h-4" />
                            Description
                          </h4>
                          <p className="level-card-description whitespace-pre-line">
                            {level.description_extended}
                          </p>
                        </div>
                      )}

                      {level.process && level.process.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Aanvraagproces
                          </h4>
                          <div className="grid gap-3">
                            {level.process.map((step: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">
                                  {i + 1}
                                </div>
                                <p className="text-gray-300">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {level.time_investment?.breakdown && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Verwachte tijdsbesteding
                          </h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <h5 className="text-sm font-medium text-gray-400">Breakdown</h5>
                              {Object.entries(level.time_investment.breakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                  <span className="text-gray-300 capitalize">{key.replace('_', ' ')}</span>
                                  <span className="text-purple-400">{value}</span>
                                </div>
                              ))}
                            </div>
                            {level.time_investment.totals && (
                              <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-400">Totalen</h5>
                                {Object.entries(level.time_investment.totals).map(([role, data]: [string, any]) => (
                                  <div key={role} className="bg-white/5 p-3 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-300 capitalize">{role}</span>
                                      <span className="text-purple-400">{data.total}</span>
                                    </div>
                                    {data.details && (
                                      <div className="text-sm space-y-1">
                                        {Object.entries(data.details).map(([key, value]) => (
                                          <div key={key} className="flex justify-between items-center text-gray-400">
                                            <span className="capitalize">{key}</span>
                                            <span>{value}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {level.learning_materials && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                            <Book className="w-4 h-4" />
                            Leerstof
                          </h4>
                          <div className="grid gap-6 md:grid-cols-2">
                            {level.learning_materials.technieken && level.learning_materials.technieken.length > 0 && (
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-gray-400">Technieken</h5>
                                <ul className="space-y-2">
                                  {level.learning_materials.technieken.map((tech: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-300">
                                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                        {i + 1}
                                      </div>
                                      <span>{tech}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {level.learning_materials.tools && level.learning_materials.tools.length > 0 && (
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-gray-400">Tools</h5>
                                <ul className="space-y-2">
                                  {level.learning_materials.tools.map((tool: any, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300">
                                      <Sparkles className="w-4 h-4 text-purple-400" />
                                      {typeof tool === 'string' ? tool : (
                                        <div className="flex items-center gap-2">
                                          <span>{tool.name}</span>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {level.learning_materials.courses && level.learning_materials.courses.length > 0 && (
                            <div className="space-y-4 mt-6">
                              <h5 className="text-sm font-medium text-gray-400">Te bekijken</h5>
                              <div className="grid gap-3">
                                {level.learning_materials.courses.map((course: any, i: number) => (
                                  <div key={i} className="bg-white/5 p-3 rounded-lg space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Trophy className="w-4 h-4 text-purple-400" />
                                      <span className="text-gray-300">
                                        {course.title}
                                      </span>
                                    </div>
                                    {(course.type || course.note) && (
                                      <p className="text-sm text-gray-400 ml-6">
                                        {course.type && <span className="text-purple-400">{course.type}</span>}
                                        {course.type && course.note && ' - '}
                                        {course.note}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {level.learning_materials.youtube_channels && level.learning_materials.youtube_channels.length > 0 && (
                            <div className="space-y-4 mt-6">
                              <h5 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Youtube className="w-4 h-4" />
                                Relevante Youtube channels
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {level.learning_materials.youtube_channels.map((channel: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                                  >
                                    {channel}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {level.assessment && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Toetsing
                          </h4>
                          <div className="bg-white/5 p-4 rounded-lg space-y-4">
                            <p className="text-gray-300">{level.assessment.main_task}</p>
                            
                            {level.assessment.focus_points && level.assessment.focus_points.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-400">Focus punten</h5>
                                <ul className="grid gap-2">
                                  {level.assessment.focus_points.map((point: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300">
                                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {level.assessment.presentation && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-400">
                                  Presentatie ({level.assessment.presentation.duration})
                                </h5>
                                <div className="space-y-2">
                                  {level.assessment.presentation.components && level.assessment.presentation.components.map((component: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">
                                        {i + 1}
                                      </div>
                                      <div>
                                        <p className="text-gray-300">{component.type}</p>
                                        <p className="text-sm text-gray-400">
                                          {component.duration} - {component.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {level.rewards_extended && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                            <Gift className="w-4 h-4" />
                            Beloning
                          </h4>
                          <div className="grid gap-4">
                            {(level.rewards_extended.recognition || level.rewards_extended.skills) && (
                              <div className="bg-white/5 p-4 rounded-lg space-y-2">
                                {level.rewards_extended.recognition && (
                                  <p className="text-gray-300">{level.rewards_extended.recognition}</p>
                                )}
                                {level.rewards_extended.skills && (
                                  <p className="text-purple-400">{level.rewards_extended.skills}</p>
                                )}
                              </div>
                            )}

                            {level.rewards_extended.toolkit && level.rewards_extended.toolkit.items && level.rewards_extended.toolkit.items.length > 0 && (
                              <div className="bg-white/5 p-4 rounded-lg space-y-3">
                                <h5 className="text-sm font-medium text-gray-300">
                                  {level.rewards_extended.toolkit.title}
                                </h5>
                                <ul className="grid gap-2">
                                  {level.rewards_extended.toolkit.items.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300">
                                      <Sparkles className="w-4 h-4 text-purple-400" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {level.rewards_extended.gift && (
                              <div className="bg-white/5 p-4 rounded-lg space-y-2">
                                {level.rewards_extended.gift.amount && (
                                  <p className="text-gray-300">
                                    {level.rewards_extended.gift.amount} cadeaubon
                                  </p>
                                )}
                                {level.rewards_extended.gift.options && level.rewards_extended.gift.options.length > 0 && (
                                  <div className="flex gap-2">
                                    {level.rewards_extended.gift.options.map((option: string, i: number) => (
                                      <span
                                        key={i}
                                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                                      >
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {level.rewards_extended.certificate && (
                              <div className="bg-white/5 p-4 rounded-lg">
                                {level.rewards_extended.certificate.title && (
                                  <p className="text-gray-300">
                                    {level.rewards_extended.certificate.title}
                                  </p>
                                )}
                                {level.rewards_extended.certificate.formats && level.rewards_extended.certificate.formats.length > 0 && (
                                  <div className="flex gap-2 mt-2">
                                    {level.rewards_extended.certificate.formats.map((format: string, i: number) => (
                                      <span
                                        key={i}
                                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                                      >
                                        {format}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </LevelEditor>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PathLevels;