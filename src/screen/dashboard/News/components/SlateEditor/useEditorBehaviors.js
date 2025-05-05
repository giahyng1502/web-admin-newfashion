import { useCallback } from "react";
import { Text, Editor } from "slate";
import { toggleMark } from "../../../../../utils/formattingUtils";

export const HASHTAG_REGEX = /(^|\s)(#(?![\d_])[\p{L}][\p{L}\d_]*)/gu;

export const useEditorBehaviors = (editor) => {
  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;
    if (leaf.hashtag) {
      children = (
        <span
          style={{
            backgroundColor: "#215188",
            color: "#ffffff",
            fontWeight: 500,
          }}
        >
          {children}
        </span>
      );
    }
    if (leaf.fontFamily)
      children = (
        <span style={{ fontFamily: leaf.fontFamily }}>{children}</span>
      );
    if (leaf.fontSize)
      children = <span style={{ fontSize: leaf.fontSize }}>{children}</span>;
    if (leaf.color)
      children = <span style={{ color: leaf.color }}>{children}</span>;

    return <span {...attributes}>{children}</span>;
  }, []);

  const decorate = useCallback(([node, path]) => {
    const ranges = [];
    if (!Text.isText(node)) return ranges;
    let m;
    while ((m = HASHTAG_REGEX.exec(node.text)) !== null) {
      const start = m.index + m[1].length;
      const end = start + m[2].length;
      ranges.push({
        anchor: { path, offset: start },
        focus: { path, offset: end },
        hashtag: true,
      });
    }
    return ranges;
  }, []);

  const renderElement = useCallback(({ attributes, children, element }) => {
    const alignStyle = element.align ? { textAlign: element.align } : undefined;

    const commonStyle = {
      margin: 0,
      padding: 0,
    };

    switch (element.type) {
      case "heading-one":
        return (
          <h1 {...attributes} style={{ ...commonStyle, ...alignStyle }}>
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...attributes} style={{ ...commonStyle, ...alignStyle }}>
            {children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 {...attributes} style={{ ...commonStyle, ...alignStyle }}>
            {children}
          </h3>
        );
      case "bulleted-list":
        return (
          <ul
            {...attributes}
            style={{ ...commonStyle, ...alignStyle, paddingLeft: 20 }}
          >
            {children}
          </ul>
        );
      case "numbered-list":
        return (
          <ol
            {...attributes}
            style={{ ...commonStyle, ...alignStyle, paddingLeft: 20 }}
          >
            {children}
          </ol>
        );
      case "list-item":
        return (
          <li {...attributes} style={{ ...commonStyle, ...alignStyle }}>
            {children}
          </li>
        );
      case "align-left":
      case "align-center":
      case "align-right":
      case "align-justify":
        return (
          <div {...attributes} style={{ ...commonStyle, ...alignStyle }}>
            {children}
          </div>
        );
      default:
        return (
          <p {...attributes} style={{ ...commonStyle, ...alignStyle }}>
            {children}
          </p>
        );
    }
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      const { ctrlKey, metaKey, key } = event;
      const hotkey = ctrlKey || metaKey; // Ctrl trên Win, Cmd trên Mac

      if (!hotkey) return;

      if (!editor.selection) return;

      const selectedText = Editor.string(editor, editor.selection);
      if (!selectedText.trim()) return;

      switch (key.toLowerCase()) {
        case "b":
          event.preventDefault();
          toggleMark(editor, "bold");
          break;
        case "i":
          event.preventDefault();
          toggleMark(editor, "italic");
          break;
        case "u":
          event.preventDefault();
          toggleMark(editor, "underline");
          break;
        case "s":
          event.preventDefault();
          toggleMark(editor, "strikethrough");
          break;
        default:
          break;
      }
    },
    [editor]
  );

  return {
    renderLeaf,
    renderElement,
    decorate,
    handleKeyDown,
  };
};
