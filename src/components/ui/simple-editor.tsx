import { useRef } from "react";
import { Textarea } from "./textarea";

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function SimpleEditor({
  value,
  onChange,
  placeholder = "",
  rows = 4,
}: SimpleEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="min-h-[100px] resize-none"
    />
  );
}
