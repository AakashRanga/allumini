import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

interface SearchableDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function SearchableDropdown({
  label,
  options,
  selectedValue,
  onChange,
  placeholder = "Select...",
  icon,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect whether we should open upward or downward based on viewport spacing
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If space below is less than 260px (approx height of options list),
      // and there's more space above than below, open upward.
      if (spaceBelow < 260 && rect.top > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs font-semibold text-gray-500 mb-1.5 block flex items-center gap-1.5 uppercase tracking-wider">
        {icon}
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setSearchQuery(""); // Reset search query on open
          }}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-left text-gray-800 hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:bg-white transition-all cursor-pointer"
        >
          <span className={`truncate ${selectedValue ? "text-gray-900 font-medium" : "text-gray-400"}`}>
            {selectedValue || placeholder}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {selectedValue && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-0.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && (
          <div className={`absolute z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col max-h-60 overflow-hidden transform transition-all ${
            openUpward ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
          }`}>
            {/* Search Input */}
            <div className="relative p-2.5 border-b border-gray-100 bg-gray-50/50">
              <Search className="absolute left-5.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto py-1.5 flex-1 max-h-44">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400 text-center">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer flex items-center justify-between ${
                      selectedValue === option
                        ? "bg-blue-50 text-[#0A66C2] font-semibold"
                        : "text-gray-700 hover:bg-gray-55"
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {selectedValue === option && (
                      <span className="w-1.5 h-1.5 bg-[#0A66C2] rounded-full"></span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
