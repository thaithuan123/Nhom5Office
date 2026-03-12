import { useEffect, useState } from "react";
import "./App.css";

function App() {
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

export default App;