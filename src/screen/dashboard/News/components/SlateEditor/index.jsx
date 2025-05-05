import React from "react";
import { Node } from "slate";
import { Slate, Editable } from "slate-react";
import { useSlateEditor } from "./useSlateEditor";
import { toggleMark } from "../../../../../utils/formattingUtils";
import { HASHTAG_REGEX, useEditorBehaviors } from "./useEditorBehaviors";
import ToolbarEditor from "./ToolbarEditor";
import "./PostEditor.scss";

export default function MyEditor({ content, setContent, setHashtags }) {
  const {
    editor,
    value,
    setValue,
    selectionRef,
    containerRef,
    isFocused,
    setIsFocused,
  } = useSlateEditor(content);

  const { renderLeaf, renderElement, decorate, handleKeyDown } =
    useEditorBehaviors(editor);

  return (
    <div className="post-editor" ref={containerRef}>
      {editor && (
        <ToolbarEditor
          selectionRef={selectionRef}
          editor={editor}
          toggleMark={toggleMark}
          isFocused={isFocused}
        />
      )}
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(newValue) => {
          const { selection } = editor;
          if (selection) {
            selectionRef.current = selection;
          }
          setValue(newValue);
          setContent(newValue);

          const plain = newValue.map((n) => Node.string(n)).join("\n");
          const tags = [...plain.matchAll(HASHTAG_REGEX || [])].map((t) =>
            t[2] ? t[2].trim() : t.trim()
          );
          setHashtags(Array.from(new Set(tags)));
        }}
      >
        {/* Editable với decorate và renderLeaf */}
        <Editable
          placeholder="Hãy nhập nội dung cho bài viết của bạn"
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (selectionRef.current) {
              editor.selection = selectionRef.current;
            }
          }}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </Slate>
    </div>
  );
}
