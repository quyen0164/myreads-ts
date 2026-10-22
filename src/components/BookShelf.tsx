// Import Component Book ở bước 2
import Book from "./Book";
// Import khuôn mẫu dữ liệu
import type { Book as BookType } from "../types";

// 1. KHAI BÁO PROPS
interface BookShelfProps {
  title: string;     // Tên của kệ (VD: "Currently Reading")
  books: BookType[]; // Mảng chứa nhiều cuốn sách
}

// 2. NHẬN PROPS
function BookShelf({ title, books }: BookShelfProps) {
  return (
    <div style={{ marginBottom: "30px" }}>
      
      {/* HIỂN THỊ TÊN KỆ */}
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>
        {title}
      </h2>

      {/* KHU VỰC CHỨA SÁCH (Dùng Flexbox để xếp ngang) */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
        
        {/* 3. LẶP QUA MẢNG SÁCH ĐỂ HIỂN THỊ */}
        {/* Hàm .map() chạy qua từng cuốn sách trong mảng 'books' */}
        {books.map((singleBook) => (
          
          // key={singleBook.id}: React yêu cầu mỗi phần tử trong vòng lặp phải có 1 key duy nhất.
          // Gọi Component Book và truyền cuốn sách hiện tại vào.
          <Book key={singleBook.id} book={singleBook} />
          
        ))}
      </div>
      
    </div>
  );
}

export default BookShelf;