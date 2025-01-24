import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, X, Plus, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import TimeInvestmentEditor from './blocks/TimeInvestmentEditor';
import LearningMaterialsEditor from './blocks/LearningMaterialsEditor';
import AssessmentEditor from './blocks/AssessmentEditor';
import RewardsEditor from './blocks/RewardsEditor';
import ProcessEditor from './blocks/ProcessEditor';
import { cn } from '../../lib/utils';

interface LevelEditorProps {
  level: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onMove?: (direction: 'up' | 'down') => Promise<void>;
  isFirst?: boolean;
  isLast?: boolean;
  children?: React.ReactNode;
}

const LevelEditor: React.FC<LevelEditorProps> = ({
  level,
  isEditing,
  onSave,
  onDelete,
  onDuplicate,
  onMove,
  isFirst,
  isLast,
  children
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedData, setEditedData] = useState(level);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await onSave(editedData);
      setIsEditable(false);
    } catch (error) {
      console.error('Failed to save level:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(level);
    setIsEditable(false);
    setActiveSection(null);
  };

  if (!isEditing) {
    return children;
  }

  return (
    <div className="relative group">
      {onMove && (
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMove('up')}
            disabled={isFirst}
            className={cn(
              "p-2 rounded-lg hover:bg-white/5 transition-colors",
              isFirst && "opacity-50 cursor-not-allowed"
            )}
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={isLast}
            className={cn(
              "p-2 rounded-lg hover:bg-white/5 transition-colors",
              isLast && "opacity-50 cursor-not-allowed"
            )}
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {isEditable ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="level-card space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <input
              type="text"
              value={editedData.title}
              onChange={e => setEditedData({ ...editedData, title: e.target.value })}
              className="w-full bg-dark-300 rounded-lg px-4 py-2 outline-none border border-white/10 focus:border-purple-500 transition-colors text-xl font-semibold text-white"
              placeholder="Level title"
            />
            <textarea
              value={editedData.description}
              onChange={e => setEditedData({ ...editedData, description: e.target.value })}
              className="w-full bg-dark-300 rounded-lg px-4 py-2 outline-none border border-white/10 focus:border-purple-500 transition-colors min-h-[100px] resize-none text-gray-100"
              placeholder="Short description"
            />
            <textarea
              value={editedData.description_extended}
              onChange={e => setEditedData({ ...editedData, description_extended: e.target.value })}
              className="w-full bg-dark-300 rounded-lg px-4 py-2 outline-none border border-white/10 focus:border-purple-500 transition-colors min-h-[150px] resize-none text-gray-100"
              placeholder="Extended description"
            />
          </div>

          {/* Content Blocks */}
          <div className="space-y-4">
            <ProcessEditor
              value={editedData.process}
              onChange={process => setEditedData({ ...editedData, process })}
              isExpanded={activeSection === 'process'}
              onToggle={() => setActiveSection(activeSection === 'process' ? null : 'process')}
            />

            <TimeInvestmentEditor
              value={editedData.time_investment}
              onChange={time_investment => setEditedData({ ...editedData, time_investment })}
              isExpanded={activeSection === 'time'}
              onToggle={() => setActiveSection(activeSection === 'time' ? null : 'time')}
            />

            <LearningMaterialsEditor
              value={editedData.learning_materials}
              onChange={learning_materials => setEditedData({ ...editedData, learning_materials })}
              isExpanded={activeSection === 'materials'}
              onToggle={() => setActiveSection(activeSection === 'materials' ? null : 'materials')}
            />

            <AssessmentEditor
              value={editedData.assessment}
              onChange={assessment => setEditedData({ ...editedData, assessment })}
              isExpanded={activeSection === 'assessment'}
              onToggle={() => setActiveSection(activeSection === 'assessment' ? null : 'assessment')}
            />

            <RewardsEditor
              value={editedData.rewards_extended}
              onChange={rewards_extended => setEditedData({ ...editedData, rewards_extended })}
              isExpanded={activeSection === 'rewards'}
              onToggle={() => setActiveSection(activeSection === 'rewards' ? null : 'rewards')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-green-400"
              title="Save changes"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="relative">
          {children}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDuplicate()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
              title="Duplicate level"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditable(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Edit level"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
              title="Delete level"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelEditor;