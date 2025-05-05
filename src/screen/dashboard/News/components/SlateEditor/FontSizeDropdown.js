import React from "react";
import { MenuItem, Select } from "@mui/material";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

const fontSizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

export function FontSizeDropdown({ selectionRef, editor, safeIsEditorEmpty }) {
  const handleChange = (e) => {
    const selectedSize = e.target.value;

    if (selectionRef?.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          Transforms.select(editor, selectionRef.current);
          Editor.addMark(editor, "fontSize", selectedSize);
          ReactEditor.focus(editor);
        }, 0);
      });
    } else {
      Editor.addMark(editor, "fontSize", selectedSize);
    }
  };

  return (
    <Select
      disabled={safeIsEditorEmpty(editor)}
      displayEmpty
      defaultValue=""
      size="small"
      sx={{
        minWidth: 65,
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        backgroundColor: "transparent",
      }}
      renderValue={(selected) => (selected ? selected : <span>{18}</span>)}
      onChange={handleChange}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
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
      {fontSizes.map((size) => (
        <MenuItem key={size} value={size}>
          {size}
        </MenuItem>
      ))}
    </Select>
  );
}
