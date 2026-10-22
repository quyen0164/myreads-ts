// Import Component Kệ sách ở Bước 3
import BookShelf from "./BookShelf";
import type { Book as BookType } from "../types";

// 1. KHAI BÁO PROPS
interface MainPageProps {
  books: BookType[]; // Toàn bộ sách trong thư viện
}

// 2. NHẬN PROPS
function MainPage({ books }: MainPageProps) {
  
  // 3. CHIA SÁCH THEO KỆ BẰNG HÀM FILTER
  // Hàm filter trả về mảng mới, chỉ giữ lại những cuốn có shelf tương ứng.
  const currentlyReading = books.filter((b) => b.shelf === "currentlyReading");
  const wantToRead = books.filter((b) => b.shelf === "wantToRead");
  const read = books.filter((b) => b.shelf === "read");

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* TIÊU ĐỀ TRANG */}
      <h1>MyReads</h1>

      {/* 4. GỌI 3 CÁI KỆ VÀ TRUYỀN MẢNG SÁCH ĐÃ LỌC VÀO */}
      <BookShelf title="Currently Reading" books={currentlyReading} />
      
      <BookShelf title="Want to Read" books={wantToRead} />
      
      <BookShelf title="Read" books={read} />
      
    </div>
  );
}

export default MainPage;