// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - TypeScript cần biết dữ liệu có hình dáng ra sao để báo lỗi nếu bạn gõ sai.
// - Ví dụ: Bạn gõ book.tittle (thay vì title) -> TypeScript sẽ gạch đỏ báo lỗi ngay.
// ==============================================================================

// [NGỮ PHÁP]: export type -> Xuất ra một kiểu dữ liệu mới để file khác dùng chung.
// [NGỮ PHÁP]: Dấu "|" (Union Type) nghĩa là "HOẶC". 
// [LOGIC]: Biến 'Shelf' CHỈ ĐƯỢC PHÉP nhận 1 trong 4 chuỗi này. 
// Nếu bạn gán shelf = "dangdoc" -> Lỗi ngay. Phải là "currentlyReading".
export type Shelf = "currentlyReading" | "wantToRead" | "read" | "none";

// [NGỮ PHÁP]: export interface -> Định nghĩa cấu trúc của một Object (Đối tượng).
// [LOGIC]: Một cuốn sách (Book) bắt buộc phải có id và title.
export interface Book {
  id: string;           // Mã định danh duy nhất (VD: "1", "2")
  title: string;        // Tên sách
  
  // [NGỮ PHÁP]: Dấu "?" (Optional) -> Có cũng được, không có cũng không sao.
  // [LOGIC]: Có những cuốn sách không có tác giả hoặc không có ảnh bìa. 
  // Nếu không có dấu "?", TypeScript sẽ bắt bạn phải điền đủ, gây lỗi.
  authors?: string[];   // Mảng các tác giả (VD: ["Nguyen Van A", "Tran Thi B"])
  
  imageLinks?: {        // Object chứa link ảnh
    thumbnail: string;  
  };
  
  shelf?: Shelf;        // Cuốn sách đang nằm ở kệ nào (dùng kiểu Shelf ở trên)
}