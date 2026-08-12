import { useEffect, useState } from "react";
import { api } from "../services/api";
import CreateBook from "../components/CreateBook";

export default function Library({ token }) {

  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);

  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingMyBooks, setLoadingMyBooks] = useState(true);

  const [purchasing, setPurchasing] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [phone, setPhone] = useState("");

  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseError, setPurchaseError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =====================================================
  // LOAD ALL BOOKS
  // =====================================================

  const loadBooks = async () => {

    try {

      setLoadingBooks(true);

      const data = await api(
        "/books",
        "GET",
        null,
        token
      );

      setBooks(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load books:",
        err
      );

    } finally {

      setLoadingBooks(false);

    }

  };


  // =====================================================
  // LOAD MY PURCHASED BOOKS
  // =====================================================

  const loadMyBooks = async () => {

    try {

      setLoadingMyBooks(true);

      const data = await api(
        "/books/my/books",
        "GET",
        null,
        token
      );

      setMyBooks(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load purchased books:",
        err
      );

    } finally {

      setLoadingMyBooks(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadBooks();
    loadMyBooks();

  }, [token]);


  // =====================================================
  // CHECK IF BOOK IS PURCHASED
  // =====================================================

  const isPurchased = (bookId) => {

    return myBooks.some(
      book => book.id === bookId
    );

  };


  // =====================================================
  // OPEN PURCHASE MODAL
  // =====================================================

  const openPurchase = (book) => {

    setSelectedBook(book);

    setPhone("");

    setPurchaseMessage("");

    setPurchaseError("");

  };


  // =====================================================
  // CLOSE PURCHASE MODAL
  // =====================================================

  const closePurchase = () => {

    if (purchasing) return;

    setSelectedBook(null);

    setPhone("");

    setPurchaseMessage("");

    setPurchaseError("");

  };


  // =====================================================
  // PURCHASE BOOK
  // =====================================================

  const purchaseBook = async () => {

    if (!selectedBook) return;


    if (!phone.trim()) {

      setPurchaseError(
        "Please enter your M-Pesa phone number."
      );

      return;

    }


    // Accept:
    // 0712345678
    // 254712345678
    // +254712345678

    const cleanedPhone =
      phone
        .trim()
        .replace(/\s+/g, "")
        .replace(/^\+/, "");


    const validPhone =
      /^((07|01)\d{8}|254(7|1)\d{8})$/
        .test(cleanedPhone);


    if (!validPhone) {

      setPurchaseError(
        "Enter a valid Kenyan M-Pesa number, e.g. 0712345678."
      );

      return;

    }


    try {

      setPurchasing(true);

      setPurchaseError("");

      setPurchaseMessage("");


      const result = await api(

        "/books/purchase",

        "POST",

        {
          book_id:
            selectedBook.id,

          phone:
            cleanedPhone
        },

        token

      );


      console.log(
        "PURCHASE RESPONSE:",
        result
      );


      setPurchaseMessage(
        "M-Pesa payment request sent successfully. Check your phone and complete the payment."
      );


      /*
       * Refresh after a short delay.
       *
       * The purchase will initially be pending.
       * The Daraja callback will later change it
       * to paid.
       */

      setTimeout(() => {

        loadMyBooks();

      }, 3000);


    } catch (err) {

      console.error(
        "Purchase error:",
        err
      );


      setPurchaseError(
        err.message ||
        "Unable to initiate payment."
      );

    } finally {

      setPurchasing(false);

    }

  };


  // =====================================================
  // REFRESH PURCHASES
  // =====================================================

  const refreshLibrary = async () => {

    await loadMyBooks();

  };


  return (

    <div
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}
    >


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        style={{
          marginBottom: "35px"
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827"
          }}
        >
          📚 Digital Library
        </h1>


        <p
          style={{
            marginTop: "8px",
            color: "#6b7280",
            fontSize: "16px"
          }}
        >
          Discover books, purchase learning materials,
          and access your digital collection.
        </p>

      </div>


      {/* ================================================= */}
      {/* MY LIBRARY */}
      {/* ================================================= */}

      <section
        style={{
          marginBottom: "50px"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,
                fontSize: "23px",
                color: "#111827"
              }}
            >
              📥 My Library
            </h2>

            <p
              style={{
                marginTop: "5px",
                color: "#6b7280",
                fontSize: "14px"
              }}
            >
              Books you have purchased
            </p>

          </div>


          <button
            onClick={refreshLibrary}
            disabled={loadingMyBooks}
            style={{
              border: "1px solid #d1d5db",
              background: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor:
                loadingMyBooks
                  ? "not-allowed"
                  : "pointer",
              color: "#374151"
            }}
          >
            ↻ Refresh
          </button>

        </div>


        {loadingMyBooks ? (

          <div
            style={{
              padding: "35px",
              textAlign: "center",
              background: "#f9fafb",
              borderRadius: "12px",
              color: "#6b7280"
            }}
          >
            Loading your library...
          </div>

        ) : myBooks.length === 0 ? (

          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              background: "#f9fafb",
              border: "1px dashed #d1d5db",
              borderRadius: "12px"
            }}
          >

            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px"
              }}
            >
              📚
            </div>

            <h3
              style={{
                margin: "0 0 8px"
              }}
            >
              Your library is empty
            </h3>

            <p
              style={{
                margin: 0,
                color: "#6b7280"
              }}
            >
              Purchase a book below to add it
              to your personal library.
            </p>

          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px"
            }}
          >

            {myBooks.map(book => (

              <div
                key={book.id}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border:
                    "1px solid #e5e7eb",
                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.06)"
                }}
              >

                {/* COVER */}

                <div
                  style={{
                    height: "260px",
                    background: "#f3f4f6",
                    overflow: "hidden"
                  }}
                >

                  <img
                    src={book.cover_url}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                </div>


                {/* CONTENT */}

                <div
                  style={{
                    padding: "18px"
                  }}
                >

                  <div
                    style={{
                      display: "inline-block",
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "4px 9px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "10px"
                    }}
                  >
                    ✓ Purchased
                  </div>


                  <h3
                    style={{
                      margin:
                        "0 0 8px",
                      fontSize: "18px"
                    }}
                  >
                    {book.title}
                  </h3>


                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      minHeight: "42px"
                    }}
                  >
                    {book.blurb}
                  </p>


                  <a
                    href={book.file_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: "15px",
                      padding: "11px",
                      background: "#111827",
                      color: "white",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600"
                    }}
                  >
                    📖 Read / Download
                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ================================================= */}
      {/* ADMIN / INSTRUCTOR BOOK MANAGEMENT */}
      {/* ================================================= */}

      {[
        "instructor",
        "admin"
      ].includes(user?.role) && (

        <section
          style={{
            marginBottom: "45px",
            padding:
              "25px",
            background:
              "#f9fafb",
            borderRadius:
              "12px",
            border:
              "1px solid #e5e7eb"
          }}
        >

          <h2
            style={{
              marginTop: 0
            }}
          >
            📘 Book Management
          </h2>

          <p
            style={{
              color: "#6b7280"
            }}
          >
            Add books and learning materials
            to the digital library.
          </p>


          <CreateBook
            token={token}
            refresh={loadBooks}
          />

        </section>

      )}


      {/* ================================================= */}
      {/* AVAILABLE BOOKS */}
      {/* ================================================= */}

      <section>

        <div
          style={{
            marginBottom: "20px"
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: "23px"
            }}
          >
            📚 Available Books
          </h2>

          <p
            style={{
              marginTop: "5px",
              color: "#6b7280",
              fontSize: "14px"
            }}
          >
            Explore books available for purchase.
          </p>

        </div>


        {loadingBooks ? (

          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#6b7280"
            }}
          >
            Loading books...
          </div>

        ) : books.length === 0 ? (

          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "#f9fafb",
              borderRadius: "12px",
              color: "#6b7280"
            }}
          >
            No books are currently available.
          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "25px"
            }}
          >

            {books.map(book => (

              <div
                key={book.id}
                style={{
                  background: "white",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.06)",
                  transition:
                    "transform 0.2s ease"
                }}
              >

                {/* COVER */}

                <div
                  style={{
                    height: "290px",
                    background: "#f3f4f6",
                    overflow: "hidden"
                  }}
                >

                  <img
                    src={book.cover_url}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                </div>


                {/* BOOK DETAILS */}

                <div
                  style={{
                    padding: "20px"
                  }}
                >

                  <h3
                    style={{
                      margin:
                        "0 0 8px",
                      fontSize: "19px",
                      color: "#111827"
                    }}
                  >
                    {book.title}
                  </h3>


                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.55",
                      minHeight: "65px",
                      marginBottom:
                        "12px"
                    }}
                  >
                    {book.blurb
                      ? book.blurb.length > 120
                        ? book.blurb.substring(
                            0,
                            120
                          ) + "..."
                        : book.blurb
                      : "No description available."}
                  </p>


                  {/* AUTHOR */}

                  <p
                    style={{
                      margin:
                        "8px 0",
                      color: "#6b7280",
                      fontSize: "13px"
                    }}
                  >
                    By{" "}
                    <strong
                      style={{
                        color: "#374151"
                      }}
                    >
                      {book.instructor_name ||
                        "Onet Learning"}
                    </strong>
                  </p>


                  {/* PRICE */}

                  <div
                    style={{
                      margin:
                        "15px 0",
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#111827"
                    }}
                  >
                    KES{" "}
                    {Number(
                      book.price
                    ).toLocaleString(
                      "en-KE",
                      {
                        minimumFractionDigits:
                          2
                      }
                    )}
                  </div>


                  {/* PURCHASE STATUS */}

                  {isPurchased(book.id) ? (

                    <button
                      disabled
                      style={{
                        width: "100%",
                        padding:
                          "12px",
                        border:
                          "none",
                        borderRadius:
                          "8px",
                        background:
                          "#dcfce7",
                        color:
                          "#166534",
                        fontWeight:
                          "700",
                        cursor:
                          "default"
                      }}
                    >
                      ✓ Already Purchased
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        openPurchase(book)
                      }
                      style={{
                        width: "100%",
                        padding:
                          "12px",
                        border:
                          "none",
                        borderRadius:
                          "8px",
                        background:
                          "#16a34a",
                        color:
                          "white",
                        fontWeight:
                          "700",
                        cursor:
                          "pointer",
                        fontSize:
                          "15px"
                      }}
                    >
                      Buy with M-Pesa
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ================================================= */}
      {/* PURCHASE MODAL */}
      {/* ================================================= */}

      {selectedBook && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "450px",
              background: "white",
              borderRadius: "16px",
              padding: "25px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)"
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                marginBottom:
                  "20px"
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0
                  }}
                >
                  Purchase Book
                </h2>

                <p
                  style={{
                    marginTop: "6px",
                    color: "#6b7280",
                    fontSize: "14px"
                  }}
                >
                  Complete your purchase
                  using M-Pesa.
                </p>

              </div>


              <button
                onClick={closePurchase}
                disabled={purchasing}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  fontSize: "22px",
                  cursor:
                    "pointer",
                  color: "#6b7280"
                }}
              >
                ×
              </button>

            </div>


            {/* BOOK */}

            <div
              style={{
                display: "flex",
                gap: "15px",
                padding: "12px",
                background:
                  "#f9fafb",
                borderRadius:
                  "10px",
                marginBottom:
                  "20px"
              }}
            >

              <img
                src={
                  selectedBook.cover_url
                }
                alt={
                  selectedBook.title
                }
                style={{
                  width: "65px",
                  height: "85px",
                  objectFit: "cover",
                  borderRadius:
                    "6px"
                }}
              />


              <div>

                <strong>
                  {selectedBook.title}
                </strong>

                <p
                  style={{
                    margin:
                      "8px 0 0",
                    color:
                      "#6b7280"
                  }}
                >
                  KES{" "}
                  {Number(
                    selectedBook.price
                  ).toLocaleString(
                    "en-KE",
                    {
                      minimumFractionDigits:
                        2
                    }
                  )}
                </p>

              </div>

            </div>


            {/* PHONE */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom:
                  "8px"
              }}
            >
              M-Pesa Phone Number
            </label>


            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder="0712345678"
              disabled={purchasing}
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                padding:
                  "12px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
                fontSize:
                  "15px",
                outline:
                  "none"
              }}
            />


            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop:
                  "7px"
              }}
            >
              You will receive an M-Pesa
              payment request on this number.
            </p>


            {/* SUCCESS MESSAGE */}

            {purchaseMessage && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  background:
                    "#dcfce7",
                  color:
                    "#166534",
                  borderRadius:
                    "8px",
                  fontSize:
                    "14px"
                }}
              >
                ✓ {purchaseMessage}
              </div>

            )}


            {/* ERROR MESSAGE */}

            {purchaseError && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  background:
                    "#fee2e2",
                  color:
                    "#991b1b",
                  borderRadius:
                    "8px",
                  fontSize:
                    "14px"
                }}
              >
                {purchaseError}
              </div>

            )}


            {/* ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px"
              }}
            >

              <button
                onClick={closePurchase}
                disabled={purchasing}
                style={{
                  flex: 1,
                  padding:
                    "12px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "8px",
                  background:
                    "white",
                  cursor:
                    "pointer"
                }}
              >
                Cancel
              </button>


              <button
                onClick={purchaseBook}
                disabled={purchasing}
                style={{
                  flex: 1,
                  padding:
                    "12px",
                  border:
                    "none",
                  borderRadius:
                    "8px",
                  background:
                    purchasing
                      ? "#9ca3af"
                      : "#16a34a",
                  color:
                    "white",
                  fontWeight:
                    "700",
                  cursor:
                    purchasing
                      ? "not-allowed"
                      : "pointer"
                }}
              >
                {purchasing
                  ? "Sending..."
                  : "Pay with M-Pesa"}
              </button>

            </div>


            {/* PAYMENT NOTE */}

            <p
              style={{
                textAlign:
                  "center",
                fontSize:
                  "11px",
                color:
                  "#9ca3af",
                marginTop:
                  "15px",
                marginBottom:
                  0
              }}
            >
              Secure payment powered by
              M-Pesa
            </p>

          </div>

        </div>

      )}

    </div>

  );
}