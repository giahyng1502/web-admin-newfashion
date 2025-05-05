import { Editor, Transforms } from "slate";
import { Select, MenuItem, FormControl } from "@mui/material";
import { ReactEditor } from "slate-react";
import { useCurrentMarkValue } from "./useCurrentMarkValue";

const FONT_OPTIONS = ["Inter", "Yellowtail"];

export function FontFamilyDropdown({
  selectionRef,
  editor,
  safeIsEditorEmpty,
}) {
  const [currentFont, setCurrentFont] = useCurrentMarkValue(
    editor,
    "fontFamily"
  );

  const handleChange = (e) => {
    const selectedFont = e.target.value;

    if (selectionRef?.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          Transforms.select(editor, selectionRef.current);
          Editor.addMark(editor, "fontFamily", selectedFont);
          setCurrentFont(selectedFont);
          ReactEditor.focus(editor);
        }, 0);
      });
    } else {
      Editor.addMark(editor, "fontFamily", selectedFont);
      setCurrentFont(selectedFont);
    }
  };

  return (
    <FormControl size="small" sx={{ minWidth: 110, maxWidth: 110 }}>
      <Select
        disabled={safeIsEditorEmpty(editor)}
        value={currentFont}
        onChange={handleChange}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        displayEmpty
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          backgroundColor: "transparent", // hoặc giữ nguyên
        }}
        renderValue={(selected) =>
          selected ? (
            <span style={{ fontFamily: selected }}>{selected}</span>
          ) : (
            FONT_OPTIONS[0]
          )
        }
        MenuProps={{
          disablePortal: true,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        {FONT_OPTIONS.map((font) => (
          <MenuItem key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
