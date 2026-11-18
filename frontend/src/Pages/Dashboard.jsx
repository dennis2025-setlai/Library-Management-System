
import {
  BookOpen,
  BookCheck,
  BookX,
  AlertTriangle
} from "lucide-react";

function Dashboard({ books }) {
  const totalBooks = books.length;

  const availableBooks = books.filter(
    book => book.quantity > 0
  ).length;

  const borrowedBooks = books.reduce(
    (total, book) => total + book.quantity,
    0
  );

  const lowStockBooks = books.filter(
    book => book.quantity < 2
  );

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Community Library Management System.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <BookOpen size={30} />
          <div>
            <h3>Total Book Titles</h3>
            <h2>{totalBooks}</h2>
          </div>
        </div>

        <div className="stat-card">
          <BookCheck size={30} />
          <div>
            <h3>Available Titles</h3>
            <h2>{availableBooks}</h2>
          </div>
        </div>

        <div className="stat-card">
          <BookX size={30} />
          <div>
            <h3>Total Available Copies</h3>
            <h2>{borrowedBooks}</h2>
          </div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={30} />
          <div>
            <h3>Low Stock Titles</h3>
            <h2>{lowStockBooks.length}</h2>
          </div>
        </div>
      </div>

      <section className="table-section">
        <h2>Book Availability</h2>

        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Available Quantity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.quantity}</td>
                <td>
                  {book.quantity === 0 ? (
                    <span className="status unavailable">
                      Out of Stock
                    </span>
                  ) : book.quantity < 2 ? (
                    <span className="status low">
                      Low Stock
                    </span>
                  ) : (
                    <span className="status available">
                      Available
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {books.length === 0 && (
              <tr>
                <td colSpan="5">No books have been added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;
