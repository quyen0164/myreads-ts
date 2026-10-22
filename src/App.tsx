import { useState } from "react";
import MainPage from "./components/MainPage";
import type { Book } from "./types";

// 1. DỮ LIỆU GIẢ (MOCK DATA)
// Chúng ta tạo sẵn 4 cuốn sách với các kệ khác nhau để test giao diện.
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
    // Không có shelf (hoặc shelf: "none")
  },
];

function App() {
  // 2. useState: Tạo một "bộ nhớ" chứa danh sách sách.
  // Ban đầu, chúng ta nạp dữ liệu giả (MOCK_BOOKS) vào đây.
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);

  // 3. HIỂN THỊ
  // Truyền danh sách sách xuống cho MainPage.
  // (Tạm thời chưa cần hàm thay đổi kệ sách).
  return (
    <MainPage books={books} />
  );
}

export default App;