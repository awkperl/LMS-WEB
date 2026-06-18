import { useEffect, useState } from "react";
import { api } from "../services/api";
import CreateBook from "../components/CreateBook";

export default function Library({ token }) {

  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));


  // ======================
  // LOAD ALL BOOKS
  // ======================
  const loadBooks = async () => {
    try {
      const data = await api("/books", "GET", null, token);
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // LOAD MY PURCHASED BOOKS
  // ======================
  const loadMyBooks = async () => {
    try {
      const data = await api("/books/my/books", "GET", null, token);
      setMyBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBooks();
    loadMyBooks();
  }, []);

  // ======================
  // BUY BOOK
  // ======================
  const buyBook = async (bookId) => {
    try {
      setLoading(true);

      const res = await api(
        "/books/purchase",
        "POST",
        { book_id: bookId },
        token
      );

      alert("Purchase initiated (complete payment when integrated)");

      console.log(res);

      loadMyBooks();

    } catch (err) {
      console.error(err);
      alert(err.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // CHECK IF PURCHASED
  // ======================
  const isPurchased = (bookId) => {
    return myBooks.some(b => b.id === bookId);
  };

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h2>📚 Digital Library</h2>
        <p style={{ color: "gray" }}>
          Buy and download learning materials
        </p>
      </div>

      {/* MY BOOKS */}
      <div style={{ marginBottom: 40 }}>
        <h3>📥 My Library</h3>

        {myBooks.length === 0 && (
          <p style={{ color: "gray" }}>
            No purchased books yet
          </p>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20
        }}>

          {myBooks.map(book => (
            <div key={book.id}
              style={{
                background: "white",
                padding: 15,
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>

              <img
                src={book.cover_url}
                alt=""
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 8
                }}
              />

              <h4>{book.title}</h4>

              <p style={{ color: "gray", fontSize: 13 }}>
                {book.blurb}
              </p>

              <a
                href={book.file_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "8px 12px",
                  background: "#111827",
                  color: "white",
                  borderRadius: 6,
                  textDecoration: "none"
                }}
              >
                📥 Download
              </a>

            </div>
          ))}
        </div>
      </div>
      {["instructor","admin"].includes(
 user?.role
) && (

<CreateBook
   token={token}
   refresh={loadBooks}
/>

)}

      {/* ALL BOOKS */}
      <h3>📚 Available Books</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 20
      }}>

        {books.map(book => (
          <div key={book.id}
            style={{
              background: "white",
              padding: 15,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>

            {/* COVER */}
            <img
              src={book.cover_url}
              alt=""
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 8
              }}
            />

            {/* TITLE */}
            <h4>{book.title}</h4>

            {/* BLURB */}
            <p style={{ color: "gray", fontSize: 13 }}>
              {book.blurb?.slice(0, 100)}...
            </p>

            {/* PRICE */}
            <p>
              💰 KES <strong>{book.price}</strong>
            </p>

            {/* INSTRUCTOR */}
            <p style={{ fontSize: 12, color: "#6b7280" }}>
              by {book.instructor_name}
            </p>

            {/* BUTTON */}
            {isPurchased(book.id) ? (
              <button
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "none",
                  background: "#059669",
                  color: "white"
                }}
              >
                ✔ Purchased
              </button>
            ) : (
            
                <button
  onClick={async () => {

    const phone = prompt(
      "Enter M-Pesa Number (07xxxxxxxx)"
    );

    if (!phone) return;

    try {

      await api(
        "/books/purchase",
        "POST",
        {
          book_id: book.id,
          phone
        },
        token
      );

      alert(
        "M-Pesa request sent. Check your phone."
      );

    } catch(err){

      console.error(err);

      alert(
        err.message ||
        "Payment failed"
      );

    }

  }}
  style={{
    padding:"10px 16px",
    background:"#16a34a",
    color:"white",
    border:"none",
    borderRadius:8
  }}
>
   Buy Book
</button>
             
            )}

          </div>
        ))}
      </div>

    </div>
  );
}