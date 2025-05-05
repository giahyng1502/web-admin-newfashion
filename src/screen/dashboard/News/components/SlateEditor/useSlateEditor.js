import { useMemo, useRef, useState, useEffect } from "react";
import { createEditor } from "slate";
import { withReact } from "slate-react";

export const EMPTY_PARAGRAPH = [
  { type: "paragraph", children: [{ text: "" }] },
];

export function useSlateEditor(initialContent) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const selectionRef = useRef(null);
  const containerRef = useRef(null);

  const normalizeInitialContent = (content) => {
    if (!content) {
      return EMPTY_PARAGRAPH;
    }
    if (typeof content === "string") {
      return [
        {
          type: "paragraph",
          children: [{ text: content }],
        },
      ];
    }
    if (Array.isArray(content)) {
      return content;
    }
    return EMPTY_PARAGRAPH;
  };

  const [value, setValue] = useState(() =>
    normalizeInitialContent(initialContent)
  );

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    editor,
    value,
    setValue,
    selectionRef,
    containerRef,
    isFocused,
    setIsFocused,
  };
}
