const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// dữ liệu mẫu
const users = [
  { id: 1, name: "Trương Hoàng Thái ThuậnThuận" },
  { id: 2, name: "Nguyễn Đức Quang" },
  { id: 3, name: "Nguyễn Trần Quốc Quang" },
  { id: 4, name: "Bùi Minh Nhựt" },
  { id: 5, name: "Phạm Bảo Tâm" }
];

    
// lấy tất cả users
app.get("/users", (req, res) => {
  res.json(users);
});


// lấy user theo id
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.json({ message: "User không tồn tại" });
  }

  res.json(user);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server chạy port " + PORT);
});