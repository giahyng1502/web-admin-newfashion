import { Text } from "slate";

const HASHTAG_REGEX = /#[\p{L}\d_]+/gu;

export default function SlateViewer({ content }) {
  if (!content) return null;

  let parsedContent = content;

  if (typeof content === "string") {
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error("Invalid Slate JSON:", e);
      return null;
    }
  }

  if (!Array.isArray(parsedContent)) {
    console.error("Parsed content is not an array:", parsedContent);
    return null;
  }

  const renderText = (leaf, index) => {
    const {
      text,
      bold,
      italic,
      underline,
      strikethrough,
      color,
      fontSize,
      fontFamily,
    } = leaf;

    // 1) Tách text thành các phần thường và hashtag
    const parts = text.split(HASHTAG_REGEX);
    const tags = text.match(HASHTAG_REGEX) || [];

    // 2) Xen kẽ tạo children
    const children = [];
    parts.forEach((part, i) => {
      if (part) {
        children.push(<span key={`part-${index}-${i}`}>{part}</span>);
      }
      if (i < tags.length) {
        children.push(
          <span
            key={`tag-${index}-${i}`}
            style={{
              color: "#5aa7ff",
              fontWeight: "bold",
            }}
          >
            {tags[i]}
          </span>
        );
      }
    });

    // 3) Áp dụng các style font-format
    let formatted = children;
    if (bold) formatted = <strong>{formatted}</strong>;
    if (italic) formatted = <em>{formatted}</em>;
    if (underline) formatted = <u>{formatted}</u>;
    if (strikethrough) formatted = <s>{formatted}</s>;

    // 4) Áp style chung
    const style = {};
    if (color) style.color = color;
    if (fontSize) style.fontSize = `${fontSize}px`;
    if (fontFamily) style.fontFamily = fontFamily;

    return (
      <span key={index} style={style}>
        {formatted}
      </span>
    );
  };

  const renderNode = (node, index) => {
    if (Text.isText(node)) {
      return renderText(node, index);
    }

    const style = {};
    if (node.align) {
      style.textAlign = node.align;
    }

    const children = node.children?.map((child, idx) =>
      renderNode(child, `${index}-${idx}`)
    );

    switch (node.type) {
      case "heading-one":
        return (
          <h1 key={index} style={style}>
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 key={index} style={style}>
            {children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 key={index} style={style}>
            {children}
          </h3>
        );
      case "bulleted-list":
        return (
          <ul key={index} style={style}>
            {children}
          </ul>
        );
      case "numbered-list":
        return (
          <ol key={index} style={style}>
            {children}
          </ol>
        );
      case "list-item":
        return <li key={index}>{children}</li>;
      default:
        return (
          <p
            key={index}
            style={{
              ...style,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {children}
          </p>
        );
    }
  };

  return (
    <div>{parsedContent.map((node, index) => renderNode(node, index))}</div>
  );
}
