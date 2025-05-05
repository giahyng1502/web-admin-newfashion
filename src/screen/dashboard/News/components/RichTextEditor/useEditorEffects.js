// import { useEffect, useRef, useState } from "react";
// import Quill from "quill";

// const Inline = Quill.import("blots/inline");

// class HashtagBlot extends Inline {
//   static create(value) {
//     const node = super.create();
//     node.setAttribute("data-tag", value);
//     return node;
//   }

//   static formats(node) {
//     return node.getAttribute("data-tag");
//   }

//   format(name, value) {
//     if (name === "hashtag" && value) {
//       this.domNode.setAttribute("data-tag", value);
//     } else {
//       super.format(name, value);
//     }
//   }
// }

// HashtagBlot.blotName = "hashtag";
// HashtagBlot.tagName = "span";
// HashtagBlot.className = "hashtag-custom";

// Quill.register(HashtagBlot);

// const useEditorEffects = ({
//   value,
//   setContent,
//   quillRef,
//   setCharCount,
//   isEditorActive,
//   containerRef,
//   setIsEditorActive,
//   setHashtags,
// }) => {
//   const prevTagsRef = useRef([]);

//   useEffect(() => {
//     setContent(value || "");
//     const editor = quillRef.current?.getEditor();
//     const plainText = editor?.getText() || "";
//     setCharCount(plainText.trimEnd().length);
//   }, [value]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target)
//       ) {
//         setIsEditorActive(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (isEditorActive && quillRef.current) {
//       const editor = quillRef.current?.getEditor();
//       if (editor && document.activeElement !== editor.root) {
//         editor.focus();
//       }
//     }
//   }, [isEditorActive]);

//   useEffect(() => {
//     const quill = quillRef.current?.getEditor();
//     if (!quill) return;

//     const HASHTAG_REGEX = /(?<=^|\s)(#(?![\d_])[\p{L}][\p{L}\d_]*)/gu;

//     const handleTextChange = () => {
//       const range = quill.getSelection();
//       if (!range) return;

//       const start = Math.max(0, range.index - 100);
//       const end = range.index + 100;
//       const length = quill.getLength();

//       const delta = quill.getContents(start, end - start);
//       const text = quill.getText(start, end - start);

//       const matches = [...text.matchAll(HASHTAG_REGEX)];

//       // Clear highlight trong vùng nhỏ (thay vì toàn văn bản)
//       quill.formatText(start, end - start, "hashtag", false, "silent");

//       for (const match of matches) {
//         const fullMatch = match[1];
//         const indexInSlice = match.index + match[0].indexOf(fullMatch);
//         const absoluteIndex = start + indexInSlice;

//         // Nếu hashtag chứa xuống dòng hoặc ngay sau xuống dòng => bỏ qua
//         const hashtagText = fullMatch;
//         const charBefore = text[match.index - 1] || "";
//         if (hashtagText.includes("\n") || charBefore === "\n") continue;

//         quill.formatText(
//           absoluteIndex,
//           hashtagText.length,
//           "hashtag",
//           fullMatch,
//           "silent"
//         );
//       }
//       // Cập nhật danh sách hashtags
//       const allMatches = [...quill.getText().matchAll(HASHTAG_REGEX)].map(
//         (m) => m[1]
//       );
//       const uniqueTags = Array.from(new Set(allMatches));
//       if (
//         uniqueTags.length !== prevTagsRef.current.length ||
//         uniqueTags.some((t, i) => t !== prevTagsRef.current[i])
//       ) {
//         prevTagsRef.current = uniqueTags;
//         setHashtags(uniqueTags);
//       }
//     };

//     quill.on("text-change", handleTextChange);
//     return () => quill.off("text-change", handleTextChange);
//   }, [quillRef, setHashtags]);
// };

// export default useEditorEffects;
