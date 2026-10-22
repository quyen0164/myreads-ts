// ==============================================================
// THANH TÌM KIẾM (AUTOCOMPLETE)
// ==============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dữ liệu mồi để test gợi ý
const MOCK_SEARCH_BOOKS = [
  { id: "1", title: "React Cơ Bản", authors: ["Nguyen Van A"] },
  { id: "2", title: "TypeScript Nâng Cao", authors: ["Tran Thi B"] },
  { id: "3", title: "JavaScript Nâng Cao", authors: ["Nguyen Van A"] },
  { id: "4", title: "Lập Trình Web", authors: ["Pham Van D"] },
];

function SearchBar() {
  const navigate = useNavigate();
  
  // STATE 1: Chữ đang gõ. (VD: "re")
  const [query, setQuery] = useState("");
  // STATE 2: Bật/tắt bảng gợi ý. (True = Đang hiện)
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- CHUẨN BỊ DỮ LIỆU GỢI Ý ---
  const allTitles = MOCK_SEARCH_BOOKS.map((b) => b.title); // Lấy hết tên sách
  const allAuthors = MOCK_SEARCH_BOOKS.map((b) => b.authors).flat(); // Lấy hết tác giả (dẹt mảng)
  const allSuggestions = [...new Set([...allTitles, ...allAuthors])]; // Gộp + Xóa trùng lặp

  // Chỉ gợi ý khi gõ >= 2 ký tự (tránh gõ chữ "R" đã xổ ra 100 kết quả)
  const isValidQuery = query.trim().length >= 2;

  // --- THUẬT TOÁN LỌC & SẮP XẾP ---
  const filteredSuggestions = !isValidQuery
    ? [] // Chưa đủ 2 chữ -> Trả về rỗng (không hiện gì)
    : allSuggestions
        // BƯỚC A: LỌC (FILTER). VD query="re". 
        // - item.toLowerCase() biến "React" thành "react".
        // - .includes() kiểm tra xem "react" có chứa "re" không. Nếu có -> Giữ lại.
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        
        // BƯỚC B: SẮP XẾP (SORT). Ưu tiên từ BẮT ĐẦU bằng query lên đầu.
        .sort((a, b) => {
          // startsWith(): Kiểm tra xem từ đó có BẮT ĐẦU bằng query không?
          // VD: "React" bắt đầu bằng "re" -> true. "TypeScript" chứa "re" nhưng không bắt đầu -> false.
          const aStarts = a.toLowerCase().startsWith(query.toLowerCase());
          const bStarts = b.toLowerCase().startsWith(query.toLowerCase());
          
          // Quy tắc của hàm .sort trong JS:
          // - Trả về số ÂM (-1): a đứng trước b
          // - Trả về số DƯƠNG (1): b đứng trước a
          // - Trả về 0: Giữ nguyên vị trí
          if (aStarts && !bStarts) return -1; // a bắt đầu bằng query, b thì không -> a lên trước
          if (!aStarts && bStarts) return 1;  // b bắt đầu bằng query, a thì không -> b lên trước
          return 0;                           // Cả 2 cùng bắt đầu hoặc cùng không -> giữ nguyên
        })
        
        // BƯỚC C: GIỚI HẠN. Chỉ lấy 6 kết quả đầu tiên cho gọn.
        .slice(0, 6);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  
  // HÀM 1: Chạy khi bạn gõ phím vào ô input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.value: Lấy chữ bạn vừa gõ. (VD: Bạn gõ "a" -> e.target.value = "a")
    setQuery(e.target.value); // Lưu vào State để hiển thị lên ô input
    setShowSuggestions(true); // Bật bảng gợi ý lên
  };

  // HÀM 2: Chạy khi bạn bấm phím ENTER
  const handleSubmit = (e: React.FormEvent) => {
    // Mặc định trình duyệt sẽ F5 (reload) trang khi submit form. 
    // e.preventDefault() chặn việc F5 đó lại.
    e.preventDefault(); 
    
    // Gọi hàm chuyển trang với chữ hiện tại (query)
    goToResults(query); 
  };

  // HÀM 3: Chạy khi bạn CLICK CHUỘT vào 1 dòng gợi ý
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion); // Điền chữ đó vào ô input (cho đẹp)
    goToResults(suggestion); // Chuyển trang luôn (không cần bấm Enter)
  };

  // HÀM PHỤ: Hàm chuyển trang (Dùng chung cho cả Enter và Click)
  const goToResults = (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed.length < 2) return; // Không đủ 2 chữ thì không làm gì cả
    setShowSuggestions(false); // Ẩn bảng gợi ý đi
    // navigate: Chuyển URL sang /search?q=...
    // encodeURIComponent: Biến dấu cách thành %20 để đưa lên URL an toàn
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
        <input
          type="text"
          placeholder="Nhập tên sách hoặc tác giả..."
          value={query} // Hiển thị chữ từ State lên
          onChange={handleInputChange} // Gọi HÀM 1 khi gõ
          // Khi click ra ngoài (blur), đợi 200ms mới ẩn gợi ý (để kịp nhận sự kiện click)
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{ width: "100%", padding: "12px 20px", fontSize: "16px", borderRadius: "24px", border: "1px solid #ddd", outline: "none", boxSizing: "border-box" }}
        />

        {/* HIỂN THỊ BẢNG GỢI Ý */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", listStyle: "none", margin: 0, padding: "5px 0", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxHeight: "250px", overflowY: "auto" }}>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                // Dùng onMouseDown thay vì onClick: Nó chạy TRƯỚC sự kiện onBlur, tránh việc bảng bị đóng trước khi kịp click
                onMouseDown={(e) => {
                  e.preventDefault(); // Chặn onBlur
                  handleSuggestionClick(suggestion); // Gọi HÀM 3
                }}
                style={{ padding: "10px 20px", cursor: "pointer", borderBottom: index !== filteredSuggestions.length - 1 ? "1px solid #f0f0f0" : "none" }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export default SearchBar;