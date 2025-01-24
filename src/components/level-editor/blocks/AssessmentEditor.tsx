import React from 'react';
import { Target, ChevronDown, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface AssessmentEditorProps {
  value: any;
  onChange: (value: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const AssessmentEditor: React.FC<AssessmentEditorProps> = ({
  value = { focus_points: [], presentation: { components: [] } },
  onChange,
  isExpanded,
  onToggle
}) => {
  const addFocusPoint = () => {
    onChange({
      ...value,
      focus_points: [...(value.focus_points || []), '']
    });
  };

  const addPresentationComponent = () => {
    const newPresentation = {
      ...value.presentation,
      components: [
        ...(value.presentation?.components || []),
        { type: '', duration: '', description: '' }
      ]
    };
    onChange({ ...value, presentation: newPresentation });
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-lg",
          "bg-white/5 hover:bg-white/10 transition-colors"
        )}
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Assessment</span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Main Task */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">Main Task</h4>
              <textarea
                value={value.main_task || ''}
                onChange={e => onChange({ ...value, main_task: e.target.value })}
                className="w-full bg-dark-300 rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-purple-500 transition-colors min-h-[100px] resize-none"
                placeholder="Describe the main assessment task"
              />
            </div>

            {/* Focus Points */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-medium text-gray-400">Focus Points</h4>
                </div>
                <button
                  onClick={addFocusPoint}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {value.focus_points?.map((point: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={e => {
                        const newPoints = [...value.focus_points];
                        newPoints[index] = e.target.value;
                        onChange({ ...value, focus_points: newPoints });
                      }}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Enter focus point"
                    />
                    <button
                      onClick={() => {
                        const newPoints = value.focus_points.filter((_: any, i: number) => i !== index);
                        onChange({ ...value, focus_points: newPoints });
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Presentation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Presentation</h4>
                <button
                  onClick={addPresentationComponent}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Duration:</span>
                  <input
                    type="text"
                    value={value.presentation?.duration || ''}
                    onChange={e => {
                      const newPresentation = {
                        ...value.presentation,
                        duration: e.target.value
                      };
                      onChange({ ...value, presentation: newPresentation });
                    }}
                    className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                    placeholder="e.g., 30-50 minutes"
                  />
                </div>

                <div className="space-y-4">
                  {value.presentation?.components?.map((component: any, index: number) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={component.type}
                          onChange={e => {
                            const newComponents = [...value.presentation.components];
                            newComponents[index] = { ...component, type: e.target.value };
                            onChange({
                              ...value,
                              presentation: { ...value.presentation, components: newComponents }
                            });
                          }}
                          className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                          placeholder="Component type"
                        />
                        <button
                          onClick={() => {
                            const newComponents = value.presentation.components.filter((_: any, i: number) => i !== index);
                            onChange({
                              ...value,
                              presentation: { ...value.presentation, components: newComponents }
                            });
                          }}
                          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400 ml-2"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={component.duration}
                          onChange={e => {
                            const newComponents = [...value.presentation.components];
                            newComponents[index] = { ...component, duration: e.target.value };
                            onChange({
                              ...value,
                              presentation: { ...value.presentation, components: newComponents }
                            });
                          }}
                          className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                          placeholder="Duration"
                        />
                        <input
                          type="text"
                          value={component.description}
                          onChange={e => {
                            const newComponents = [...value.presentation.components];
                            newComponents[index] = { ...component, description: e.target.value };
                            onChange({
                              ...value,
                              presentation: { ...value.presentation, components: newComponents }
                            });
                          }}
                          className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssessmentEditor;