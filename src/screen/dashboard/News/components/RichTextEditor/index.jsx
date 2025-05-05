// import React, { useState, useRef, useMemo } from "react";
// import ReactQuill from "react-quill";
// import useQuillModules from "../../../../../hooks/useQuillModules";
// import useEditorEffects from "./useEditorEffects";
// import CharCount from "./CharCount";
// import "react-quill/dist/quill.snow.css";
// import "./custom-quill.scss";
// import Quill from "quill";

// const LazyRichTextEditor = ({
//   value,
//   onChange,
//   placeholder = "Hãy thêm nội dung cho bài viết.",
//   readOnly = false,
//   setHashtags,
// }) => {
//   const [isEditorActive, setIsEditorActive] = useState(false);
//   const [content, setContent] = useState(value || "");
//   const [charCount, setCharCount] = useState(0);
//   const containerRef = useRef(null);
//   const quillRef = useRef(null);
//   const { modules, formats } = useQuillModules();
//   const memoModules = useMemo(() => ({ ...modules }), [modules]);
//   const memoFormats = useMemo(() => [...formats, "hashtag"], [formats]);
//   const MAX_LENGTH = 1000;

//   useEditorEffects({
//     value,
//     setContent,
//     quillRef,
//     setCharCount,
//     isEditorActive,
//     containerRef,
//     setIsEditorActive,
//     setHashtags,
//   });

//   const handleEditorChange = (htmlContent) => {
//     const editor = quillRef.current?.getEditor();
//     const plainText = editor?.getText() || "";
//     const countRealChar = plainText.trimEnd().length;

//     console.log("htmlContent: ", htmlContent);

//     setContent(htmlContent);
//     setCharCount(countRealChar);
//     onChange && onChange(htmlContent);
//   };

//   const onKeyDown = (e) => {
//     if (e.key !== "Enter") return;
//     e.preventDefault();

//     const quill = quillRef.current.getEditor();
//     const range = quill.getSelection(true);
//     if (!range) return;

//     const [leaf, offset] = quill.getLeaf(range.index);
//     const isBeforeHashtag =
//       leaf?.parent?.domNode?.classList?.contains("hashtag-custom") &&
//       offset === 0;

//     if (e.shiftKey) {
//       // Shift+Enter: soft break (luôn hoạt động đúng)
//       quill.insertText(range.index, "\n", "user");
//       quill.setSelection(range.index + 1, 0, "silent");
//       return;
//     }

//     if (isBeforeHashtag) {
//       // Enter ngay trước hashtag => chèn \n không định dạng để tách block
//       quill.insertText(range.index, "\n", false, "user");
//       quill.setSelection(range.index + 1, 0, "silent");
//       return;
//     }

//     // Trường hợp bình thường
//     const formats = quill.getFormat(range);
//     quill.insertText(range.index, "\n", formats, "user");
//     quill.setSelection(range.index + 1, 0, "silent");
//   };

//   return (
//     <div
//       className={`dark-quill ${isEditorActive ? "active" : "inactive"}`}
//       ref={containerRef}
//       onClick={() => setIsEditorActive(true)}
//     >
//       <ReactQuill
//         ref={quillRef}
//         value={content}
//         modules={memoModules}
//         formats={memoFormats}
//         placeholder={placeholder}
//         onChange={handleEditorChange}
//         onKeyDown={onKeyDown}
//         readOnly={readOnly}
//         theme="snow"
//       />
//       <CharCount count={charCount} max={MAX_LENGTH} />
//     </div>
//   );
// };

// export default LazyRichTextEditor;
