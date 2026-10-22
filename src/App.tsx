// ==============================================================
// MỤC ĐÍCH: Trung tâm quản lý dữ liệu. 
// Tạm thời nó đang cấp dữ liệu giả (MOCK_DATA) cho MainPage.
// ==============================================================
import { useState } from "react";
import MainPage from "./components/MainPage";
import type { Book } from "./types";

// 1. DỮ LIỆU GIẢ: Tạo sẵn 4 cuốn sách với các kệ khác nhau để test giao diện.
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
    // Cố tình không có shelf để test trường hợp sách chưa xếp kệ
  },
];

function App() {
  // 2. KHAI BÁO STATE:
  // - useState: Tạo bộ nhớ cho React.
  // - <Book[]>: Báo cho TS biết biến 'books' là một mảng các cuốn sách.
  // - (MOCK_BOOKS): Giá trị khởi tạo ban đầu.
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);

  return (
    // 3. TRUYỀN DỮ LIỆU XUỐNG:
    // Truyền danh sách sách xuống cho MainPage.
    // (Tạm thời chưa cần truyền hàm thay đổi kệ sách).
    <MainPage books={books} />
  );
}

export default App;