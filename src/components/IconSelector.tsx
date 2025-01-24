import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

// Pre-selected common icons
const COMMON_ICONS = [
  'Code', 'Palette', 'Search', 'LineChart', 'Users', 'Book', 'BookOpen',
  'Briefcase', 'Building', 'Camera', 'ChartBar', 'CheckCircle', 'Clock',
  'Cloud', 'Cog', 'Command', 'Crown', 'Database', 'Flag', 'Flask',
  'Globe', 'Heart', 'Home', 'Image', 'Key', 'Link', 'Mail',
  'Map', 'Phone', 'Shield', 'Star', 'Target', 'Trophy'
];

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the current icon component
  const CurrentIcon = Icons[value as keyof typeof Icons] || Icons.Code;

  return (
    <div className="relative">
      <button 
        type="button"
        className={cn(
          "w-full flex items-center gap-2 p-2 bg-dark-300 rounded-lg",
          "border border-white/10 hover:border-purple-500/50 transition-colors"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CurrentIcon className="w-5 h-5" />
        <span className="text-sm flex-1 text-left">{value}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[999]",
            "p-4 bg-dark-200 rounded-xl shadow-xl",
            "w-[300px] max-h-[400px] overflow-y-auto grid grid-cols-4 gap-2",
            "border border-white/10"
          )}>
            {COMMON_ICONS.map((iconName) => {
              const Icon = Icons[iconName as keyof typeof Icons];
              if (!Icon) return null;
              
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "p-3 rounded-lg flex flex-col items-center gap-1",
                    "hover:bg-white/5 transition-colors",
                    value === iconName && "bg-purple-500/20 text-purple-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs truncate w-full text-center">
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};