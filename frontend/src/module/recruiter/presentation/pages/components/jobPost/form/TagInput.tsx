import { useState, useRef, useEffect } from "react";
import { X, Plus, Sparkles } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
  color?: "indigo" | "violet";
}

export default function TagInput({
  tags,
  setTags,
  placeholder,
  suggestions = [],
  color = "indigo",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colorMap = {
    indigo: {
      tag: "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100",
      remove: "hover:bg-indigo-200 text-indigo-500 hover:text-indigo-700",
      ring: "ring-2 ring-indigo-100 border-indigo-400",
      suggestion: "hover:bg-indigo-50 hover:text-indigo-700",
      pill: "bg-indigo-500",
    },
    violet: {
      tag: "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100",
      remove: "hover:bg-violet-200 text-violet-500 hover:text-violet-700",
      ring: "ring-2 ring-violet-100 border-violet-400",
      suggestion: "hover:bg-violet-50 hover:text-violet-700",
      pill: "bg-violet-500",
    },
  };

  const c = colorMap[color];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mt-2">
      {/* Main Input Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[52px] p-3 border-2 rounded-2xl bg-white cursor-text transition-all duration-200 ${
          focused
            ? `${c.ring} shadow-sm`
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium transition-all duration-150 ${c.tag}`}
              style={{ animation: "tagIn 0.15s ease-out" }}
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(i);
                }}
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-150 ${c.remove}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setFocused(true);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                e.preventDefault();
                addTag(input);
              }
              if (e.key === "Backspace" && !input && tags.length > 0) {
                removeTag(tags.length - 1);
              }
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            className="flex-1 min-w-[120px] outline-none text-sm py-0.5 px-1 bg-transparent text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-400 mt-1.5 ml-1">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded-md text-gray-500 text-xs font-mono">Enter</kbd> to add · <kbd className="px-1.5 py-0.5 bg-gray-100 rounded-md text-gray-500 text-xs font-mono">Backspace</kbd> to remove last
      </p>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/80 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Suggestions</span>
          </div>
          <div className="p-2 max-h-52 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(suggestion);
                  }}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200 transition-all duration-150 ${c.suggestion}`}
                >
                  <Plus className="w-3 h-3" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tagIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}