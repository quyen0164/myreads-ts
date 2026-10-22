// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Đây là "Bộ não" (Global State) của toàn bộ ứng dụng.
// - Nó giữ danh sách toàn bộ sách (books) và cung cấp cho các trang khác.
// - Nó thiết lập Router (Trình điều hướng) để biết đường dẫn nào hiển thị trang nào.
// ==============================================================================

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import SearchResultsPage from "./components/SearchResultsPage";
import Navbar from "./components/Navbar";
import type { Book, Shelf } from "./types";
import { getBooks, updateBookShelf, addNewBook, updateFullBook, deleteBook } from "./api";
import AdminPage from "./components/AdminPage";

function App() {
  // ==============================================================================
  // 1. QUẢN LÝ TRẠNG THÁI (STATE)
  // ==============================================================================
  // [NGỮ PHÁP]: useState<Book[]>([]) -> Tạo một bộ nhớ tên là 'books' (mảng sách).
  // [LOGIC]: Mọi thay đổi về sách (Thêm, xóa, đổi kệ) ĐỀU PHẢI đi qua hàm 'setBooks'.
  // Khi 'setBooks' được gọi, React sẽ tự động vẽ lại (re-render) toàn bộ giao diện.
  const [books, setBooks] = useState<Book[]>([]);

  // [NGỮ PHÁP]: useEffect -> Chạy một đoạn code sau khi giao diện đã tải xong.
  // [LOGIC]: Mảng rỗng [] ở cuối nghĩa là "Chỉ chạy DUY NHẤT 1 LẦN khi mở trang web".
  useEffect(() => {
    // [THUẬT TOÁN]: Khi vừa mở web, tự động gọi API lấy toàn bộ sách từ SQLite.
    const loadInitialBooks = async () => {
      const data = await getBooks(); 
      setBooks(data); // Lưu vào bộ nhớ -> Giao diện hiển thị sách.
    };
    loadInitialBooks();
  }, []); 

  // ==============================================================================
  // 2. HÀM XỬ LÝ ĐỔI KỆ SÁCH (TRÁI TIM CỦA ỨNG DỤNG)
  // ==============================================================================
  // [NGỮ PHÁP]: async (id: string, newShelf: Shelf) -> Hàm nhận vào ID sách và Kệ mới.
  const handleShelfChange = async (id: string, newShelf: Shelf) => {
    
    // [THUẬT TOÁN: OPTIMISTIC UI - CẬP NHẬT LẠC QUAN]
    // [LOGIC]: Tại sao không chờ API lưu xong rồi mới vẽ lại? Vì như thế sẽ bị giật lag.
    // Ta cập nhật giao diện NGAY LẬP TỨC, rồi âm thầm gửi API sau.
    setBooks((prevBooks) => {
      // [NGỮ PHÁP]: .map() -> Duyệt qua mảng sách cũ (prevBooks) để tạo mảng mới.
      return prevBooks.map((b) => {
        // [LOGIC]: Nếu đúng là cuốn sách đang được click (b.id === id):
        // - Dấu ...b (Spread Operator) nghĩa là: "Giữ nguyên toàn bộ thông tin cũ (tên, ảnh...)".
        // - shelf: newShelf -> Chỉ thay đổi duy nhất thuộc tính 'shelf' thành kệ mới.
        if (b.id === id) {
          return { ...b, shelf: newShelf };
        }
        // Nếu là cuốn sách khác, giữ nguyên không làm gì cả.
        return b;
      });
    });

    // [THUẬT TOÁN: LƯU VÀO DATABASE (CHẠY NGẦM)]
    // [NGỮ PHÁP]: try...catch -> Cố gắng chạy code. Nếu có lỗi (rớt mạng) thì nhảy vào catch.
    try {
      // Gọi API để lưu xuống SQLite. (Chờ nó lưu xong).
      await updateBookShelf(id, newShelf);
      console.log("Đã lưu vào Database thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      // [LOGIC]: Nếu lưu thất bại, ta phải tải lại dữ liệu gốc từ Server 
      // để giao diện không bị sai lệch so với Database.
      const data = await getBooks();
      setBooks(data);
    }
  };
   const loadBooks = async () => { const data = await getBooks(); setBooks(data); };
  useEffect(() => { loadBooks(); }, []);

  // --- HÀM THÊM SÁCH (Dành cho Admin) ---
  const handleAddBook = async (newBook: any) => {
    const res = await addNewBook(newBook);
    if (res.success) {
      setBooks(prev => [...prev, res.book]); // Cập nhật UI
    }
  };

  // --- HÀM SỬA SÁCH (Dành cho Admin) ---
  const handleUpdateBook = async (id: string, bookData: any) => {
    await updateFullBook(id, bookData);
    // [LOGIC]: Tải lại danh sách để đồng bộ chính xác các trường thông tin đã sửa.
    loadBooks();
  };

  // --- HÀM XÓA SÁCH (Dành cho Admin) ---
  const handleDeleteBook = async (id: string) => {
    // 1. Cập nhật giao diện ngay lập tức (Xóa khỏi mảng)
    setBooks(prev => prev.filter(b => b.id !== id));
    // 2. Gọi API xóa khỏi Database
    await deleteBook(id);
  };

  // ==============================================================================
  // 3. GIAO DIỆN VÀ ĐIỀU HƯỚNG (ROUTER)
  // ==============================================================================
  return (
    // [NGỮ PHÁP]: BrowserRouter -> Bọc toàn bộ app để kích hoạt tính năng chuyển trang không load lại web.
    <BrowserRouter>
      
      {/* Navbar: Thanh điều hướng (Logo + Thanh tìm kiếm). Nằm ngoài Routes nên luôn hiển thị. */}
      <Navbar />

      {/* [NGỮ PHÁP]: Routes -> Nơi chứa các tuyến đường. */}
      <Routes>
        {/* [LOGIC]: Nếu URL là "/" (Trang chủ): Hiển thị MainPage. 
            Truyền 'books' (mảng sách) và 'handleShelfChange' (hàm đổi kệ) xuống. */}
        <Route 
          path="/" 
          element={<MainPage books={books} onShelfChange={handleShelfChange} />} 
        />
        
        {/* [LOGIC]: Nếu URL là "/search" (Trang tìm kiếm): Hiển thị SearchResultsPage.
            Truyền 'handleShelfChange' xuống để trang Search cũng đổi kệ được. */}
        <Route 
          path="/search" 
          element={<SearchResultsPage onShelfChange={handleShelfChange} />} 
        />

         {/* TRUYỀN CÁC HÀM XUỐNG TRANG ADMIN */}
        <Route path="/admin" element={
          <AdminPage 
            books={books} 
            onAddBook={handleAddBook} 
            onUpdateBook={handleUpdateBook} 
            onDeleteBook={handleDeleteBook} 
          />
        } />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;