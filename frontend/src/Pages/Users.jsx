
import { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("Member");
  const [editId, setEditId] = useState(null);

  async function loadUsers() {
    try {
      const response = await fetch("http://localhost:5000/api/users");

      if (!response.ok) {
        throw new Error("Failed to load users.");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setName("");
    setMembershipId("");
    setRole("Member");
    setEditId(null);
  }

  async function saveUser(e) {
    e.preventDefault();

    if (!name.trim() || !membershipId.trim()) {
      alert("Please complete all fields.");
      return;
    }

    const userData = {
      name: name.trim(),
      membership_id: membershipId.trim(),
      role
    };

    try {
      const url = editId !== null
        ? `http://localhost:5000/api/users/${editId}`
        : "http://localhost:5000/api/users";

      const response = await fetch(url, {
        method: editId !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save user.");
      }

      await loadUsers();
      resetForm();

      alert(
        editId !== null
          ? "User updated successfully!"
          : "User added successfully!"
      );
    } catch (error) {
      alert(error.message);
    }
  }

  function editUser(user) {
    setName(user.name);
    setMembershipId(user.membership_id);
    setRole(user.role);
    setEditId(user.id);
  }

  async function deleteUser(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }

      setUsers(users.filter(user => user.id !== id));

      if (editId === id) {
        resetForm();
      }

      alert("User deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage library members and administrators.</p>
      </div>

      <section className="table-section">
        <h2>{editId !== null ? "Update User" : "Add New User"}</h2>

        <form onSubmit={saveUser} className="book-form">
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            placeholder="Membership ID"
            value={membershipId}
            onChange={e => setMembershipId(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option>Member</option>
            <option>Admin</option>
          </select>

          <button type="submit">
            {editId !== null ? "Update User" : "Add User"}
          </button>

          {editId !== null && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="table-section">
        <h2>Registered Users ({users.length})</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Membership ID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.membership_id}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4">No registered users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Users;
