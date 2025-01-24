import React from 'react';
import { CheckCircle2, ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface ProcessEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const ProcessEditor: React.FC<ProcessEditorProps> = ({
  value = [],
  onChange,
  isExpanded,
  onToggle
}) => {
  const addStep = () => {
    onChange([...value, '']);
  };

  const removeStep = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, newValue: string) => {
    const newSteps = [...value];
    newSteps[index] = newValue;
    onChange(newSteps);
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
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Process Steps</span>
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
            className="space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-400">Steps</h4>
              <button
                onClick={addStep}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {value.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={step}
                    onChange={e => updateStep(index, e.target.value)}
                    className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                    placeholder="Enter process step"
                  />
                  <button
                    onClick={() => removeStep(index)}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProcessEditor;