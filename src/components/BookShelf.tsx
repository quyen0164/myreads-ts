// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Nhận vào 1 mảng sách (VD: 5 cuốn thuộc kệ "Đang đọc").
// - Vẽ tiêu đề kệ.
// - Duyệt qua mảng sách, biến mỗi object thành 1 thẻ <Book>.
// ==============================================================================

import Book from "./Book";
import type { Book as BookType, Shelf } from "../types";

interface BookShelfProps {
  title: string;       // Tiêu đề kệ (VD: "Currently Reading")
  books: BookType[];   // Mảng sách thuộc kệ này
  onShelfChange: (id: string, newShelf: Shelf) => void; // Hàm đổi kệ (truyền từ App xuống)
}

export default function BookShelf({ title, books, onShelfChange }: BookShelfProps) {
  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Vẽ tiêu đề kệ */}
      <h2 style={{ borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", color: "#1e293b", fontSize: "20px" }}>
        {title}
      </h2>
      
      {/* ====================================================================
          THUẬT TOÁN DÀN TRANG CSS GRID
          ====================================================================
          [NGỮ PHÁP]: display: "grid" -> Kích hoạt hệ thống lưới.
          [LOGIC]: gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))"
          - minmax(180px, 1fr): Mỗi cuốn sách rộng TỐI THIỂU 180px, TỐI ĐA là 1 phần bằng nhau (1fr).
          - auto-fill: Tự động tính toán xem màn hình đang có bao nhiêu pixel. 
            Nếu màn hình rộng 1000px, nó sẽ tự động chia thành 5 cột (mỗi cột 200px).
            Nếu màn hình điện thoại rộng 400px, nó tự động chia thành 2 cột.
          Đây là thuật toán Responsive cực mạnh, không cần viết media query. */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
        gap: "24px", // Khoảng cách giữa các cuốn sách
        marginTop: "20px" 
      }}>
        
        {/* [LOGIC]: Nếu mảng sách rỗng (kệ trống) */}
        {books.length === 0 ? (
          <p style={{ color: "#94a3b8", fontStyle: "italic", gridColumn: "1 / -1" }}>
            {/* gridColumn: "1 / -1" nghĩa là: Dòng chữ này chiếm toàn bộ chiều ngang của lưới */}
            Kệ này hiện đang trống.
          </p>
        ) : (
          // [THUẬT TOÁN LẶP]: Duyệt qua mảng 'books'. Với mỗi cuốn, vẽ 1 thẻ <Book>.
          books.map((b) => (
            // [NGỮ PHÁP]: key={b.id} -> BẮT BUỘC. 
            // [LOGIC]: Giúp React biết cuốn nào là cuốn nào khi mảng thay đổi (VD: bạn đổi kệ, có cuốn bị xóa khỏi kệ).
            // Nếu không có key, React sẽ vẽ lại toàn bộ kệ từ đầu -> Rất chậm và giật lag.
            <Book key={b.id} book={b} onShelfChange={onShelfChange} />
          ))
        )}
      </div>
    </div>
  );
}