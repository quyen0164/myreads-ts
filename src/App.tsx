// ==============================================================
// BỘ NÃO CỦA APP (Chứa Mock Data, Router)
// ==============================================================
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import SearchBar from "./components/SearchBar";
import SearchResultsPage from "./components/SearchResultsPage";
import type { Book } from "./types";

// 1. MẢNG MOCK DATA CHÍNH (Chứa các cuốn sách để test)
const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "React Cơ Bản",
    authors: ["Nguyen Van A"],
    imageLinks: { thumbnail: "https://via.placeholder.com/128x193?text=React" },
    shelf: "currentlyReading",
  },
  {
    id: "2",
    title: "TypeScript Nâng Cao",
    authors: ["Tran Thi B"],
    imageLinks: { thumbnail: "https://via.placeholder.com/128x193?text=TS" },
    shelf: "wantToRead",
  },
  {
    id: "3",
    title: "JavaScript Thực Chiến",
    authors: ["Le Van C", "Pham Thi D"],
    imageLinks: { thumbnail: "https://via.placeholder.com/128x193?text=JS" },
    shelf: "read",
  },
  {
    id: "4",
    title: "Sách Chưa Xếp Kệ",
    authors: ["Hoang Van E"],
    imageLinks: { thumbnail: "https://via.placeholder.com/128x193?text=New" },
  },
];

function App() {
  // 2. STATE CHỨA TOÀN BỘ SÁCH (Dùng xuyên suốt App)
  const [books] = useState<Book[]>(MOCK_BOOKS);

  return (
    // 3. BROWSER ROUTER: Quản lý việc chuyển trang (không bị F5)
    <BrowserRouter>
      
      {/* HEADER: Dùng chung ở mọi trang. Sticky = Dính trên cùng khi scroll */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "white", padding: "15px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <SearchBar />
      </header>

      {/* NỘI DUNG TRANG: Thay đổi dựa vào URL */}
      <Routes>
        {/* Đường dẫn "/" -> Hiển thị MainPage */}
        <Route path="/" element={<MainPage books={books} />} />
        
        {/* Đường dẫn "/search" -> Hiển thị SearchResultsPage. TRUYỀN books XUỐNG ĐÂY */}
        <Route path="/search" element={<SearchResultsPage books={books} />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;