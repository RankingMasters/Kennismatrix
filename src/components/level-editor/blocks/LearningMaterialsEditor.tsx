import React from 'react';
import { Book, ChevronDown, Plus, Minus, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface LearningMaterialsEditorProps {
  value: any;
  onChange: (value: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const LearningMaterialsEditor: React.FC<LearningMaterialsEditorProps> = ({
  value = { technieken: [], tools: [], courses: [], youtube_channels: [] },
  onChange,
  isExpanded,
  onToggle
}) => {
  const addTechnique = () => {
    onChange({
      ...value,
      technieken: [...(value.technieken || []), '']
    });
  };

  const addTool = () => {
    onChange({
      ...value,
      tools: [...(value.tools || []), { name: '', url: '' }]
    });
  };

  const addCourse = () => {
    onChange({
      ...value,
      courses: [...(value.courses || []), { title: '', type: '', note: '', url: '' }]
    });
  };

  const addYoutubeChannel = () => {
    onChange({
      ...value,
      youtube_channels: [...(value.youtube_channels || []), '']
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
          <Book className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Learning Materials</span>
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
            {/* Techniques */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Techniques</h4>
                <button
                  onClick={addTechnique}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {value.technieken?.map((technique: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={technique}
                      onChange={e => {
                        const newTechniques = [...value.technieken];
                        newTechniques[index] = e.target.value;
                        onChange({ ...value, technieken: newTechniques });
                      }}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Enter technique"
                    />
                    <button
                      onClick={() => {
                        const newTechniques = value.technieken.filter((_: any, i: number) => i !== index);
                        onChange({ ...value, technieken: newTechniques });
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Tools</h4>
                <button
                  onClick={addTool}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {value.tools?.map((tool: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tool.name}
                      onChange={e => {
                        const newTools = [...value.tools];
                        newTools[index] = { ...tool, name: e.target.value };
                        onChange({ ...value, tools: newTools });
                      }}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Tool name"
                    />
                    <input
                      type="url"
                      value={tool.url}
                      onChange={e => {
                        const newTools = [...value.tools];
                        newTools[index] = { ...tool, url: e.target.value };
                        onChange({ ...value, tools: newTools });
                      }}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Tool URL"
                    />
                    <button
                      onClick={() => {
                        const newTools = value.tools.filter((_: any, i: number) => i !== index);
                        onChange({ ...value, tools: newTools });
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">Courses</h4>
                <button
                  onClick={addCourse}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {value.courses?.map((course: any, index: number) => (
                  <div key={index} className="bg-white/5 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={course.title}
                        onChange={e => {
                          const newCourses = [...value.courses];
                          newCourses[index] = { ...course, title: e.target.value };
                          onChange({ ...value, courses: newCourses });
                        }}
                        className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                        placeholder="Course title"
                      />
                      <button
                        onClick={() => {
                          const newCourses = value.courses.filter((_: any, i: number) => i !== index);
                          onChange({ ...value, courses: newCourses });
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400 ml-2"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={course.type}
                        onChange={e => {
                          const newCourses = [...value.courses];
                          newCourses[index] = { ...course, type: e.target.value };
                          onChange({ ...value, courses: newCourses });
                        }}
                        className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                        placeholder="Course type"
                      />
                      <input
                        type="text"
                        value={course.note}
                        onChange={e => {
                          const newCourses = [...value.courses];
                          newCourses[index] = { ...course, note: e.target.value };
                          onChange({ ...value, courses: newCourses });
                        }}
                        className="bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                        placeholder="Additional note"
                      />
                    </div>

                    <input
                      type="url"
                      value={course.url}
                      onChange={e => {
                        const newCourses = [...value.courses];
                        newCourses[index] = { ...course, url: e.target.value };
                        onChange({ ...value, courses: newCourses });
                      }}
                      className="w-full bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Course URL"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* YouTube Channels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-medium text-gray-400">YouTube Channels</h4>
                </div>
                <button
                  onClick={addYoutubeChannel}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-purple-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {value.youtube_channels?.map((channel: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={channel}
                      onChange={e => {
                        const newChannels = [...value.youtube_channels];
                        newChannels[index] = e.target.value;
                        onChange({ ...value, youtube_channels: newChannels });
                      }}
                      className="flex-1 bg-dark-300 rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-purple-500 transition-colors"
                      placeholder="Enter YouTube channel name"
                    />
                    <button
                      onClick={() => {
                        const newChannels = value.youtube_channels.filter((_: any, i: number) => i !== index);
                        onChange({ ...value, youtube_channels: newChannels });
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
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

export default LearningMaterialsEditor;