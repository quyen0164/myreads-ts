// ==============================================================================
// TẠI SAO CẦN FILE NÀY?
// - Để gom tất cả các lệnh gọi mạng (fetch) về một chỗ.
// - Nếu sau này Backend đổi đường dẫn (VD: /api/books thành /api/v2/sach), 
//   bạn chỉ cần sửa ở đây, không cần chạy đi sửa từng Component.
// ==============================================================================

// [NGỮ PHÁP]: import type -> Chỉ lấy phần định nghĩa kiểu dữ liệu, không lấy code chạy.
import type { Book, Shelf } from "./types";

// --- HÀM 1: LẤY SÁCH ---
// [NGỮ PHÁP]: async -> Đánh dấu hàm này chạy bất đồng bộ (có thể mất thời gian chờ mạng).
// [NGỮ PHÁP]: Promise<Book[]> -> Hứa rằng sau khi chạy xong, hàm sẽ trả về một Mảng các cuốn sách.
export const getBooks = async (query?: string): Promise<Book[]> => {
  // [THUẬT TOÁN]: Nếu có truyền từ khóa (query) thì nối vào URL, không thì lấy toàn bộ.
  // [NGỮ PHÁP]: encodeURIComponent() -> Biến dấu cách thành %20. 
  // VÍ DỤ: "Harry Potter" -> "Harry%20Potter". Nếu không có hàm này, URL sẽ bị lỗi.
  const url = query ? `/api/books?q=${encodeURIComponent(query)}` : `/api/books`;
  
  // [NGỮ PHÁP]: await fetch() -> Gửi request và CHỜ đến khi server trả lời mới chạy dòng tiếp theo.
  // [LOGIC]: Gọi đến Backend Express (đã được cấu hình proxy tự động chuyển sang cổng 3001).
  const res = await fetch(url);
  
  // [NGỮ PHÁP]: .json() -> "Bóc vỏ" dữ liệu server trả về thành object JavaScript.
  const data = await res.json();
  
  // [LOGIC]: Server trả về object { books: [...] }. Ta chỉ cần lấy phần mảng sách (data.books).
  return data.books;
};

// --- HÀM 2: CẬP NHẬT KỆ SÁCH ---
// [NGỮ PHÁP]: shelf: Shelf -> Bắt buộc truyền vào 1 trong 4 kệ đã định nghĩa.
export const updateBookShelf = async (id: string, shelf: Shelf) => {
  // [NGỮ PHÁP]: fetch() với method: "PUT" -> Báo cho Backend biết: "Tôi muốn SỬA dữ liệu".
  await fetch("/api/books", {
    method: "PUT", 
    // [NGỮ PHÁP]: headers -> Khai báo định dạng dữ liệu gửi đi là JSON.
    headers: { "Content-Type": "application/json" },
    // [NGỮ PHÁP]: JSON.stringify() -> Đóng gói object thành chuỗi để gửi qua mạng.
    // VÍ DỤ: { id: "1", shelf: "read" } -> '{"id":"1","shelf":"read"}'
    body: JSON.stringify({ id, shelf }), 
  });
};