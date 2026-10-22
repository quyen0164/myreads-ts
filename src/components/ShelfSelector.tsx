// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Thẻ <select> mặc định của HTML rất xấu và không tùy biến được.
// - Ta tự làm một Dropdown có hiệu ứng đẹp hơn.
// ==============================================================================

import { useState, useEffect, useRef } from "react";
import type { Shelf } from "../types";

export default function ShelfSelector({ currentShelf, onSelect }: { currentShelf: Shelf, onSelect: (s: Shelf) => void }) {
  // [NGỮ PHÁP]: isOpen -> Cờ đóng/mở menu.
  const [isOpen, setIsOpen] = useState(false);
  
  // [NGỮ PHÁP]: useRef -> Tạo một tham chiếu (reference) trỏ thẳng vào thẻ HTML.
  // [LOGIC]: Ta dùng nó để kiểm tra xem người dùng có đang click VÀO BÊN TRONG cái Dropdown này hay không.
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ==============================================================================
  // THUẬT TOÁN: CLICK RA NGOÀI ĐỂ ĐÓNG MENU
  // ==============================================================================
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // [LOGIC]: Nếu dropdownRef tồn tại VÀ vị trí click (event.target) KHÔNG NẰM TRONG dropdownRef.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Đóng menu
      }
    }
    // Gắn sự kiện "click chuột xuống" vào toàn bộ trang web
    document.addEventListener("mousedown", handleClickOutside);
    // Dọn dẹp sự kiện khi component bị hủy
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Từ điển dịch mã code thành chữ tiếng Việt
  const labels: Record<Shelf, string> = {
    currentlyReading: "📖 Đang đọc",
    wantToRead: "⏳ Sẽ đọc",
    read: "✅ Đã đọc",
    none: "❌ Bỏ chọn",
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      
      {/* Nút bấm chính */}
      <button onClick={() => setIsOpen(!isOpen)} style={{ width: "100%", padding: "8px", cursor: "pointer", borderRadius: "6px" }}>
        {labels[currentShelf]}
      </button>

      {/* Menu xổ lên (bottom: 110%) */}
      {isOpen && (
        <div style={{ position: "absolute", bottom: "110%", left: 0, width: "100%", background: "white", zIndex: 50, boxShadow: "0 -4px 10px rgba(0,0,0,0.1)" }}>
          {/* [THUẬT TOÁN LẶP]: Object.keys(labels) lấy ra các key (currentlyReading, read,...) */}
          {(Object.keys(labels) as Shelf[]).map((shelf) => (
            <div 
              key={shelf} 
              // [LOGIC]: Khi click vào 1 kệ: Gọi hàm onSelect, sau đó đóng menu.
              onClick={() => { onSelect(shelf); setIsOpen(false); }} 
              style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: currentShelf === shelf ? "#eff6ff" : "white" }}
            >
              {labels[shelf]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}