import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <header style={{
      position: "sticky", // [LOGIC]: Dính trên cùng khi cuộn trang
      top: 0, 
      zIndex: 100, // [LOGIC]: Luôn nổi lên trên các cuốn sách
      backgroundColor: "rgba(255, 255, 255, 0.85)", // Nền trắng hơi trong suốt
      backdropFilter: "blur(12px)", // [THUẬT TOÁN CSS]: Hiệu ứng kính mờ (Glassmorphism)
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 32px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      gap: "24px"
    }}>
      {/* [NGỮ PHÁP]: Link -> Thẻ <a> nhưng không load lại trang */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "28px" }}>📚</span>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>MyReads</span>
      </Link>

      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <SearchBar />
      </div>

      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
        U
      </div>
    </header>
  );
}