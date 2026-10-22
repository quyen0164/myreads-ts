// ============================================
// BOOKSAPI - "Người đưa thư" giao tiếp với Server Udacity
// ============================================
// File này không quan tâm giao diện đẹp hay xấu. Nó chỉ có 1 nhiệm vụ:
// Cầm dữ liệu từ React -> Gửi lên Server Udacity -> Nhận kết quả trả về.

import { Book, Shelf } from "./types";

const api = "https://reactnd-books-api.udacity.com";

// ============================================
// PHẦN 1: TẠO "THẺ NHÂN VIÊN" (TOKEN)
// ============================================
// Server Udacity yêu cầu mỗi máy tính phải có 1 mã định danh riêng để phân biệt thư viện sách.
// Nếu không có mã này, ai vào cũng thấy chung 1 thư viện sách.

let token = localStorage.token; // Mở "ví" của trình duyệt ra xem có sẵn token chưa.

if (!token) {
  // Nếu chưa có (!token), ta phải tạo ngẫu nhiên 8 ký tự.
  // Math.random(): Tạo số thập phân ngẫu nhiên (VD: 0.123456)
  // .toString(36): Biến số đó thành chuỗi chữ và số (VD: "0.k2j9f1a4x8")
  // .slice(-8): Cắt lấy 8 ký tự cuối cùng (VD: "j9f1a4x8")
  // localStorage.token = ...: Lưu chuỗi đó vào ví để lần sau F5 không mất.
  token = localStorage.token = Math.random().toString(36).slice(-8);
}

// ============================================
// PHẦN 2: CHUẨN BỊ "PHONG BÌ THƯ" (HEADERS)
// ============================================
// Khi gửi yêu cầu lên Server, ta phải kẹp theo thông tin phụ để Server biết ta là ai.
const headers: HeadersInit = {
  Accept: "application/json", // Báo Server: "Hãy trả kết quả cho tôi dưới dạng JSON nhé"
  Authorization: token,       // Dán "thẻ nhân viên" (token) của tôi vào đây
};

// ============================================
// PHẦN 3: HÀM LẤY TOÀN BỘ SÁCH (getAll)
// ============================================
// Mục đích: Lấy danh sách sách đang có trong thư viện để hiển thị lên trang chủ.
export const getAll = async (): Promise<Book[]> => {
  // fetch() là hàm gọi mạng. Ta gọi đến API /books.
  // Vì không truyền "method", mặc định nó sẽ là GET (Lấy dữ liệu về).
  // await: Chờ Server phản hồi rồi mới chạy tiếp.
  const res = await fetch(`${api}/books`, { headers });
  
  // res.json(): Bóc lớp vỏ bọc bên ngoài ra, lấy dữ liệu thật bên trong.
  const data = await res.json();
  
  // Server trả về Object { books: [...] }, ta chỉ cần lấy mảng sách (data.books).
  return data.books;
};

// ============================================
// PHẦN 4: HÀM CẬP NHẬT KỆ SÁCH (update)
// ============================================
// Mục đích: Khi người dùng chọn Dropdown đổi kệ, ta gửi lệnh lên Server để lưu lại.
export const update = async (book: Book, shelf: Shelf): Promise<any> => {
  // Gọi đến API của đúng cuốn sách đó (thông qua book.id)
  const res = await fetch(`${api}/books/${book.id}`, {
    // method: "PUT" có nghĩa là: "Tôi muốn SỬA thông tin cuốn sách này" (không phải tạo mới).
    method: "PUT",
    headers: { 
      ...headers, // Dấu ... (Spread) là copy toàn bộ thẻ nhân viên (token) ở trên vào đây.
      "Content-Type": "application/json" // Báo Server: "Dữ liệu tôi gửi lên có định dạng JSON nhé"
    },
    // body: Là nội dung lá thư tôi muốn gửi đi.
    // JSON.stringify: Mạng không hiểu Object, nó chỉ hiểu chuỗi văn bản. Ta phải "đóng gói" nó lại.
    // VD: { shelf: "read" } -> biến thành chuỗi '{"shelf":"read"}'
    body: JSON.stringify({ shelf }), 
  });
  return res.json(); // Trả về thông báo thành công từ Server.
};

// ============================================
// PHẦN 5: HÀM TÌM KIẾM SÁCH (search)
// ============================================
// Mục đích: Khi người dùng gõ vào ô tìm kiếm, gửi từ khóa lên Server để lấy kết quả.
export const search = async (query: string, maxResults = 20): Promise<Book[]> => {
  // Gọi API search.
  const res = await fetch(`${api}/search`, {
    // method: "POST" nghĩa là: "Tôi muốn GỬI dữ liệu lên để yêu cầu tìm kiếm".
    // Tại sao không dùng GET? Vì từ khóa tìm kiếm có thể chứa dấu cách, tiếng Việt. Dùng POST giấu nó trong body sẽ an toàn hơn.
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    // Gửi từ khóa (query) và số lượng kết quả mong muốn (maxResults) lên Server.
    body: JSON.stringify({ query, maxResults }),
  });
  
  const data = await res.json();
  
  // data.error ? [] : data.books (Toán tử 3 ngôi)
  // Nghĩa là: Nếu Server báo lỗi (VD: gõ từ khóa không tìm thấy sách) 
  // -> Trả về mảng rỗng [] để giao diện không bị sập.
  // Ngược lại -> Trả về danh sách sách tìm được (data.books).
  return data.error ? [] : data.books; 
};