
import { useState, useEffect } from "react";

function Transactions({ books, setBooks }) {
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("Borrow");
  const [quantity, setQuantity] = useState(1);
  const [history, setHistory] = useState([]);

  async function loadTransactions() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions"
      );

      if (!response.ok) {
        throw new Error("Failed to load transactions.");
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function recordTransaction(e) {
    e.preventDefault();

    const amount = Number(quantity);
    const selectedBook = books.find(
      book => book.id === Number(bookId)
    );

    if (!selectedBook) {
      alert("Please select a book.");
      return;
    }

    if (!Number.isInteger(amount) || amount < 1) {
      alert("Enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            book_id: Number(bookId),
            type,
            quantity: amount
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Transaction failed.");
      }

      const booksResponse = await fetch(
        "http://localhost:5000/api/books"
      );

      if (!booksResponse.ok) {
        throw new Error("Transaction saved, but books could not refresh. Reload the page.");
      }

      const updatedBooks = await booksResponse.json();
      setBooks(updatedBooks);

      await loadTransactions();

      setBookId("");
      setQuantity(1);

      alert("Transaction recorded successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>Manage book borrowing, returns and stock additions.</p>
      </div>

      <section className="table-section">
        <h2>Record Transaction</h2>

        <form onSubmit={recordTransaction} className="book-form">
          <select
            value={bookId}
            onChange={e => setBookId(e.target.value)}
            required
          >
            <option value="">Select a Book</option>

            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} (Available: {book.quantity})
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option>Borrow</option>
            <option>Return</option>
            <option>Add Stock</option>
          </select>

          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />

          <button type="submit">Record Transaction</button>
        </form>
      </section>

      <section className="table-section">
        <h2>Transaction History ({history.length})</h2>

        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map(item => (
              <tr key={item.id}>
                <td>{item.book_title}</td>
                <td>{item.type}</td>
                <td>{item.quantity}</td>
                <td>
                  {new Date(item.transaction_date).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan="4">No transactions recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Transactions;
