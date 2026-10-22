// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Hiển thị danh sách sách tìm được.
// - Đồng bộ dữ liệu với Trang chủ (khi bạn đổi kệ ở đây, về trang chủ phải thấy thay đổi).
// ==============================================================================

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBooks } from "../api";
import Book from "./Book";
import type { Book as BookType, Shelf } from "../types";

export default function SearchResultsPage({ onShelfChange }: { onShelfChange: (id: string, s: Shelf) => void }) {
  
  // ==============================================================================
  // 1. LẤY TỪ KHÓA TỪ URL
  // ==============================================================================
  // [NGỮ PHÁP]: useSearchParams -> Lấy phần ?q=... trên URL.
  // [VÍ DỤ]: URL là "/search?q=Harry" -> searchParams.get("q") trả về "Harry".
  const [searchParams] = useSearchParams();
  
  // [THUẬT TOÁN SỬA LỖI FONT]: .normalize("NFC")
  // [LOGIC]: Chữ tiếng Việt có 2 cách mã hóa. "Kết" có thể là 1 ký tự (NFC) hoặc 3 ký tự (e + dấu ^ + dấu sắc).
  // Nếu bị tách rời, màn hình sẽ hiển thị "Kê ́ t". Hàm này ép nó về dạng 1 ký tự.
  const query = (searchParams.get("q") || "").normalize("NFC"); 
  
  // State lưu kết quả tìm kiếm
  const [results, setResults] = useState<BookType[]>([]);

  // ==============================================================================
  // 2. GỌI API KHI QUERY THAY ĐỔI
  // ==============================================================================
  useEffect(() => {
    if (query) {
      // Gọi API tìm kiếm, lưu vào mảng 'results'
      getBooks(query).then(setResults);
    }
  }, [query]); // Mỗi khi URL đổi từ khóa, hàm này chạy lại.

  // ==============================================================================
  // 3. XỬ LÝ ĐỔI KỆ TẠI TRANG SEARCH
  // ==============================================================================
  const handleLocalShelfChange = (id: string, newShelf: Shelf) => {
    // BƯỚC 1: Cập nhật mảng 'results' nội bộ (để UI trang Search đổi ngay lập tức).
    setResults(prev => prev.map(b => b.id === id ? { ...b, shelf: newShelf } : b));
    
    // BƯỚC 2: Gọi hàm 'onShelfChange' của App.tsx (để cập nhật kho sách tổng).
    // [LOGIC]: Nếu thiếu bước này, khi bạn bấm nút Back về Trang chủ, cuốn sách vẫn nằm ở kệ cũ.
    onShelfChange(id, newShelf);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1280px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "32px", color: "#0f172a", fontSize: "24px", fontWeight: "700" }}>
        {query ? `Kết quả tìm kiếm cho "${query}"` : "Nhập từ khóa để tìm sách"}
      </h2>

      {query && results.length === 0 && (
        <p style={{ color: "#64748b" }}>Không tìm thấy sách nào.</p>
      )}

      {results.length > 0 && (
        // Tương tự BookShelf, dùng CSS Grid để dàn trang
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
          {results.map((b) => (
            <Book key={b.id} book={b} onShelfChange={handleLocalShelfChange} />
          ))}
        </div>
      )}
    </div>
  );
}