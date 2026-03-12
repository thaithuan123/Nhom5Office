import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://backend-webbandienthoai.onrender.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Danh sách Users</h1>

      {users.map((u) => (
        <div key={u.id}>
          {u.id} - {u.name}
        </div>
      ))}
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Trang chủ</h1>
      <Link to="/users">Xem danh sách Users</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

export default App;