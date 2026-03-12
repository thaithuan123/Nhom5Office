import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://backend-webbandienthoai.onrender.com/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Danh sách Users</h1>
      {users.map(u => (
        <p key={u.id}>{u.id} - {u.name}</p>
      ))}
    </div>
  );
}

export default Users;