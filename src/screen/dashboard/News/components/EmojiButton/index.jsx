import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Picker } from "emoji-mart";
import { Smile } from "lucide-react";
import { Button } from "@mui/material";
import "emoji-mart/css/emoji-mart.css";
import "./Emoji.scss";

const EmojiButton = ({ editor, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const buttonRef = useRef(null);
  const pickerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showPicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [showPicker]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <>
      <Button
        ref={buttonRef}
        onMouseDown={(e) => {
          e.preventDefault();
          setShowPicker((prev) => !prev);
        }}
        sx={{ maxWidth: "40px", minWidth: "40px", padding: 0 }}
      >
        <Smile size={20} color="#FFFFFF" />
      </Button>

      {showPicker &&
        isReady &&
        createPortal(
          <div
            ref={pickerRef}
            style={{
              position: "absolute",
              top: position.top + 6,
              left: position.left,
              zIndex: 9999,
            }}
          >
            <Picker
              onSelect={(emoji) => {
                onSelect(editor, emoji);
              }}
              showPreview={false}
              showSkinTones={false}
              theme="dark"
              i18n={{
                search: "Tìm emoji...",
                clear: "Xóa",
                notfound: "Không tìm thấy emoji",
                categories: {
                  search: "Kết quả tìm kiếm",
                  recent: "Đã dùng gần đây",
                  people: "Mặt cười & hình người",
                  nature: "Động vật & thiên nhiên",
                  foods: "Ẩm thực",
                  activity: "Hoạt động",
                  places: "Đi lại & địa điểm",
                  objects: "Đồ vật",
                  symbols: "Biểu tượng",
                  flags: "Cờ",
                },
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default EmojiButton;
