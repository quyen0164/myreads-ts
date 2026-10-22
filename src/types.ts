// ==============================================================
// MỤC ĐÍCH: Định nghĩa "bản thiết kế" cho dữ liệu.
// Giúp TypeScript kiểm tra xem code của bạn có đang dùng sai thuộc tính không.
// ==============================================================

// 1. Định nghĩa các Kệ sách hợp lệ.
// Cú pháp "A | B | C" (Union Type) nghĩa là: Biến này CHỈ ĐƯỢC PHÉP là 1 trong các giá trị này.
// Nếu bạn gán shelf = "dangdoc" -> TypeScript sẽ báo lỗi đỏ ngay.
export type Shelf = "currentlyReading" | "wantToRead" | "read" | "none";

// 2. Định nghĩa cấu trúc của 1 cuốn sách (Book).
// Dùng interface để khai báo các trường (thuộc tính) mà 1 cuốn sách cần có.
export interface Book {
  id: string;           // Mã định danh duy nhất (bắt buộc)
  title: string;        // Tên sách (bắt buộc)
  
  // Dấu chấm hỏi "?" nghĩa là "Có thể có hoặc không có" (Optional).
  // Vì có những cuốn sách không có tác giả, hoặc không có ảnh bìa.
  authors?: string[];   // Mảng tên tác giả (VD: ["Nguyen Van A", "Tran Thi B"])
  imageLinks?: {        // Thông tin ảnh bìa
    thumbnail: string;  // Đường dẫn ảnh
  };
  
  shelf?: Shelf;        // Cuốn sách này đang nằm ở kệ nào (dùng kiểu Shelf ở trên)
}