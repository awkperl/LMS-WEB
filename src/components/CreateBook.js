import { useState } from "react";
import { api } from "../services/api";

export default function CreateBook({
  token,
  refresh
}) {

  const [form, setForm] = useState({
    title: "",
    blurb: "",
    price: "",
    cover_url: "",
    file_url: ""
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
      e.target.value
    });

  };

  const submit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await api(
        "/books",
        "POST",
        form,
        token
      );

      alert(
        "Book uploaded successfully"
      );

      setForm({
        title:"",
        blurb:"",
        price:"",
        cover_url:"",
        file_url:""
      });

      if(refresh){
        refresh();
      }

    } catch(err){

      console.error(err);

      alert(
        err.message ||
        "Upload failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        background:"white",
        padding:25,
        borderRadius:12,
        marginBottom:30
      }}
    >

      <h2>
        📚 Upload Book
      </h2>

      <form onSubmit={submit}>

        <input
          name="title"
          placeholder="Book title"
          value={form.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="blurb"
          placeholder="Book summary / blurb"
          value={form.blurb}
          onChange={handleChange}
          required
          style={{
            ...inputStyle,
            minHeight:100
          }}
        />

        <input
          name="price"
          type="number"
          placeholder="Price in KES"
          value={form.price}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="cover_url"
          placeholder="Book cover image URL"
          value={form.cover_url}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="file_url"
          placeholder="PDF manuscript URL"
          value={form.file_url}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          disabled={loading}
          style={{
            padding:"12px 20px",
            border:"none",
            borderRadius:8,
            background:"#111827",
            color:"white",
            cursor:"pointer"
          }}
        >
          {loading
            ? "Uploading..."
            : "Upload Book"}
        </button>

      </form>

    </div>

  );

}

const inputStyle = {

  width:"100%",
  padding:12,
  marginBottom:15,
  borderRadius:8,
  border:"1px solid #d1d5db"

};