// ==============================================================================
// ADMIN PAGE - BẢNG QUẢN LÝ THÊM/SỬA/XÓA (BẢN FULL COMMENT)
// ==============================================================================

// [NGỮ PHÁP]: Import React để sử dụng React.Fragment
import React, { useState } from "react";
import AdminBookForm from "./AdminBookForm";
import type { Book } from "../types";

// [LOGIC]: Định nghĩa các Props (dữ liệu) mà Component Cha (App.tsx) sẽ truyền xuống.
interface AdminPageProps {
  books: Book[]; // Mảng chứa toàn bộ sách hiện có.
  // Các hàm xử lý API (trả về Promise vì là gọi mạng bất đồng bộ).
  onAddBook: (book: any) => Promise<void>;
  onUpdateBook: (id: string, book: any) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

export default function AdminPage({ books, onAddBook, onUpdateBook, onDeleteBook }: AdminPageProps) {
  
  // ==============================================================================
  // 1. QUẢN LÝ TRẠNG THÁI (STATE)
  // ==============================================================================
  // [KEYWORD]: useState<boolean>(false)
  // [LOGIC]: Cờ bật/tắt Form "Thêm Mới". Mặc định là false (ẩn form).
  const [isAdding, setIsAdding] = useState(false); 
  
  // [KEYWORD]: useState<Book | null>(null)
  // [LOGIC]: Lưu trữ thông tin cuốn sách ĐANG ĐƯỢC CHỌN ĐỂ SỬA.
  // Mặc định là null (không sửa cuốn nào). Nếu có sửa, nó sẽ chứa object của cuốn sách đó.
  const [editingBook, setEditingBook] = useState<Book | null>(null); 

  // ==============================================================================
  // 2. CÁC HÀM XỬ LÝ SỰ KIỆN (EVENT HANDLERS)
  // ==============================================================================
  
  // Hàm xử lý khi người dùng bấm nút "Lưu" trong Form (Thêm hoặc Sửa).
  const handleSave = async (data: any) => {
    // [LOGIC]: Kiểm tra xem có cuốn sách nào đang trong trạng thái Sửa không (editingBook khác null).
    if (editingBook) {
      // [LOGIC]: Nếu đang sửa -> Gọi hàm API cập nhật (truyền id và dữ liệu mới).
      await onUpdateBook(editingBook.id, data);
      // [LOGIC]: Cập nhật xong thì đóng form sửa lại (gán editingBook về null).
      setEditingBook(null); 
    } else {
      // [LOGIC]: Nếu không có cuốn nào đang sửa -> Tức là đang Thêm mới.
      await onAddBook(data);
      // [LOGIC]: Thêm xong thì đóng form thêm (gán isAdding về false).
      setIsAdding(false); 
    }
  };

  // Hàm xử lý khi người dùng bấm nút "Xóa".
  const handleDeleteClick = (id: string, title: string) => {
    // [KEYWORD]: window.confirm() -> Hiện hộp thoại xác nhận (Yes/No) của trình duyệt.
    // [LOGIC]: Trả về true nếu bấm OK, false nếu bấm Cancel.
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn cuốn sách "${title}"? Hành động này không thể hoàn tác!`);
    
    if (isConfirmed) {
      onDeleteBook(id); // Nếu đồng ý thì gọi hàm xóa.
    }
  };

  // ==============================================================================
  // 3. GIAO DIỆN (UI)
  // ==============================================================================
  return (
    // [CSS]: padding: 40px -> Căn lề trên dưới 40px. maxWidth: 1200px -> Không cho bảng rộng quá 1200px.
    // [CSS]: margin: "0 auto" -> Căn giữa toàn bộ trang.
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* KHU VỰC HEADER: Chứa Tiêu đề và Nút Thêm */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#1e293b" }}>🛠️ Trang Quản Trị</h1>
        
        {/* NÚT THÊM SÁCH MỚI */}
        <button 
          onClick={() => { 
            // [LOGIC]: Khi bấm nút này, bật form thêm (isAdding = true) 
            setIsAdding(true); 
            // và tắt form sửa (phòng trường hợp đang mở form sửa của cuốn khác).
            setEditingBook(null); 
          }}
          style={{ padding: "10px 20px", background: "#10b981", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          + Thêm Sách Mới
        </button>
      </div>

      {/* =========================================================================
          KHU VỰC 1: FORM THÊM MỚI
          [NGỮ PHÁP]: {isAdding && (...)} -> Toán tử logic AND. 
          Nếu isAdding = true, vế phải mới được render. Nếu false, nó bỏ qua không vẽ gì cả.
          ========================================================================= */}
      {isAdding && (
        // [CSS]: border: "2px dashed #10b981" -> Viền nét đứt màu xanh lá để phân biệt form thêm.
        <div style={{ marginBottom: "20px", border: "2px dashed #10b981", borderRadius: "8px" }}>
          <AdminBookForm 
            initialData={null} // [LOGIC]: null = Không có dữ liệu cũ (Chế độ thêm mới).
            onSave={handleSave} 
            onCancel={() => setIsAdding(false)} // [LOGIC]: Hủy thì tắt form.
          />
        </div>
      )}

      {/* =========================================================================
          KHU VỰC 2: BẢNG DANH SÁCH SÁCH VÀ FORM SỬA INLINE
          ========================================================================= */}
      {/* [CSS]: borderRadius, overflow hidden -> Bo góc bảng và cắt phần thừa. */}
      <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        
        {/* [KEYWORD]: <table> -> Thẻ tạo bảng HTML. borderCollapse: "collapse" -> Gộp các viền lại thành 1 nét mảnh. */}
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          
          {/* [KEYWORD]: <thead> -> Phần đầu của bảng. */}
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <tr>
              <th style={{ padding: "12px 16px" }}>Ảnh</th>
              <th style={{ padding: "12px 16px" }}>Tên sách</th>
              <th style={{ padding: "12px 16px" }}>Tác giả</th>
              <th style={{ padding: "12px 16px" }}>Kệ</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>

          {/* [KEYWORD]: <tbody> -> Phần thân của bảng, chứa dữ liệu. */}
          <tbody>
            {/* [THUẬT TOÁN LẶP]: .map() duyệt qua mảng 'books' (từ App.tsx truyền xuống). */}
            {books.map((book) => (
              
              // [KEYWORD CỰC QUAN TRỌNG]: <React.Fragment key={book.id}>
              // [TẠI SAO DÙNG?]: 
              // 1. Vòng lặp map yêu cầu trả về 1 phần tử duy nhất.
              // 2. Nhưng ta cần trả về 2 thẻ <tr> (1 dòng thông tin, 1 dòng form sửa).
              // 3. Nếu bọc bằng <div>, HTML sẽ lỗi (vì trong <tbody> không được có <div>).
              // => Fragment giúp gom 2 thẻ <tr> lại mà KHÔNG tạo ra thẻ HTML thừa.
              // key={book.id} để React phân biệt các cuốn sách.
              <React.Fragment key={book.id}>
                
                {/* =========================================================
                    DÒNG 1: HIỂN THỊ THÔNG TIN SÁCH
                    ========================================================= */}
                {/* [LOGIC]: Nếu cuốn sách này đang được chọn sửa (editingBook.id === book.id), 
                    đổi màu nền thành #f1f5f9 (xám nhạt) để làm nổi bật dòng đang sửa. */}
                <tr style={{ 
                  borderBottom: "1px solid #e2e8f0", 
                  background: editingBook?.id === book.id ? "#f1f5f9" : "white",
                  transition: "background-color 0.2s" // Hiệu ứng chuyển màu mượt
                }}>
                  
                  {/* Cột 1: Ảnh */}
                  <td style={{ padding: "12px 16px" }}>
                    <img 
                      src={book.imageLinks?.thumbnail} 
                      alt="cover" 
                      // [CSS]: objectFit: "cover" -> Ép ảnh vừa khung mà không bị méo.
                      style={{ width: "40px", height: "60px", objectFit: "cover", borderRadius: "4px" }} 
                    />
                  </td>
                  
                  {/* Cột 2: Tên sách */}
                  <td style={{ padding: "12px 16px", fontWeight: "600" }}>{book.title}</td>
                  
                  {/* Cột 3: Tác giả */}
                  {/* [NGỮ PHÁP]: book.authors?.join(", ") -> Nối mảng tác giả thành chuỗi. Dấu ?. để tránh lỗi nếu ko có tác giả. */}
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>{book.authors?.join(", ")}</td>
                  
                  {/* Cột 4: Kệ sách */}
                  <td style={{ padding: "12px 16px" }}>{book.shelf}</td>
                  
                  {/* Cột 5: Nút Hành động */}
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    
                    {/* NÚT SỬA: Bật form sửa cho cuốn sách này. */}
                    <button 
                      onClick={() => { setEditingBook(book); setIsAdding(false); }} 
                      style={{ marginRight: "8px", padding: "6px 12px", background: "#eab308", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Sửa
                    </button>
                    
                    {/* NÚT XÓA: Gọi hàm xóa. */}
                    <button 
                      onClick={() => handleDeleteClick(book.id, book.title)} 
                      style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>

                {/* =========================================================
                    DÒNG 2: FORM SỬA INLINE (CHỈ HIỆN KHI ĐANG SỬA CUỐN NÀY)
                    [MẤU CHỐT ĐỂ FORM NẰM DƯỚI DÒNG SÁCH]:
                    Đoạn code này BẮT BUỘC phải nằm ngay bên trong <tbody>, 
                    ngay dưới thẻ <tr> thông tin sách thì nó mới bung ra đúng chỗ.
                    ========================================================= */}
                {editingBook?.id === book.id && (
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
                    
                    {/* [KEYWORD]: colSpan={5} -> Gộp 5 cột (Ảnh, Tên, Tác giả, Kệ, Hành động) lại thành 1 cột duy nhất.
                        Mục đích: Để Form không bị bóp méo trong 1 ô hẹp, mà có toàn bộ chiều ngang của bảng. */}
                    <td colSpan={5} style={{ padding: 0 }}>
                      
                      <AdminBookForm 
                        initialData={editingBook} // [LOGIC]: Truyền cuốn sách đang sửa vào để form tự điền dữ liệu cũ.
                        onSave={handleSave} 
                        onCancel={() => setEditingBook(null)} // [LOGIC]: Bấm Hủy thì đóng form (gán về null).
                      />
                      
                    </td>
                  </tr>
                )}
                
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}