// TagInput.tsx
import { useState } from "react";
import { X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}

export default function TagInput({ tags, setTags, placeholder, suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="relative">
      <div className="min-h-12 p-2 border border-gray-200 rounded-xl bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              {tag}
              <button onClick={() => removeTag(i)} className="ml-1 hover:text-indigo-900">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input) {
                e.preventDefault();
                addTag(input);
              }
              if (e.key === "Escape") {
                setShowSuggestions(false);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            className="flex-1 min-w-30 outline-none text-sm py-1 px-2 bg-transparent"
          />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center gap-2"
            >
              <Search className="w-3 h-3 text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}