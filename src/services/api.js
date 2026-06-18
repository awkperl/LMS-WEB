/**const API = "http://localhost:5000/api";

export const api = async (url, method = "GET", body, token) => {
  const res = await fetch(API + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: body ? JSON.stringify(body) : null
  });

  return res.json();
};**/
//const API = "http://localhost:5000/api";
const API = "https://lms-backend-yai8.onrender.com/api";
const API = process.env.REACT_APP_API_URL;

export const api = async (
  url,
  method = "GET",
  body = null,
  token = null
) => {

  try {

    const res = await fetch(
      API + url,
      {
        method,
        headers: {
          "Content-Type":
            "application/json",

          Authorization: token
            ? `Bearer ${token}`
            : ""
        },

        body: body
          ? JSON.stringify(body)
          : null
      }
    );

    const data = await res.json();

    // HANDLE FAILED REQUESTS
    if (!res.ok) {

      throw new Error(
        data.msg ||
        data.error ||
        "Request failed"
      );

    }

    return data;

  } catch (err) {

    console.error(
      "API ERROR:",
      err.message
    );

    throw err;

  }
};