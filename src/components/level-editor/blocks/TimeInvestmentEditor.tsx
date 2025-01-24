import React, { useState, useCallback, useEffect } from 'react';
import { Clock, ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { debounce } from 'lodash';

interface TimeInvestmentEditorProps {
  value: any;
  onChange: (value: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const TimeInvestmentEditor: React.FC<TimeInvestmentEditorProps> = ({
  value = { breakdown: {}, totals: {} },
  onChange,
  isExpanded,
  onToggle
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedUpdate = useCallback(
    debounce((newValue: any) => {
      onChange(newValue);
    }, 3000),
    [onChange]
  );

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    debouncedUpdate(newValue);
  };

  const addBreakdownItem = () => {
    const newKey = `new_item_${Date.now()}`;
    handleChange({
      ...localValue,
      breakdown: { ...localValue.breakdown, [newKey]: '0 hours' }
    });
    setTempKeys({ ...tempKeys, [newKey]: newKey });
  };

  const removeBreakdownItem = (key: string) => {
    const newBreakdown = { ...localValue.breakdown };
    delete newBreakdown[key];
    handleChange({ ...localValue, breakdown: newBreakdown });
    
    const newTempKeys = { ...tempKeys };
    delete newTempKeys[key];
    setTempKeys(newTempKeys);
  };

  const updateBreakdownKey = (key: string, newValue: string) => {
    setTempKeys({ ...tempKeys, [key]: newValue });
  };

  const finalizeBreakdownKey = (oldKey: string) => {
    const newKey = tempKeys[oldKey];
    if (newKey && newKey !== oldKey) {
      const newBreakdown = { ...localValue.breakdown };
      const value = newBreakdown[oldKey];
      delete newBreakdown[oldKey];
      newBreakdown[newKey] = value;
      handleChange({ ...localValue, breakdown: newBreakdown });
    }
  };

  const updateBreakdownValue = (key: string, newValue: string) => {
    handleChange({
      ...localValue,
      breakdown: {
        ...localValue.breakdown,
        [key]: newValue
      }
    });
  };

  const addRole = () => {
    const newKey = `new_role_${Date.now()}`;
    handleChange({
      ...localValue,
      totals: {
        ...localValue.totals,
        [newKey]: { total: '0 hours', details: {} }
      }
    });
    setTempKeys({ ...tempKeys, [newKey]: newKey });
  };

  const removeRole = (role: string) => {
    const newTotals = { ...localValue.totals };
    delete newTotals[role];
    handleChange({ ...localValue, totals: newTotals });
    
    const newTempKeys = { ...tempKeys };
    delete newTempKeys[role];
    setTempKeys(newTempKeys);
  };

  const updateRoleKey = (key: string, newValue: string) => {
    setTempKeys({ ...tempKeys, [key]: newValue });
  };

  const finalizeRoleKey = (oldKey: string) => {
    const newKey = tempKeys[oldKey];
    if (newKey && newKey !== oldKey) {
      const newTotals = { ...localValue.totals };
      const roleData = newTotals[oldKey];
      delete newTotals[oldKey];
      newTotals[newKey] = roleData;
      handleChange({ ...localValue, totals: newTotals });
    }
  };

  const updateRoleTotal = (role: string, total: string) => {
    handleChange({
      ...localValue,
      totals: {
        ...localValue.totals,
        [role]: {
          ...localValue.totals[role],
          total
        }
      }
    });
  };

  const addRoleDetail = (role: string) => {
    const newKey = `new_detail_${Date.now()}`;
    const roleData = localValue.totals[role] || { total: '0 hours', details: {} };
    handleChange({
      ...localValue,
      totals: {
        ...localValue.totals,
        [role]: {
          ...roleData,
          details: {
            ...roleData.details,
            [newKey]: '0 hours'
          }
        }
      }
    });
    setTempKeys({ ...tempKeys, [`${role}-${newKey}`]: newKey });
  };

  const removeRoleDetail = (role: string, detailKey: string) => {
    const newDetails = { ...localValue.totals[role].details };
    delete newDetails[detailKey];
    handleChange({
      ...localValue,
      totals: {
        ...localValue.totals,
        [role]: {
          ...localValue.totals[role],
          details: newDetails
        }
      }
    });
    
    const newTempKeys = { ...tempKeys };
    delete newTempKeys[`${role}-${detailKey}`];
    setTempKeys(newTempKeys);
  };

  const updateRoleDetailKey = (role: string, key: string, newValue: string) => {
    setTempKeys({ ...tempKeys, [`${role}-${key}`]: newValue });
  };

  const finalizeRoleDetailKey = (role: string, oldKey: string) => {
    const newKey = tempKeys[`${role}-${oldKey}`];
    if (newKey && newKey !== oldKey) {
      const newDetails = { ...localValue.totals[role].details };
      const value = newDetails[oldKey];
      delete newDetails[oldKey];
      newDetails[newKey] = value;
      handleChange({
        ...localValue,
        totals: {
          ...localValue.totals,
          [role]: {
            ...localValue.totals[role],
            details: newDetails
          }
        }
      });
    }
  };

  const updateRoleDetailValue = (role: string, key: string, newValue: string) => {
    handleChange({
      ...localValue,
      totals: {
        ...localValue.totals,
        [role]: {
          ...localValue.totals[role],
          details: {
            ...localValue.totals[role].details,
            [key]: newValue
          }
        }
      }
    });
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
          <Clock className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Time Investment</span>
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
            {/* Breakdown Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Breakdown</h4>
                <button
                  onClick={addBreakdownItem}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(localValue.breakdown || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempKeys[key] || key}
                      onChange={e => updateBreakdownKey(key, e.target.value)}
                      onBlur={() => finalizeBreakdownKey(key)}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white"
                      placeholder="Activity name"
                    />
                    <input
                      type="text"
                      value={val as string}
                      onChange={e => updateBreakdownValue(key, e.target.value)}
                      className="w-32 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white"
                      placeholder="Duration"
                    />
                    <button
                      onClick={() => removeBreakdownItem(key)}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Role Totals</h4>
                <button
                  onClick={addRole}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(localValue.totals || {}).map(([role, data]: [string, any]) => (
                  <div key={role} className="bg-white/5 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={tempKeys[role] || role}
                        onChange={e => updateRoleKey(role, e.target.value)}
                        onBlur={() => finalizeRoleKey(role)}
                        className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white"
                        placeholder="Role name"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={data.total}
                          onChange={e => updateRoleTotal(role, e.target.value)}
                          className="w-32 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white"
                          placeholder="Total hours"
                        />
                        <button
                          onClick={() => removeRole(role)}
                          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Role Details */}
                    <div className="space-y-2">
                      {Object.entries(data.details || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempKeys[`${role}-${key}`] || key}
                            onChange={e => updateRoleDetailKey(role, key, e.target.value)}
                            onBlur={() => finalizeRoleDetailKey(role, key)}
                            className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white"
                            placeholder="Detail name"
                          />
                          <input
                            type="text"
                            value={value as string}
                            onChange={e => updateRoleDetailValue(role, key, e.target.value)}
                            className="w-32 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors text-white"
                            placeholder="Hours"
                          />
                          <button
                            onClick={() => removeRoleDetail(role, key)}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addRoleDetail(role)}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        + Add Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeInvestmentEditor;