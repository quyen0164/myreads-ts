// ==============================================================
// TRANG KẾT QUẢ TÌM KIẾM (Chỉ dùng Mock Data, không gọi API)
// ==============================================================
import { useSearchParams } from "react-router-dom";
import Book from "./Book";
import type { Book as BookType } from "../types";

// 1. NHẬN PROP books TỪ App.tsx
interface SearchResultsPageProps {
  books: BookType[];
}

function SearchResultsPage({ books }: SearchResultsPageProps) {
  // 2. LẤY TỪ KHÓA TỪ URL
  // useSearchParams: Lấy phần ?q=... trên URL (VD: /search?q=React -> lấy được "React")
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("q") || "";

  // 3. FIX LỖI FONT CHỮ (Unicode NFD -> NFC)
  // Hàm normalize("NFC") gộp các dấu rời thành 1 ký tự duy nhất
  const query = rawQuery.normalize("NFC"); 

  // 4. TÌM KIẾM TRỰC TIẾP TRONG MẢNG MOCK_BOOKS
  // - Nếu query rỗng -> trả về []
  // - Nếu có query -> Dùng hàm filter() để lọc mảng
  const results = query
    ? books.filter((book) => {
        // Kiểm tra xem tên sách có chứa từ khóa không (chuyển hết về chữ thường)
        const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
        
        // Kiểm tra xem TÁC GIẢ NÀO có chứa từ khóa không
        // - Dấu ?. : Nếu book.authors bị undefined thì bỏ qua không báo lỗi
        // - .some() : Duyệt qua mảng tác giả. Chỉ cần 1 tác giả khớp là trả về true
        const authorMatch = book.authors?.some((author) => 
          author.toLowerCase().includes(query.toLowerCase())
        );
        
        // Trả về true nếu khớp Tên HOẶC khớp Tác giả
        return titleMatch || authorMatch;
      })
    : [];

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {query ? `Kết quả cho "${query}"` : "Nhập từ khóa để tìm sách"}
      </h2>

      {/* Có từ khóa nhưng không tìm thấy sách nào */}
      {query && results.length === 0 && (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          Không tìm thấy sách nào khớp với "{query}".
        </p>
      )}

      {/* Có kết quả -> Hiển thị ra màn hình */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {results.map((b) => (
            <Book key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;