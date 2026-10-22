// ============================================
// ĐỊNH NGHĨA KHUÔN MẪU DỮ LIỆU
// ============================================

// 1. Định nghĩa các Kệ sách có thể có.
// Dấu | (Union Type) nghĩa là: Cột shelf CHỈ ĐƯỢC PHÉP nhận 1 trong 4 chữ này.
export type Shelf = "currentlyReading" | "wantToRead" | "read" | "none";

// 2. Định nghĩa cấu trúc của 1 cuốn sách
export interface Book {
  id: string;           // ID duy nhất của sách (bắt buộc phải có)
  title: string;        // Tên sách (bắt buộc phải có)
  
  // Dấu ? (Optional): Nghĩa là trường này CÓ THỂ CÓ hoặc KHÔNG CÓ.
  // Vì có những cuốn sách không ghi tác giả, hoặc không có ảnh bìa.
  authors?: string[];   // Mảng tên các tác giả (VD: ["A", "B"])
  imageLinks?: {        // Thông tin ảnh bìa
    thumbnail: string;  // Link ảnh
  };
  shelf?: Shelf;        // Sách đang ở kệ nào
}