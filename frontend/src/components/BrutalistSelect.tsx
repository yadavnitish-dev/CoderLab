import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface BrutalistSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  placeholder?: string;
  className?: string;
}

const BrutalistSelect: React.FC<BrutalistSelectProps> = ({
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = "Select...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 w-full bg-black border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-none transition-none text-sm font-semibold text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black ${isOpen ? 'border-zinc-500' : ''}`}
      >
        {Icon && <Icon className="size-4 text-zinc-400 shrink-0" />}
        <span className="flex-1 text-left truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-4 text-zinc-400 transition-none ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-black border border-zinc-800 rounded-none shadow-none z-[100] transition-none">
          <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-none flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-500 border-l-2 border-emerald-500'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-l-2 border-transparent'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="size-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrutalistSelect;
