'use client';

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}

export default function TagInput({ tags, setTags, placeholder, suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="relative">
      <div className="min-h-[48px] p-2 border border-gray-200 rounded-xl bg-white focus-within:border-indigo-500">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700">
              {tag}
              <button onClick={() => removeTag(i)} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input && (e.preventDefault(), addTag(input))}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            className="flex-1 min-w-[120px] outline-none text-sm py-1 px-2 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}