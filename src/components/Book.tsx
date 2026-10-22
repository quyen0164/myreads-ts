// Import khuôn mẫu Book từ file types.ts (dùng type vì đây chỉ là khuôn mẫu)
import type { Book as BookType } from "../types";

// 1. KHAI BÁO PROPS
// Đây là danh sách những gì App sẽ truyền vào cho cuốn sách này.
interface BookProps {
  book: BookType; // Truyền cả 1 object cuốn sách vào
}

// 2. NHẬN PROPS
// Ta bóc biến 'book' ra khỏi cái hộp props.
function Book({ book }: BookProps) {
  
  // 3. XỬ LÝ ẢNH BÌA
  // - book.imageLinks?.thumbnail: Nếu có ảnh thì lấy. Dấu ?. để tránh lỗi nếu không có imageLinks.
  // - || "link_mặc_định": Nếu ảnh bị undefined (không có), thì lấy ảnh xám mặc định.
  const thumbnail = book.imageLinks?.thumbnail || "https://via.placeholder.com/128x193?text=No+Image";

  // 4. XỬ LÝ TÁC GIẢ
  // Nếu có mảng authors, dùng .join(", ") để nối thành chuỗi. (VD: ["A", "B"] -> "A, B")
  // Nếu không có, hiển thị "Unknown author".
  const authorText = book.authors ? book.authors.join(", ") : "Unknown author";

  return (
    // Thẻ div bao ngoài cùng của 1 cuốn sách
    <div style={{ width: "128px", margin: "10px" }}>
      
      {/* HIỂN THỊ ẢNH BÌA */}
      <img 
        src={thumbnail} 
        alt={book.title} 
        style={{ width: "128px", height: "193px", objectFit: "cover" }} 
      />

      {/* HIỂN THỊ TÊN SÁCH */}
      <div style={{ fontWeight: "bold", fontSize: "14px", marginTop: "8px" }}>
        {book.title}
      </div>

      {/* HIỂN THỊ TÁC GIẢ */}
      <div style={{ color: "gray", fontSize: "12px", marginTop: "4px" }}>
        {authorText}
      </div>
      
    </div>
  );
}

export default Book;