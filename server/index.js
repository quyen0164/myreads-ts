// ==============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN CẦN THIẾT
// ==============================================================================
// [NGỮ PHÁP]: import ... from "..." -> Cú pháp ES Module (hiện đại) để lấy code từ thư viện.
// [LOGIC]: 
// - express: Thư viện giúp tạo server (như anh bồi bàn nhận order).
// - Database (better-sqlite3): Thư viện giúp đọc/ghi file myreads.db (như căn bếp).
// - cors: Thư viện giúp mở cửa cho React (cổng 5173) gọi sang Server (cổng 3001).
import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

// [NGỮ PHÁP]: Khởi tạo đối tượng app từ express.
// [LOGIC]: Biến 'app' này chính là Server của chúng ta. Mọi cấu hình sẽ gắn lên nó.
const app = express();

// [THUẬT TOÁN/MIDDLEWARE]: Middleware là các hàm chạy TRƯỚC KHI request được xử lý.
app.use(cors()); // Cho phép React gọi API (Bỏ qua bộ lọc bảo mật CORS của trình duyệt).
app.use(express.json()); // Tự động "bóc vỏ" dữ liệu JSON do React gửi lên và gắn vào biến 'req.body'.

// ==============================================================================
// BƯỚC 2: KHỞI TẠO DATABASE (CĂN BẾP)
// ==============================================================================
// [LOGIC]: new Database("myreads.db") -> Server sẽ tìm file này ở thư mục gốc.
// Nếu file chưa tồn tại, nó sẽ TỰ ĐỘNG TẠO RA một file trống rỗng.
const db = new Database("myreads.db");

// [NGỮ PHÁP]: db.exec() -> Dùng để chạy một câu lệnh SQL mà không cần lấy kết quả trả về.
// [LOGIC]: Tạo bảng 'books' gồm 5 cột. Lệnh "IF NOT EXISTS" nghĩa là: 
// Nếu bảng đã tồn tại rồi (từ lần chạy trước) thì bỏ qua, không tạo lại (tránh mất dữ liệu).
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,     -- ID duy nhất của sách, không được trùng
    title TEXT NOT NULL,     -- Tên sách (bắt buộc phải có)
    authors TEXT,            -- Tác giả (sẽ lưu dưới dạng chuỗi JSON)
    thumbnail TEXT,          -- Link ảnh bìa
    shelf TEXT               -- Kệ sách (currentlyReading, read, wantToRead, none)
  )
