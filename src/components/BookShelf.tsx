// ==============================================================
// MỤC ĐÍCH: Tạo ra 1 cái kệ (VD: Kệ "Currently Reading").
// Nó nhận vào tiêu đề kệ và một MẢNG sách.
// ==============================================================
import Book from "./Book";
import type { Book as BookType } from "../types";

interface BookShelfProps {
  title: string;     // Tiêu đề của kệ (VD: "Currently Reading")
  books: BookType[]; // Mảng chứa nhiều cuốn sách thuộc kệ này
}

function BookShelf({ title, books }: BookShelfProps) {
  return (
    <div style={{ marginBottom: "30px" }}>
      
      {/* Hiển thị tiêu đề kệ */}
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>
        {title}
      </h2>

      {/* Khu vực chứa sách. Dùng flexbox để xếp các cuốn sách nằm ngang */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
        
        {/* 
          Duyệt qua mảng 'books' để vẽ ra từng cuốn.
          - Mỗi lần lặp, nó lấy ra 1 object sách và gán cho biến 'singleBook'.
          - Truyền cả object 'singleBook' xuống Component <Book> qua prop 'book'.
          - key={singleBook.id} là BẮT BUỘC để React phân biệt các cuốn sách khi danh sách thay đổi.
        */}
        {books.map((singleBook) => (
          <Book key={singleBook.id} book={singleBook} />
        ))}
        
      </div>
    </div>
  );
}

export default BookShelf;