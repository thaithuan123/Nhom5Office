const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tt2"
});

db.connect(err => {
  if (err) {
    console.log("Lỗi kết nối DB");
  } else {
    console.log("Kết nối DB thành công");
  }
});


// lấy tất cả users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});


// lấy user theo id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id=?", [id], (err, result) => {
    if (err) return res.send(err);
    res.json(result[0]);
  });
});

app.listen(3000, () => {
  console.log("Server chạy port 3000");
});