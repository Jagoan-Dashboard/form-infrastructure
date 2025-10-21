import { useEffect, useRef, useState, useMemo } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  onSearch?: (query: string) => string[];
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Cari...",
  emptyMessage = "Tidak ada hasil",
  className = "",
  disabled = false,
  onSearch,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let result = options;
    
    if (onSearch) {
      result = onSearch(searchQuery);
    } else if (query) {
      result = options.filter(option => 
        option.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [options, searchQuery, onSearch]);

  const handleSelect = (option: string) => {
    onValueChange(option);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setSearchQuery("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={cn("relative w-full", className)} 
      ref={containerRef}
    >
      <div 
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-sm border rounded-xl cursor-pointer",
          "bg-white border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="truncate">
          {value || (
            <span className="text-gray-400">
              {placeholder}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {value && (
            <button 
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", {
            "transform rotate-180": isOpen
          })} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-2">
            <Input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-2"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              <ul>
                {filteredOptions.map((option: string, index: number) => (
                  <li
                    key={index}
                    className={cn(
                      "px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between",
                      value === option && "bg-blue-50 text-blue-700"
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="truncate">{option}</span>
                    {value === option && <Check className="w-4 h-4 text-blue-600" />}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
