// ==============================================================
// MỤC ĐÍCH: Trang chủ của app. Chịu trách nhiệm chia toàn bộ sách
// thành các kệ khác nhau và hiển thị chúng.
// ==============================================================
import BookShelf from "./BookShelf";
import type { Book as BookType } from "../types";

interface MainPageProps {
  books: BookType[]; // Nhận toàn bộ sách từ App truyền xuống
}

function MainPage({ books }: MainPageProps) {
  
  // 1. TẠO MẢNG CẤU HÌNH CHO CÁC KỆ SÁCH (Đúng ý tưởng của bạn)
  // Việc gom vào mảng giúp code sau này dễ bảo trì. Muốn thêm kệ mới chỉ cần thêm 1 dòng.
  const shelves = [
    { key: "currentlyReading", title: "Currently Reading" },
    { key: "wantToRead", title: "Want to Read" },
    { key: "read", title: "Read" }
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      
      <h1>MyReads</h1>

      {/* 2. LẶP QUA MẢNG CẤU HÌNH ĐỂ VẼ CÁC KỆ SÁCH */}
      {shelves.map((shelf) => {
        
        // 3. LỌC SÁCH CHO KỆ HIỆN TẠI
        // - Hàm .filter() sẽ chạy qua mảng 'books'.
        // - Giữ lại những cuốn sách có b.shelf trùng với shelf.key (VD: "currentlyReading").
        const shelfBooks = books.filter((b) => b.shelf === shelf.key);

        // 4. TRẢ VỀ COMPONENT KỆ SÁCH
        return (
          <BookShelf 
            key={shelf.key}       // Key bắt buộc khi dùng vòng lặp map
            title={shelf.title}   // Truyền tiêu đề kệ
            books={shelfBooks}    // Truyền mảng sách đã lọc được
          />
        );
      })}
      
    </div>
  );
}

export default MainPage;