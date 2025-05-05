import { ButtonGroup, IconButton } from "@mui/material";
import { Editor, Transforms, Element } from "slate";
import { List, ListOrdered } from "lucide-react";

const LIST_TYPES = [
  { icon: <ListOrdered size={16} />, type: "numbered-list" },
  { icon: <List size={16} />, type: "bulleted-list" },
];

export default function ListButtons({ editor, safeIsEditorEmpty }) {
  const isListActive = (editor, type) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
    });
    return !!match;
  };

  const toggleList = (editor, listType) => {
    const isActive = isListActive(editor, listType);
    const isList = listType === "numbered-list" || listType === "bulleted-list";

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        (n.type === "numbered-list" || n.type === "bulleted-list"),
      split: true,
    });

    const newType = isActive ? "paragraph" : "list-item";

    Transforms.setNodes(editor, { type: newType });

    if (!isActive && isList) {
      const block = { type: listType, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  return (
    <ButtonGroup size="small">
      {LIST_TYPES.map(({ icon, type }) => (
        <IconButton
          key={type}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleList(editor, type);
          }}
          disabled={safeIsEditorEmpty(editor)}
        >
          {icon}
        </IconButton>
      ))}
    </ButtonGroup>
  );
}
