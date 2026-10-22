import type { Book, Shelf } from "./types";

// Địa chỉ server của Udacity
const api = "https://reactnd-books-api.udacity.com";

// 1. TẠO TOKEN (Thẻ căn cước của trình duyệt)
// Server yêu cầu mỗi máy phải có 1 mã riêng để lưu thư viện sách riêng.
let token = localStorage.token;
if (!token) {
  token = localStorage.token = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

// 2. HEADERS: Kẹp thẻ căn cước vào mỗi lần gửi request
const headers: HeadersInit = {
  Accept: "application/json",
  Authorization: token, // Gửi token lên cho server biết mình là ai
};

// 3. HÀM LẤY TOÀN BỘ SÁCH
export const getAll = async (): Promise<Book[]> => {
  // fetch: Gọi mạng đến API /books (mặc định là GET)
  const res = await fetch(`${api}/books`, { headers });
  // .json(): Bóc lớp vỏ JSON ra lấy dữ liệu
  const data = await res.json();
  return data.books;
};

// 4. HÀM CẬP NHẬT KỆ SÁCH
export const update = async (book: Book, shelf: Shelf): Promise<any> => {
  const res = await fetch(`${api}/books/${book.id}`, {
    method: "PUT", // PUT nghĩa là "Sửa thông tin"
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ shelf }), // Đóng gói object thành chuỗi JSON để gửi đi
  });
  return res.json();
};

// 5. HÀM TÌM KIẾM SÁCH TRÊN SERVER THẬT
export const search = async (query: string, maxResults = 20): Promise<Book[]> => {
  const res = await fetch(`${api}/search`, {
    method: "POST", // POST để giấu từ khóa trong body cho an toàn
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query, maxResults }),
  });
  const data = await res.json();
  // Nếu server báo lỗi (không tìm thấy) -> trả về mảng rỗng. Ngược lại trả về data.books
  return data.error ? [] : data.books;
};