`);

// ==============================================================================
// BƯỚC 3: NẠP DỮ LIỆU MẪU (CHỈ NẠP 1 LẦN DUY NHẤT)
// ==============================================================================
// [NGỮ PHÁP]: db.prepare("...").get() -> Lấy ra dòng dữ liệu ĐẦU TIÊN khớp với câu lệnh.
// [THUẬT TOÁN]: Đếm xem trong bảng 'books' đang có bao nhiêu cuốn sách. 
// Gán số lượng đó cho countRow.count.
const countRow = db.prepare("SELECT COUNT(*) as count FROM books").get();

// [LOGIC]: Nếu số lượng sách = 0 (tức là Database trống, lần đầu mới chạy).
if (countRow.count === 0) {
  console.log("⏳ Database trống, đang nạp 12 cuốn sách mẫu...");
  
  // [NGỮ PHÁP]: prepare() -> Biên dịch sẵn câu lệnh SQL. Dấu ? là các "chỗ trống" sẽ được điền sau.
  // [THUẬT TOÁN]: Dùng dấu ? thay vì nối chuỗi trực tiếp để chống lỗi bảo mật SQL Injection.
  const insert = db.prepare(`INSERT INTO books (id, title, authors, thumbnail, shelf) VALUES (?, ?, ?, ?, ?)`);
  
  // [LOGIC]: Tạo một mảng chứa 12 cuốn sách mẫu (Object).
  const initialBooks = [
    { id: "1", title: "Eloquent JavaScript", authors: ["Marijn Haverbeke"], thumbnail: "https://covers.openlibrary.org/b/id/10523338-L.jpg", shelf: "currentlyReading" },
    { id: "2", title: "Clean Code", authors: ["Robert C. Martin"], thumbnail: "https://covers.openlibrary.org/b/id/135182-L.jpg", shelf: "currentlyReading" },
    { id: "3", title: "The Pragmatic Programmer", authors: ["Andrew Hunt"], thumbnail: "https://covers.openlibrary.org/b/id/11218663-L.jpg", shelf: "wantToRead" },
    { id: "4", title: "You Don't Know JS", authors: ["Kyle Simpson"], thumbnail: "https://covers.openlibrary.org/b/id/10909258-L.jpg", shelf: "wantToRead" },
    { id: "5", title: "Harry Potter và Hòn Đá Phù Thủy", authors: ["J.K. Rowling"], thumbnail: "https://covers.openlibrary.org/b/id/8259449-L.jpg", shelf: "read" },
    { id: "6", title: "The Hobbit", authors: ["J.R.R. Tolkien"], thumbnail: "https://covers.openlibrary.org/b/id/6979861-L.jpg", shelf: "read" },
    { id: "7", title: "Sapiens: Lược Sử Loài Người", authors: ["Yuval Noah Harari"], thumbnail: "https://covers.openlibrary.org/b/id/12388200-L.jpg", shelf: "none" },
    { id: "8", title: "Nhà Giả Kim", authors: ["Paulo Coelho"], thumbnail: "https://covers.openlibrary.org/b/id/8231856-L.jpg", shelf: "none" },
    { id: "9", title: "Steve Jobs", authors: ["Walter Isaacson"], thumbnail: "https://covers.openlibrary.org/b/id/7251565-L.jpg", shelf: "none" },
    { id: "10", title: "Thinking, Fast and Slow", authors: ["Daniel Kahneman"], thumbnail: "https://covers.openlibrary.org/b/id/10795644-L.jpg", shelf: "none" },
    { id: "11", title: "The Great Gatsby", authors: ["F. Scott Fitzgerald"], thumbnail: "https://covers.openlibrary.org/b/id/10594030-L.jpg", shelf: "none" },
    { id: "12", title: "Dế Mèn Phiêu Lưu Ký", authors: ["Tô Hoài"], thumbnail: "https://covers.openlibrary.org/b/id/10478475-L.jpg", shelf: "none" }
  ];

  // [THUẬT TOÁN]: Vòng lặp for...of duyệt qua từng cuốn sách trong mảng 12 cuốn ở trên.
  for (const b of initialBooks) {
    // [NGỮ PHÁP]: JSON.stringify(mảng) -> Biến một Mảng (Array) thành Chuỗi (String).
    // [LOGIC]: Cơ sở dữ liệu SQLite không hiểu Mảng. Nó chỉ hiểu chữ.
    // VÍ DỤ: ["J.K. Rowling"] -> Biến thành chuỗi '["J.K. Rowling"]' thì mới lưu được vào cột 'authors'.
    const authorsAsString = JSON.stringify(b.authors);
    
    // [NGỮ PHÁP]: .run() -> Thực thi câu lệnh INSERT và điền các giá trị vào dấu ? theo đúng thứ tự.
    insert.run(b.id, b.title, authorsAsString, b.thumbnail, b.shelf);
  }
  console.log("✅ Đã nạp 12 cuốn sách thành công!");
}

// ==============================================================================
// BƯỚC 4: HÀM HỖ TRỢ ĐỊNH DẠNG DỮ LIỆU (CHUYỂN TỪ DB SANG REACT)
// ==============================================================================
// [LOGIC]: Database trả về cột 'authors' dưới dạng chuỗi '["A","B"]'. 
// React cần nó là mảng ["A","B"] để dùng hàm .join() hoặc .map().
function formatRows(rows) {
  // [THUẬT TOÁN]: .map() duyệt qua mảng các dòng dữ liệu thô (rows) và biến đổi chúng.
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    // [NGỮ PHÁP]: JSON.parse() -> Biến chuỗi '["A","B"]' ngược lại thành mảng ["A","B"].
    authors: JSON.parse(r.authors), 
    // [LOGIC]: Đóng gói thumbnail vào object imageLinks để giống cấu trúc chuẩn của Udacity cũ.
    imageLinks: { thumbnail: r.thumbnail }, 
    shelf: r.shelf,
  }));
}

// ==============================================================================
// BƯỚC 5: TẠO CÁC API ROUTES (CÁC CỬA ĐỂ REACT GỌI VÀO)
// ==============================================================================

// --- API 1: LẤY SÁCH VÀ TÌM KIẾM ---
// [NGỮ PHÁP]: app.get("/api/books", callback) -> Mở một cửa GET tại đường dẫn /api/books.
// [LOGIC]: Khi React gọi fetch('/api/books'), hàm callback này sẽ chạy.
app.get("/api/books", (req, res) => {
  // [NGỮ PHÁP]: req.query.q -> Lấy từ khóa tìm kiếm trên URL. 
  // [VÍ DỤ]: URL là /api/books?q=Clean -> biến q sẽ có giá trị là "Clean".
  const q = req.query.q; 
  
  if (q) {
    // [THUẬT TOÁN TÌM KIẾM]: Dùng câu lệnh SQL LIKE.
    // Dấu % đại diện cho bất kỳ ký tự nào. 
    // VÍ DỤ: searchTerm = "%Clean%". Nó sẽ tìm thấy "Clean Code" vì có chứa chữ Clean.
    const searchTerm = `%${q}%`;
    
    // [NGỮ PHÁP]: .all() -> Lấy TẤT CẢ các dòng thỏa mãn điều kiện (khác với .get() chỉ lấy 1).
    const rows = db.prepare("SELECT * FROM books WHERE title LIKE ? OR authors LIKE ?").all(searchTerm, searchTerm);
    
    // [NGỮ PHÁP]: res.json() -> Trả dữ liệu về cho React dưới dạng JSON.
    return res.json({ books: formatRows(rows) });
  }
  
  // [LOGIC]: Nếu không có từ khóa (q bị rỗng), lấy toàn bộ sách trong Database.
  const rows = db.prepare("SELECT * FROM books").all();
  res.json({ books: formatRows(rows) });
});

// --- API 2: CẬP NHẬT KỆ SÁCH ---
// [NGỮ PHÁP]: app.put(...) -> Mở cửa PUT. PUT dùng để cập nhật/sửa dữ liệu.
app.put("/api/books", (req, res) => {
  // [NGỮ PHÁP]: Destructuring (Bóc tách) object req.body.
  // [LOGIC]: React gửi lên object { id: "1", shelf: "read" }. 
  // Ta lấy ra 2 biến id và shelf để dùng.
  const { id, shelf } = req.body; 
  
  // [THUẬT TOÁN CẬP NHẬT]: 
  // - UPDATE books: Chọn bảng books để sửa.
  // - SET shelf = ?: Đổi cột shelf thành kệ mới.
  // - WHERE id = ?: Tìm đúng cuốn sách có id tương ứng để sửa.
  db.prepare("UPDATE books SET shelf = ? WHERE id = ?").run(shelf, id);
  
  // [LOGIC]: Trả về thông báo thành công cho React biết.
  res.json({ success: true });
});

// [NGỮ PHÁP]: app.listen(3001) -> Bật server lên và lắng nghe ở cổng 3001.
app.listen(3001, () => console.log(`🚀 Backend đang chạy tại http://localhost:3001`));