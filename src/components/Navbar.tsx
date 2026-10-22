// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px"
    }}>
      {/* 1. LOGO - Bấm vào sẽ quay về Trang chủ */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "28px" }}>📚</span>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.5px" }}>
          MyReads
        </span>
      </Link>

      {/* 2. THANH TÌM KIẾM - Nằm ở giữa */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <SearchBar />
      </div>

      {/* 3. KHU VỰC BÊN PHẢI (Nút Admin + Avatar) */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        {/* NÚT ĐIỀU HƯỚNG ĐẾN TRANG ADMIN */}
        <Link 
          to="/admin" 
          style={{ 
            textDecoration: "none", 
            color: "#475569", 
            fontWeight: "600", 
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "#f1f5f9",
            transition: "all 0.2s"
          }}
          // Hiệu ứng đổi màu khi rê chuột vào
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#475569"; }}
        >
          ⚙️ Quản Trị
        </Link>

        {/* AVATAR GIẢ LẬP */}
        <div style={{ 
          width: "40px", 
          height: "40px", 
          borderRadius: "50%", 
          backgroundColor: "#3b82f6", 
          color: "white", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontWeight: "bold" 
        }}>
          U
        </div>
      </div>
    </header>
  );
}