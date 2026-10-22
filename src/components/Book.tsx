// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Chịu trách nhiệm hiển thị duy nhất 1 cuốn sách (Ảnh, Tên, Tác giả).
// - Nhận dữ liệu (book) từ BookShelf truyền xuống.
// ==============================================================================

import type { Book as BookType, Shelf } from "../types";
import ShelfSelector from "./ShelfSelector"; // Nút chọn kệ tự chế

interface BookProps {
  book: BookType;
  onShelfChange?: (id: string, newShelf: Shelf) => void; 
}

export default function Book({ book, onShelfChange }: BookProps) {
  // ==============================================================================
  // 1. THUẬT TOÁN XỬ LÝ ẢNH BÌA DỰ PHÒNG
  // ==============================================================================
  // [NGỮ PHÁP]: book.imageLinks?.thumbnail
  // [LOGIC]: Dấu ?. (Optional Chaining). Nếu cuốn sách này bị thiếu trường 'imageLinks' (undefined), 
  // nó sẽ không báo lỗi sập app mà trả về undefined.
  // [NGỮ PHÁP]: || "url..."
  // [LOGIC]: Nếu thumbnail bị undefined, nó tự động lấy link ảnh xám mặc định này.
  const thumbnail = book.imageLinks?.thumbnail || "https://via.placeholder.com/128x193?text=No+Image";
  
  // [LOGIC]: Nối mảng tác giả thành chuỗi. VD: ["A", "B"] -> "A, B". Nếu không có tác giả -> "Unknown author".
  const authorText = book.authors ? book.authors.join(", ") : "Unknown author";

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", // Xếp các phần tử từ trên xuống dưới
      backgroundColor: "white", 
      borderRadius: "12px", 
      padding: "12px", 
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)", 
      border: "1px solid #f1f5f9" 
    }}>
      
      {/* KHUNG ẢNH */}
      <div style={{ 
        width: "100%", 
        aspectRatio: "2/3", // [THUẬT TOÁN CSS]: Tự động giữ tỷ lệ vàng 2:3 (giống tỷ lệ sách thật), dù màn hình to hay nhỏ.
        overflow: "hidden", 
        borderRadius: "8px", 
        backgroundColor: "#e2e8f0" // Màu nền xám nhạt chờ ảnh tải lên
      }}>
        <img 
          src={thumbnail} 
          alt={book.title} 
          // objectFit: "cover" -> Ép ảnh vừa khít khung mà không bị méo.
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>
      
      {/* TÊN SÁCH */}
      <div style={{ 
        fontWeight: "700", 
        fontSize: "15px", 
        marginTop: "12px", 
        height: "42px", 
        overflow: "hidden", 
        // [THUẬT TOÁN CSS]: Cắt chữ dài bằng dấu 3 chấm (...)
        display: "-webkit-box", 
        WebkitLineClamp: 2, // Tối đa 2 dòng
        WebkitBoxOrient: "vertical" 
      }}>
        {book.title}
      </div>
      
      {/* TÁC GIẢ */}
      <div style={{ color: "#64748b", fontSize: "13px", marginTop: "4px", marginBottom: "16px", height: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {authorText}
      </div>
      
      {/* NÚT CHỌN KỆ */}
      <div style={{ marginTop: "auto" }}> 
        {/* marginTop: "auto" -> Đẩy nút này xuống tận cùng đáy của thẻ Card, tạo sự thẳng hàng giữa các cuốn sách */}
        {onShelfChange && (
          <ShelfSelector 
            currentShelf={book.shelf || "none"} 
            onSelect={(newShelf) => onShelfChange(book.id, newShelf)} // Truyền id cuốn sách và kệ mới lên trên
          />
        )}
      </div>
    </div>
  );
}