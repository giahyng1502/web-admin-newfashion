import { useEffect, useState } from "react";
import { Editor } from "slate";

export function useCurrentMarkValue(editor, markKey) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const marks = Editor.marks(editor);
    if (marks?.[markKey]) {
      setValue(marks[markKey]);
    } else {
      setValue("");
    }
  }, [editor.selection]);

  return [value, setValue];
}
