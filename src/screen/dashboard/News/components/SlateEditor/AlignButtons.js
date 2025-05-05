import { IconButton, Menu, MenuItem, Tooltip, Box } from "@mui/material";
import { useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from "lucide-react";
import { Transforms, Editor, Element as SlateElement } from "slate";
import { ReactEditor } from "slate-react";

const ALIGN_OPTIONS = [
  { value: "left", icon: <AlignLeft size={16} />, label: "Căn trái" },
  { value: "center", icon: <AlignCenter size={16} />, label: "Căn giữa" },
  { value: "right", icon: <AlignRight size={16} />, label: "Căn phải" },
  { value: "justify", icon: <AlignJustify size={16} />, label: "Căn đều" },
];

function isAlignActive(editor, align) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.align === align,
    mode: "lowest",
  });
  return !!match;
}

export default function AlignDropdown({
  editor,
  selectionRef,
  safeIsEditorEmpty,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const applyAlign = (alignValue) => {
    handleClose();

    const doTransform = () => {
      Transforms.setNodes(
        editor,
        { align: alignValue },
        { match: (n) => SlateElement.isElement(n), mode: "lowest" }
      );
      ReactEditor.focus(editor);
    };

    if (selectionRef?.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          Transforms.select(editor, selectionRef.current);
          doTransform();
        }, 0);
      });
    } else {
      doTransform();
    }
  };

  const currentAlign = ALIGN_OPTIONS.find(({ value }) =>
    isAlignActive(editor, value)
  )?.icon || <AlignLeft size={16} />;

  return (
    <>
      <Tooltip title="Căn lề">
        <span style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleClick}
            disabled={safeIsEditorEmpty(editor)}
            size="small"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {currentAlign}
              <ChevronDown size={16} />
            </Box>
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {ALIGN_OPTIONS.map(({ icon, value, label }) => (
          <MenuItem
            key={value}
            onClick={() => applyAlign(value)}
            selected={isAlignActive(editor, value)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {icon}
              {label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
