import { Editor, Node, Range, Transforms } from "slate";
import { FontFamilyDropdown } from "./FontFamilyDropdown";
import { FontSizeDropdown } from "./FontSizeDropdown";
import { ColorDropdown } from "./ColorDropdown";
import { Button } from "@mui/material";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { isMarkActive } from "../../../../../utils/formattingUtils";
import HeaderSelect from "./HeaderSelect";
import AlignButtons from "./AlignButtons";
import ListButtons from "./ListButtons";
import EmojiButton from "../EmojiButton";

const ToolbarEditor = ({ editor, selectionRef, toggleMark, isFocused }) => {
  function safeIsEditorEmpty(editor) {
    try {
      if (editor.children.length === 0) return true;
      // Kiểm tra nếu toàn bộ các node đều là paragraph rỗng
      const text = Editor.string(editor, []).trim();
      return text === "";
    } catch (e) {
      console.error("safeIsEditorEmpty error:", e);
      return true;
    }
  }

  const ToolbarButton = ({ format, icon: Icon }) => {
    const hasMark = isMarkActive(editor, format);

    const handleMouseDown = (e) => {
      e.preventDefault();

      // Phục hồi selection nếu mất
      if (!editor.selection && selectionRef.current) {
        Transforms.select(editor, selectionRef.current);
      }

      // Toggle mark
      if (editor.selection && shouldToggle()) {
        toggleMark(editor, format);
      }
    };

    const shouldToggle = () => {
      const { selection } = editor;
      if (!selection) return false;

      if (editor.selection) {
        const selectedText = Editor.string(editor, editor.selection);
        // Không có nội dung hoặc toàn khoảng trắng
        if (!selectedText || selectedText.trim() === "") {
          const allText = Node.string(editor);
          // Nếu toàn bộ editor cũng trống → không toggle
          if (allText.trim() === "") return false;
        }
      }
      return true;
    };

    return (
      <Button
        className={`toolbar-btn ${hasMark ? "active" : ""}`}
        variant="text"
        size="small"
        onMouseDown={handleMouseDown}
      >
        <Icon size={16} />
      </Button>
    );
  };

  const handleEmojiSelect = (editor, emoji) => {
    const { selection } = editor;
    const emojiChar = emoji.native;
    if (selection && Range.isCollapsed(selection)) {
      Transforms.insertText(editor, emojiChar);

      const newPoint = Editor.after(editor, selection.focus, {
        distance: emojiChar.length,
        unit: "character",
      });
      if (newPoint) {
        Transforms.select(editor, { anchor: newPoint, focus: newPoint });
      }
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div
        className={`toolbar ${isFocused ? "visible" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <HeaderSelect
          selectionRef={selectionRef}
          editor={editor}
          safeIsEditorEmpty={safeIsEditorEmpty}
        />
        {/* <FontFamilyDropdown
          selectionRef={selectionRef}
          editor={editor}
          safeIsEditorEmpty={safeIsEditorEmpty}
        /> */}
        <FontSizeDropdown
          selectionRef={selectionRef}
          editor={editor}
          safeIsEditorEmpty={safeIsEditorEmpty}
        />
        <ToolbarButton format="bold" icon={Bold} />
        <ToolbarButton format="italic" icon={Italic} />
        <ToolbarButton format="underline" icon={Underline} />
        <ToolbarButton format="strikethrough" icon={Strikethrough} />
        <ColorDropdown
          selectionRef={selectionRef}
          editor={editor}
          safeIsEditorEmpty={safeIsEditorEmpty}
        />
        <AlignButtons
          selectionRef={selectionRef}
          editor={editor}
          safeIsEditorEmpty={safeIsEditorEmpty}
        />
        <ListButtons
          selectionRef={selectionRef}
          editor={editor}
          safeIsEditorEmpty={safeIsEditorEmpty}
        />
        <EmojiButton editor={editor} onSelect={handleEmojiSelect} />
      </div>
    </>
  );
};

export default ToolbarEditor;
