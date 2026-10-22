// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Nhận từ khóa người dùng gõ.
// - Hiển thị gợi ý (Autocomplete) ngay bên dưới ô input.
// - Bấm Enter hoặc click gợi ý -> Chuyển hướng sang trang kết quả.
// ==============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api";

export default function SearchBar() {
  // ==============================================================================
  // 1. QUẢN LÝ TRẠNG THÁI (STATE)
  // ==============================================================================
  // [NGỮ PHÁP]: useNavigate -> Hook của React Router dùng để chuyển trang bằng code.
  const navigate = useNavigate();
  
  // [NGỮ PHÁP]: useState("") -> Lưu chữ người dùng đang gõ. Mặc định là rỗng.
  const [query, setQuery] = useState("");
  
  // [NGỮ PHÁP]: useState(false) -> Cờ bật/tắt bảng gợi ý. false = ẩn, true = hiện.
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // [NGỮ PHÁP]: useState<string[]>([]) -> Lưu danh sách các từ gợi ý (mảng chuỗi).
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // ==============================================================================
  // 2. THUẬT TOÁN DEBOUNCE (CHỐNG SPAM API)
  // ==============================================================================
  // [LOGIC]: Nếu bạn gõ chữ "Harry", bình thường trình duyệt sẽ gọi API 5 lần (H, Ha, Har, Harr, Harry).
  // Điều này làm sập server. Debounce là kỹ thuật: "Đợi 300ms sau khi ngừng gõ, mới gọi API 1 lần".
  useEffect(() => {
    // [LOGIC]: Nếu gõ chưa đủ 2 chữ -> Xóa gợi ý, không tìm kiếm gì cả.
    if (query.trim().length < 2) {
      setSuggestions([]);
      return; // Thoát hàm, không chạy code bên dưới.
    }

    // [NGỮ PHÁP]: setTimeout -> Đặt một bộ đếm ngược. Sau 300ms thì chạy code bên trong.
    const timer = setTimeout(() => {
      // [THUẬT TOÁN]: Gọi API lấy sách dựa trên từ khóa hiện tại.
      getBooks(query).then((books) => {
        // Bước 1: Lấy ra danh sách tên sách.
        const titles = books.map((b) => b.title);
        
        // Bước 2: Lấy ra danh sách tác giả. 
        // [NGỮ PHÁP]: .flat() -> Dẹt mảng lồng nhau. VD: [["A"], ["B", "C"]] -> ["A", "B", "C"].
        // [NGỮ PHÁP]: .filter(Boolean) -> Loại bỏ các giá trị rỗng/undefined.
        const authors = books.map((b) => b.authors).flat().filter(Boolean) as string[];
        
        // [THUẬT TOÁN XÓA TRÙNG LẶP]: Dùng new Set(). Set tự động loại bỏ các phần tử giống nhau.
        // [VÍ DỤ]: ["Harry", "Harry", "J.K"] -> Set biến thành ["Harry", "J.K"].
        // Dấu ... (Spread) biến Set ngược lại thành mảng để dùng được các hàm khác.
        const unique = [...new Set([...titles, ...authors])];
        
        // [NGỮ PHÁP]: .slice(0, 6) -> Chỉ lấy 6 kết quả đầu tiên để dropdown không bị dài quá.
        setSuggestions(unique.slice(0, 6));
      });
    }, 300); // Đợi 300 mili-giây

    // [NGỮ PHÁP]: Hàm Cleanup.
    // [LOGIC]: Nếu bạn gõ tiếp chữ "a" trước khi hết 300ms, hàm này chạy -> Hủy bộ đếm cũ (clearTimeout).
    // Bộ đếm mới cho "Ha" lại bắt đầu. Nhờ vậy API chỉ gọi khi bạn thực sự ngừng gõ.
    return () => clearTimeout(timer);
  }, [query]); // Dependency Array: Mỗi khi biến 'query' thay đổi, useEffect này chạy lại.

  // ==============================================================================
  // 3. CÁC HÀM XỬ LÝ SỰ KIỆN
  // ==============================================================================
  
  // Hàm chuyển trang
  const goToResults = (keyword: string) => {
    const trimmed = keyword.trim(); // Xóa khoảng trắng thừa 2 đầu
    if (trimmed.length < 2) return; // Không đủ 2 chữ thì không làm gì
    setShowSuggestions(false); // Ẩn bảng gợi ý đi
    
    // [NGỮ PHÁP]: encodeURIComponent -> Biến dấu cách thành %20 để đưa lên URL an toàn.
    // [VÍ DỤ]: "Harry Potter" -> "/search?q=Harry%20Potter"
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    // [NGỮ PHÁP]: onSubmit -> Chạy khi bấm phím Enter.
    <form onSubmit={(e) => { 
      // [LOGIC]: e.preventDefault() -> Chặn hành vi mặc định của form là tải lại trang (F5).
      e.preventDefault(); 
      goToResults(query); 
    }}>
      <div style={{ position: "relative", width: "100%" }}>
        
        {/* Ô INPUT */}
        <input
          type="text"
          placeholder="Nhập tên sách hoặc tác giả..."
          value={query}
          // [LOGIC]: onChange -> Chạy mỗi khi gõ phím. Cập nhật query và bật bảng gợi ý.
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          // [LOGIC]: onBlur -> Chạy khi click ra ngoài ô input.
          // [THUẬT TOÁN]: Đợi 200ms rồi mới ẩn gợi ý. 
          // TẠI SAO? Để trình duyệt kịp nhận sự kiện click vào thẻ <li> gợi ý trước khi bảng bị biến mất.
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{ width: "100%", padding: "12px", borderRadius: "99px", border: "1px solid #ccc" }}
        />

        {/* BẢNG GỢI Ý XỔ XUỐNG */}
        {showSuggestions && suggestions.length > 0 && (
          <ul style={{ position: "absolute", top: "120%", background: "white", width: "100%", zIndex: 10 }}>
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                // [THUẬT TOÁN SỰ KIỆN]: Dùng onMouseDown thay vì onClick.
                // [LOGIC]: Khi click chuột, trình duyệt chạy onMouseDown -> onBlur -> onClick.
                // Nếu dùng onClick, onBlur (đóng menu) sẽ chạy TRƯỚC, làm menu biến mất, bạn không click được.
                // Dùng onMouseDown + e.preventDefault() để chặn onBlur, giúp click thành công.
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  setQuery(suggestion); 
                  goToResults(suggestion); 
                }} 
                style={{ padding: "10px", cursor: "pointer" }}
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