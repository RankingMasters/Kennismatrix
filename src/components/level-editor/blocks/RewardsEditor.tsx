import React from 'react';
import { Gift, ChevronDown, Plus, Minus, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface RewardsEditorProps {
  value: any;
  onChange: (value: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const RewardsEditor: React.FC<RewardsEditorProps> = ({
  value = {
    recognition: '',
    skills: '',
    toolkit: { items: [] },
    gift: { options: [] },
    certificate: { formats: [] }
  },
  onChange,
  isExpanded,
  onToggle
}) => {
  const addToolkitItem = () => {
    const newToolkit = {
      ...value.toolkit,
      items: [...(value.toolkit?.items || []), '']
    };
    onChange({ ...value, toolkit: newToolkit });
  };

  const addGiftOption = () => {
    const newGift = {
      ...value.gift,
      options: [...(value.gift?.options || []), '']
    };
    onChange({ ...value, gift: newGift });
  };

  const addCertificateFormat = () => {
    const newCertificate = {
      ...value.certificate,
      formats: [...(value.certificate?.formats || []), '']
    };
    onChange({ ...value, certificate: newCertificate });
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
          <Gift className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Rewards</span>
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
            {/* Recognition & Skills */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Recognition</h4>
                <input
                  type="text"
                  value={value.recognition || ''}
                  onChange={e => onChange({ ...value, recognition: e.target.value })}
                  className="w-full bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                  placeholder="Enter recognition"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Skills</h4>
                <input
                  type="text"
                  value={value.skills || ''}
                  onChange={e => onChange({ ...value, skills: e.target.value })}
                  className="w-full bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                  placeholder="Enter skills gained"
                />
              </div>
            </div>

            {/* Toolkit */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Toolkit</h4>
                <button
                  onClick={addToolkitItem}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={value.toolkit?.title || ''}
                onChange={e => onChange({
                  ...value,
                  toolkit: { ...value.toolkit, title: e.target.value }
                })}
                className="w-full bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                placeholder="Toolkit title"
              />

              <div className="space-y-2">
                {value.toolkit?.items?.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const newItems = [...value.toolkit.items];
                        newItems[index] = e.target.value;
                        onChange({
                          ...value,
                          toolkit: { ...value.toolkit, items: newItems }
                        });
                      }}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Enter toolkit item"
                    />
                    <button
                      onClick={() => {
                        const newItems = value.toolkit.items.filter((_: any, i: number) => i !== index);
                        onChange({
                          ...value,
                          toolkit: { ...value.toolkit, items: newItems }
                        });
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400">Gift</h4>
              
              <div>
                <input
                  type="text"
                  value={value.gift?.amount || ''}
                  onChange={e => onChange({
                    ...value,
                    gift: { ...value.gift, amount: e.target.value }
                  })}
                  className="w-full bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                  placeholder="Gift amount"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Options</span>
                  <button
                    onClick={addGiftOption}
                    className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {value.gift?.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={option}
                        onChange={e => {
                          const newOptions = [...value.gift.options];
                          newOptions[index] = e.target.value;
                          onChange({
                            ...value,
                            gift: { ...value.gift, options: newOptions }
                          });
                        }}
                        className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                        placeholder="Gift option"
                      />
                      <button
                        onClick={() => {
                          const newOptions = value.gift.options.filter((_: any, i: number) => i !== index);
                          onChange({
                            ...value,
                            gift: { ...value.gift, options: newOptions }
                          });
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificate */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium text-gray-400">Certificate</h4>
              </div>

              <input
                type="text"
                value={value.certificate?.title || ''}
                onChange={e => onChange({
                  ...value,
                  certificate: { ...value.certificate, title: e.target.value }
                })}
                className="w-full bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                placeholder="Certificate title"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Formats</span>
                  <button
                    onClick={addCertificateFormat}
                    className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {value.certificate?.formats?.map((format: string, index: number) => (
                    <div key={index} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={format}
                        onChange={e => {
                          const newFormats = [...value.certificate.formats];
                          newFormats[index] = e.target.value;
                          onChange({
                            ...value,
                            certificate: { ...value.certificate, formats: newFormats }
                          });
                        }}
                        className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                        placeholder="Format"
                      />
                      <button
                        onClick={() => {
                          const newFormats = value.certificate.formats.filter((_: any, i: number) => i !== index);
                          onChange({
                            ...value,
                            certificate: { ...value.certificate, formats: newFormats }
                          });
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
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

export default RewardsEditor;