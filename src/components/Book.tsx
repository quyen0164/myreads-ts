// ==============================================================
// MỤC ĐÍCH: Nhận dữ liệu của 1 cuốn sách và hiển thị ra giao diện.
// ==============================================================

// Import khuôn mẫu Book từ file types.ts. 
// Dùng "as BookType" để đổi tên, tránh nhầm lẫn với Component <Book />.
import type { Book as BookType } from "../types";

// 1. Khai báo Props (Những thứ Component Cha sẽ truyền xuống)
interface BookProps {
  book: BookType; // Nhận vào 1 object cuốn sách
}

// 2. Hàm Component (Nhận prop 'book' từ tham số)
function Book({ book }: BookProps) {
  
  // 3. Xử lý ảnh bìa:
  // - book.imageLinks?.thumbnail: Dấu ?. (Optional Chaining) giúp tránh lỗi sập app 
  //   nếu cuốn sách này không có trường imageLinks.
  // - || "url...": Nếu ảnh bị undefined (không có), thì dùng ảnh xám mặc định.
  const thumbnail = book.imageLinks?.thumbnail || "https://via.placeholder.com/128x193?text=No+Image";

  // 4. Xử lý tác giả:
  // - Nếu book.authors có tồn tại (không phải undefined), dùng .join(", ") để nối mảng thành chuỗi.
  // - Nếu không có, hiển thị "Unknown author".
  const authorText = book.authors ? book.authors.join(", ") : "Unknown author";

  return (
    <div style={{ width: "128px", margin: "10px" }}>
      
      {/* Hiển thị ảnh bìa */}
      <img src={thumbnail} alt={book.title} style={{ width: "128px", height: "193px", objectFit: "cover" }} />

      {/* Hiển thị tên sách */}
      <div style={{ fontWeight: "bold", fontSize: "14px", marginTop: "8px" }}>
        {book.title}
      </div>

      {/* Hiển thị tác giả */}
      <div style={{ color: "gray", fontSize: "12px", marginTop: "4px" }}>
        {authorText}
      </div>
      
    </div>
  );
}

export default Book;