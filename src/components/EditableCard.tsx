import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { IconSelector } from './IconSelector';
import { cn } from '../lib/utils';

interface EditableField {
  label: string;
  name: string;
  type: string;
  value: any;
  min?: number;
  placeholder?: string;
}

interface EditableCardProps {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  isEditing: boolean;
  onSave: (data: { title: string; description: string; icon?: string; color?: string; hours?: number }) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  additionalFields?: EditableField[];
}

const AVAILABLE_COLORS = [
  { name: 'Purple to Pink', value: 'from-purple-500 to-pink-500' },
  { name: 'Blue to Cyan', value: 'from-blue-500 to-cyan-500' },
  { name: 'Green to Emerald', value: 'from-green-500 to-emerald-500' },
  { name: 'Orange to Red', value: 'from-orange-500 to-red-500' },
  { name: 'Indigo to Purple', value: 'from-indigo-500 to-purple-500' }
];

const EditableCard: React.FC<EditableCardProps> = ({
  title,
  description,
  icon,
  color,
  isEditing,
  onSave,
  onDelete,
  children,
  additionalFields = []
}) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedIcon, setEditedIcon] = useState(icon);
  const [editedColor, setEditedColor] = useState(color);
  const [isEditable, setIsEditable] = useState(false);
  const [additionalValues, setAdditionalValues] = useState<Record<string, any>>(
    additionalFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.value
    }), {})
  );

  const handleSave = () => {
    onSave({
      title: editedTitle,
      description: editedDescription,
      ...(icon !== undefined && { icon: editedIcon }),
      ...(color !== undefined && { color: editedColor }),
      ...additionalValues
    });
    setIsEditable(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedDescription(description);
    setEditedIcon(icon);
    setEditedColor(color);
    setAdditionalValues(
      additionalFields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.value
      }), {})
    );
    setIsEditable(false);
  };

  if (!isEditing) {
    return children;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group relative"
    >
      {isEditable ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            className={cn(
              "w-full bg-dark-300 rounded-lg px-4 py-2 outline-none",
              "border border-white/10 focus:border-purple-500 transition-colors"
            )}
            placeholder="Enter title"
          />
          
          <textarea
            value={editedDescription}
            onChange={e => setEditedDescription(e.target.value)}
            className={cn(
              "w-full bg-dark-300 rounded-lg px-4 py-2 outline-none",
              "border border-white/10 focus:border-purple-500 transition-colors",
              "min-h-[100px] resize-none"
            )}
            placeholder="Enter description"
          />

          {icon !== undefined && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Icon</label>
              <IconSelector value={editedIcon || 'Code'} onChange={setEditedIcon} />
            </div>
          )}

          {color !== undefined && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Color Scheme</label>
              <select
                value={editedColor}
                onChange={e => setEditedColor(e.target.value)}
                className={cn(
                  "w-full bg-dark-300 rounded-lg px-4 py-2 outline-none",
                  "border border-white/10 focus:border-purple-500 transition-colors"
                )}
              >
                {AVAILABLE_COLORS.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {additionalFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm text-gray-400">{field.label}</label>
              <input
                type={field.type}
                value={additionalValues[field.name]}
                onChange={e => setAdditionalValues(prev => ({
                  ...prev,
                  [field.name]: e.target.value
                }))}
                min={field.min}
                placeholder={field.placeholder}
                className={cn(
                  "w-full bg-dark-300 rounded-lg px-4 py-2 outline-none",
                  "border border-white/10 focus:border-purple-500 transition-colors"
                )}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-green-400"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {children}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditable(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EditableCard;