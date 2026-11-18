
import { useState } from "react";

function Books({ books, setBooks }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    quantity: ""
  });

  async function addBook(e) {
    e.preventDefault();

    const form = e.target;

    const newBook = {
      title: form.title.value.trim(),
      author: form.author.value.trim(),
      genre: form.genre.value.trim(),
      isbn: form.isbn.value.trim(),
      quantity: Number(form.quantity.value)
    };

    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.genre ||
      !newBook.isbn ||
      form.quantity.value === "" ||
      !Number.isInteger(newBook.quantity) ||
      newBook.quantity < 0
    ) {
      alert("Please complete all fields correctly.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      const updatedResponse = await fetch("http://localhost:5000/api/books");
      const updatedBooks = await updatedResponse.json();

      setBooks(updatedBooks);
      form.reset();
      alert("Book added successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  function startEditing(book) {
    setEditingId(book.id);
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      quantity: String(book.quantity)
    });
  }

  async function saveEdit(id) {
    const updatedBook = {
      ...editForm,
      title: editForm.title.trim(),
      author: editForm.author.trim(),
      genre: editForm.genre.trim(),
      isbn: editForm.isbn.trim(),
      quantity: Number(editForm.quantity)
    };

    if (
      !updatedBook.title ||
      !updatedBook.author ||
      !updatedBook.genre ||
      !updatedBook.isbn ||
      editForm.quantity === "" ||
      !Number.isInteger(updatedBook.quantity) ||
      updatedBook.quantity < 0
    ) {
      alert("Please complete all fields correctly.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book.");
      }

      const updatedResponse = await fetch("http://localhost:5000/api/books");
      const updatedBooks = await updatedResponse.json();

      setBooks(updatedBooks);
      setEditingId(null);
      alert("Book updated successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteBook(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book.");
      }

      setBooks(books.filter(book => book.id !== id));
      alert("Book deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Book Management</h1>
        <p>Add and manage library books.</p>
      </div>

      <section className="table-section">
        <h2>Add New Book</h2>

        <form onSubmit={addBook} className="book-form">
          <input name="title" placeholder="Book Title" required />
          <input name="author" placeholder="Author" required />
          <input name="genre" placeholder="Genre" required />
          <input name="isbn" placeholder="ISBN" required />
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            placeholder="Initial Quantity"
            required
          />
          <button type="submit">Add Book</button>
        </form>
      </section>

      <section className="table-section">
        <h2>All Books ({books.length})</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                {editingId === book.id ? (
                  <>
                    <td>
                      <input
                        value={editForm.title}
                        onChange={e => setEditForm({
                          ...editForm,
                          title: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.author}
                        onChange={e => setEditForm({
                          ...editForm,
                          author: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.genre}
                        onChange={e => setEditForm({
                          ...editForm,
                          genre: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.isbn}
                        onChange={e => setEditForm({
                          ...editForm,
                          isbn: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={editForm.quantity}
                        onChange={e => setEditForm({
                          ...editForm,
                          quantity: e.target.value
                        })}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => saveEdit(book.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => startEditing(book)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Books;
