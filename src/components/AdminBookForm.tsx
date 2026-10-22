// ==============================================================================
// ADMIN BOOK FORM - Dùng chung cho cả Thêm Mới và Cập Nhật
// ==============================================================================
import { useState, useEffect } from "react";
import type { Book, Shelf } from "../types";

interface Props {
  initialData?: Book | null; // Nếu có dữ liệu truyền vào -> Chế độ Sửa. Nếu null -> Chế độ Thêm.
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function AdminBookForm({ initialData, onSave, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [shelf, setShelf] = useState<Shelf>("wantToRead");

  // [LOGIC]: Khi component được mở, nếu có initialData (chế độ Sửa), tự động điền thông tin cũ vào Form.
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthors(initialData.authors?.join(", ") || ""); // Nối mảng tác giả thành chuỗi
      setThumbnail(initialData.imageLinks?.thumbnail || "");
      setShelf(initialData.shelf || "wantToRead");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tách chuỗi tác giả thành mảng. VD: "A, B" -> ["A", "B"]
    const authorsArray = authors.split(",").map(a => a.trim()).filter(Boolean);

    const bookData = {
      title,
      authors: authorsArray,
      thumbnail,
      shelf,
    };

    onSave(bookData); // Gửi dữ liệu ra ngoài cho AdminPage xử lý
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#f8fafc", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #cbd5e1" }}>
      <h3 style={{ marginBottom: "15px" }}>{initialData ? "✏️ Sửa Thông Tin Sách" : "➕ Thêm Sách Mới"}</h3>
      
      <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "bold" }}>Tên sách</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
        </div>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "bold" }}>Tác giả (cách nhau bằng phẩy)</label>
          <input value={authors} onChange={e => setAuthors(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
        </div>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "bold" }}>Link Ảnh bìa (URL)</label>
          <input value={thumbnail} onChange={e => setThumbnail(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
        </div>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "bold" }}>Kệ sách</label>
          <select value={shelf} onChange={e => setShelf(e.target.value as Shelf)} style={{ width: "100%", padding: "8px", marginTop: "4px" }}>
            <option value="currentlyReading">Đang đọc</option>
            <option value="wantToRead">Sẽ đọc</option>
            <option value="read">Đã đọc</option>
            <option value="none">Bỏ chọn</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button type="submit" style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Lưu Thay Đổi
        </button>
        <button type="button" onClick={onCancel} style={{ padding: "8px 16px", background: "#cbd5e1", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Hủy Bỏ
        </button>
      </div>
    </form>
  );
}