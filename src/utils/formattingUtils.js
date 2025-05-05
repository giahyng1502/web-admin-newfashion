import { Editor } from "slate";

export const toggleMark = (editor, format) => {
  if (!editor.selection) return;

  const selectedText = Editor.string(editor, editor.selection);
  if (!selectedText.trim()) return;

  const isActive = Editor.marks(editor)?.[format] === true;

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export function convertContent(content) {
  if (!content) return [];

  // Nếu là string
  if (typeof content === "string") {
    const trimmed = content.trim();

    // 1. JSON Slate? (stringified array/object)
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.warn("Failed to parse JSON Slate content:", e);
      }
    }

    // 2. HTML string? (có tag <...>)
    if (/<\/?.+?>/.test(content)) {
      const tmp = document.createElement("div");
      tmp.innerHTML = content;
      const text = tmp.textContent || tmp.innerText || "";
      return [
        {
          type: "paragraph",
          children: [{ text }],
        },
      ];
    }

    // 3. Plain text fallback
    return [
      {
        type: "paragraph",
        children: [{ text: content }],
      },
    ];
  }

  // Nếu đã là mảng Slate JSON
  if (Array.isArray(content)) {
    return content;
  }

  // Trường hợp khác (số, object...)
  return [
    {
      type: "paragraph",
      children: [{ text: String(content) }],
    },
  ];
}
