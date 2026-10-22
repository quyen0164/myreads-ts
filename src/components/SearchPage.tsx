import { useState } from "react";

// ============================================
// 1. DỮ LIỆU GIẢ LẬP
// ============================================
const MOCK_SEARCH_BOOKS = [
  { id: "1", title: "React Cơ Bản", authors: ["Nguyen Van A"] },
  { id: "2", title: "TypeScript Nâng Cao", authors: ["Tran Thi B"] },
  { id: "3", title: "JavaScript Nâng Cao", authors: ["Nguyen Van A"] },
  { id: "4", title: "Lập Trình Web", authors: ["Pham Van D"] },
];

function SearchPage() {
  // ============================================
  // 2. GOM DỮ LIỆU GỢI Ý (Chạy 1 lần khi mở trang)
  // ============================================
  // Lấy ra mảng toàn bộ Tên sách: ["React Cơ Bản", "TypeScript Nâng Cao", ...]
  const allTitles = MOCK_SEARCH_BOOKS.map((book) => book.title);
  
  // Lấy ra mảng toàn bộ Tác giả. Vì authors là mảng lồng mảng nên phải dùng .flat()
  // Kết quả: ["Nguyen Van A", "Tran Thi B", "Nguyen Van A", "Pham Van D"]
  const allAuthors = MOCK_SEARCH_BOOKS.map((book) => book.authors).flat();

  // Dùng new Set() để gộp và tự động xóa trùng lặp. 
  // Kết quả cuối cùng: ["React Cơ Bản", "TypeScript Nâng Cao", "JavaScript Nâng Cao", "Lập Trình Web", "Nguyen Van A", "Tran Thi B", "Pham Van D"]
  const allSuggestions = [...new Set([...allTitles, ...allAuthors])];

  // ============================================
  // 3. QUẢN LÝ STATE
  // ============================================
  // State lưu chữ người dùng đang gõ
  const [query, setQuery] = useState("");
  
  // State bật/tắt hộp gợi ý. Ban đầu là false (ẩn).
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ============================================
  // 4. LOGIC LỌC & SẮP XẾP GỢI Ý (Chạy mỗi khi 'query' thay đổi)
  // ============================================
  
  // Chỉ bắt đầu tìm kiếm khi gõ từ 2 ký tự trở lên (Tránh việc gõ chữ "R" đã xổ ra 100 kết quả)
  const isValidQuery = query.trim().length >= 2;

  const filteredSuggestions = !isValidQuery 
    ? [] // Nếu chưa đủ 2 ký tự -> Trả về mảng rỗng (Không hiện gợi ý)
    : allSuggestions
        // Bước A: Lọc những từ có chứa chữ đang gõ (không phân biệt hoa thường)
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        
        // Bước B: Sắp xếp. Ưu tiên những từ BẮT ĐẦU BẰNG chữ đang gõ lên đầu
        .sort((a, b) => {
          // Kiểm tra xem từ 'a' và 'b' có bắt đầu bằng chữ đang gõ không?
          const aStarts = a.toLowerCase().startsWith(query.toLowerCase());
          const bStarts = b.toLowerCase().startsWith(query.toLowerCase());
          
          // Nếu 'a' bắt đầu bằng query, còn 'b' thì không -> 'a' đứng trước 'b' (return -1)
          if (aStarts && !bStarts) return -1;
          // Ngược lại, nếu 'b' bắt đầu bằng query, 'a' không -> 'b' đứng trước (return 1)
          if (!aStarts && bStarts) return 1;
          // Nếu cả 2 cùng bắt đầu hoặc cùng không bắt đầu -> Giữ nguyên vị trí
          return 0;
        })
        
        // Bước C: Chỉ lấy tối đa 6 kết quả để hộp gợi ý không bị dài quá màn hình
        .slice(0, 6);

  // ============================================
  // 5. CÁC HÀM XỬ LÝ SỰ KIỆN
  // ============================================
  
  // Hàm chạy khi người dùng gõ phím vào ô Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // 1. Lưu chữ vừa gõ vào State
    setShowSuggestions(true); // 2. Hiện hộp gợi ý lên
  };

  // Hàm chạy khi người dùng click vào 1 dòng trong hộp gợi ý
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);       // 1. Điền từ gợi ý đó vào ô Input
    setShowSuggestions(false);  // 2. Ẩn hộp gợi ý đi
  };

  // ============================================
  // 6. GIAO DIỆN
  // ============================================
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      
      {/* KHU VỰC HEADER (STICKY - DÍNH TRÊN CÙNG) */}
      <div style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        backgroundColor: "white", 
        padding: "15px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          
          <input
            type="text"
            placeholder="Nhập tên sách hoặc tác giả..."
            value={query}
            onChange={handleInputChange}
            // Khi click ra ngoài (blur), đợi 200ms rồi mới ẩn gợi ý
            // (Đợi 200ms để kịp nhận sự kiện click vào thẻ <li> gợi ý trước khi nó bị biến mất)
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{ 
              width: "100%", 
              padding: "12px 20px", 
              fontSize: "16px", 
              borderRadius: "24px", 
              border: "1px solid #ddd", 
              outline: "none",
              boxSizing: "border-box" 
            }}
          />

          {/* HỘP GỢI Ý XỔ XUỐNG */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul style={{
              position: "absolute", // Nổi lên trên giao diện
              top: "110%",          // Nằm ngay dưới ô input
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              listStyle: "none",
              margin: 0,
              padding: "5px 0",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxHeight: "250px",
              overflowY: "auto"
            }}>
              {filteredSuggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ 
                    padding: "10px 20px", 
                    cursor: "pointer",
                    borderBottom: index !== filteredSuggestions.length - 1 ? "1px solid #f0f0f0" : "none"
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG */}
      <div style={{ maxWidth: "800px", margin: "30px auto", padding: "0 20px" }}>
        <p style={{ color: "#666", fontStyle: "italic" }}>
          (Khu vực hiển thị kết quả sách - Sẽ làm ở bước sau)
        </p>
      </div>
    </div>
  );
}

export default SearchPage;