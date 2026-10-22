// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Nhận toàn bộ sách (books) từ App.tsx.
// - Chia sách vào 3 kệ dựa trên thuộc tính 'shelf'.
// ==============================================================================

import BookShelf from "./BookShelf";
import type { Book as BookType, Shelf } from "../types";

// [LOGIC]: Nhận Props từ App.tsx truyền xuống (books và hàm onShelfChange)
interface MainPageProps {
  books: BookType[];
  onShelfChange: (id: string, newShelf: Shelf) => void;
}

function MainPage({ books, onShelfChange }: MainPageProps) {
  
  // ==============================================================================
  // 1. CẤU HÌNH CÁC KỆ SÁCH (CONFIGURATION ARRAY)
  // ==============================================================================
  // [THUẬT TOÁN]: Tại sao không viết cứng 3 cái <BookShelf> ra?
  // Nếu viết cứng, sau này muốn thêm kệ "Đang tìm hiểu", ta phải copy-paste code.
  // Dùng mảng cấu hình: Sau này thêm kệ mới chỉ cần thêm 1 dòng object vào mảng này.
  const shelves = [
    { key: "currentlyReading", title: "📖 Currently Reading" },
    { key: "wantToRead", title: "⏳ Want to Read" },
    { key: "read", title: "✅ Read" }
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* [THUẬT TOÁN LẶP]: Duyệt qua từng cấu hình kệ sách ở trên. */}
      {shelves.map((shelf) => {
        
        // ==============================================================================
        // 2. THUẬT TOÁN LỌC DỮ LIỆU (.filter)
        // ==============================================================================
        // [LOGIC]: Ví dụ: shelf.key đang là "read". 
        // Hàm filter sẽ chạy qua mảng 'books' (kho sách tổng). 
        // Cuốn nào có b.shelf === "read" thì giữ lại, không thì vứt bỏ.
        // Kết quả 'shelfBooks' chỉ chứa những cuốn sách của kệ "Read".
        const shelfBooks = books.filter((b) => b.shelf === shelf.key);

        // [NGỮ PHÁP]: Trả về Component <BookShelf>.
        // - key={shelf.key}: Bắt buộc để React phân biệt các kệ.
        // - books={shelfBooks}: Truyền mảng sách ĐÃ LỌC xuống cho kệ.
        return (
          <BookShelf 
            key={shelf.key} 
            title={shelf.title} 
            books={shelfBooks} 
            onShelfChange={onShelfChange} // Truyền tiếp hàm đổi kệ xuống để các cuốn sách dùng
          />
        );
      })}
      
    </div>
  );
}

export default MainPage;