import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

const headers = [
  { label: "Normal", value: "paragraph" },
  { label: "Tiêu đề 1", value: "heading-one" },
  { label: "Tiêu đề 2", value: "heading-two" },
  { label: "Tiêu đề 3", value: "heading-three" },
];

export default function HeaderSelect({
  editor,
  selectionRef,
  safeIsEditorEmpty,
}) {
  const [selectedValue, setSelectedValue] = useState("paragraph");

  const handleChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected);

    if (selectionRef?.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          Transforms.select(editor, selectionRef.current);
          Transforms.setNodes(editor, { type: selected });
          ReactEditor.focus(editor);
        }, 0);
      });
    } else {
      Transforms.setNodes(editor, { type: selected });
    }
  };

  return (
    <Select
      defaultValue="paragraph"
      value={selectedValue}
      size="small"
      disabled={safeIsEditorEmpty(editor)}
      onChange={handleChange}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
      sx={{
        minWidth: 105,
        maxWidth: 105,
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        backgroundColor: "transparent",
      }}
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
      {headers.map((h) => (
        <MenuItem key={h.value} value={h.value}>
          {h.label}
        </MenuItem>
      ))}
    </Select>
  );
}
