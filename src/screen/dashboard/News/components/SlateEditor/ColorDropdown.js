import React, { useState } from "react";
import { Box, Menu, IconButton, Grid } from "@mui/material";
import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { useCurrentMarkValue } from "./useCurrentMarkValue";

const COLORS = [
  "#e53935",
  "#d81b60",
  "#8e24aa",
  "#5e35b1",
  "#3949ab",
  "#1e88e5",
  "#039be5",
  "#00acc1",
  "#00897b",
  "#43a047",
  "#7cb342",
  "#c0ca33",
  "#fdd835",
  "#ffb300",
  "#fb8c00",
  "#f4511e",
  "#6d4c41",
  "#757575",
  "#546e7a",
  "#000000",
  "#ffffff",
];

export function ColorDropdown({ selectionRef, editor, safeIsEditorEmpty }) {
  const [currentColor, setCurrentColor] = useCurrentMarkValue(editor, "color");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    if (!safeIsEditorEmpty(editor)) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (color) => {
    if (selectionRef?.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          Transforms.select(editor, selectionRef.current);
          Editor.addMark(editor, "color", color);
          setCurrentColor(color);
          ReactEditor.focus(editor);
        }, 0);
      });
    } else {
      Editor.addMark(editor, "color", color);
      setCurrentColor(color);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{
          backgroundColor: currentColor || "#ccc",
          border: "1px solid #aaa",
          width: 32,
          height: 32,
        }}
      ></IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        MenuListProps={{ sx: { padding: 1 } }}
      >
        <Grid container spacing={1} sx={{ width: 200 }}>
          {COLORS.map((color) => (
            <Grid item xs={2} key={color}>
              <Box
                onClick={() => handleSelect(color)}
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: color,
                  borderRadius: 1,
                  border:
                    currentColor === color
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  boxShadow:
                    currentColor === color ? "0 0 0 2px #1976d2" : "none",
                  cursor: "pointer",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Menu>
    </>
  );
}
