import { useEffect, useState } from "react";
import { api } from "../services/api";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Certificates({ token }) {

  const [certificates, setCertificates] = useState([]);

  // LOAD CERTIFICATES
  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {

    try {

      const data =
    await api(
        "/certificates/student",
        "GET",
        null,
        token
    );

      console.log("CERTIFICATES:", data);

      setCertificates(data);

    } catch (err) {

      console.error(err);

    }

  };


  // PDF DOWNLOAD
  const downloadPDF = async (id) => {

    try {

      const input = document.getElementById(
        `certificate-${id}`
      );

      if (!input) {
        console.error("Certificate element not found");
        return;
      }

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "landscape",
        "px",
        "a4"
      );

      const width =
        pdf.internal.pageSize.getWidth();

      const height =
        pdf.internal.pageSize.getHeight();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        width,
        height
      );

      pdf.save("certificate.pdf");

    } catch (err) {

      console.error(
        "Certificate download failed:",
        err
      );

    }

  };


  return (

    <div
      style={{
        padding: "10px 0 50px 0"
      }}
    >

      {/* PAGE HEADER */}

      <div
        style={{
          marginBottom: 35
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            color: "#111827",
            fontWeight: 700
          }}
        >
          Certificates
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: 8,
            fontSize: 16
          }}
        >
          View and download your course certificates.
        </p>

      </div>


      {/* NO CERTIFICATES */}

      {certificates.length === 0 && (

        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: 35,
            textAlign: "center",
            border: "1px solid #e5e7eb"
          }}
        >

          <div
            style={{
              fontSize: 45,
              marginBottom: 10
            }}
          >
            🏆
          </div>

          <h3>
            No certificates available
          </h3>

          <p
            style={{
              color: "#6b7280"
            }}
          >
            Certificates will appear here after
            your course completion has been approved.
          </p>

        </div>

      )}


      {/* CERTIFICATES */}

      {certificates.map(cert => (

        <div
          key={cert.certificate_id}
          style={{
            marginBottom: 50
          }}
        >

          {/* ============================= */}
          {/* CERTIFICATE */}
          {/* ============================= */}

          <div
            id={`certificate-${cert.certificate_id}`}
            style={{
              position: "relative",

              width: "100%",
              maxWidth: 1100,

              minHeight: 700,

              margin: "0 auto",

              boxSizing: "border-box",

              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",

              border: "12px solid #111827",

              borderRadius: 8,

              padding: "55px 70px",

              overflow: "hidden",

              boxShadow:
                "0 8px 30px rgba(0,0,0,0.12)"
            }}
          >


            {/* INNER BORDER */}

            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                right: 18,
                bottom: 18,

                border:
                  "2px solid #d4af37",

                pointerEvents: "none"
              }}
            />


            {/* TOP LEFT DECORATION */}

            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,

                width: 70,
                height: 70,

                borderTop:
                  "5px solid #2563eb",

                borderLeft:
                  "5px solid #2563eb"
              }}
            />


            {/* TOP RIGHT DECORATION */}

            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,

                width: 70,
                height: 70,

                borderTop:
                  "5px solid #2563eb",

                borderRight:
                  "5px solid #2563eb"
              }}
            />


            {/* BOTTOM LEFT DECORATION */}

            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,

                width: 70,
                height: 70,

                borderBottom:
                  "5px solid #2563eb",

                borderLeft:
                  "5px solid #2563eb"
              }}
            />


            {/* BOTTOM RIGHT DECORATION */}

            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,

                width: 70,
                height: 70,

                borderBottom:
                  "5px solid #2563eb",

                borderRight:
                  "5px solid #2563eb"
              }}
            />


            {/* WATERMARK */}

            <img
              src="/assets/logo.png"
              alt=""
              style={{
                position: "absolute",

                width: 430,
                height: 430,

                objectFit: "contain",

                opacity: 0.035,

                top: "50%",
                left: "50%",

                transform:
                  "translate(-50%, -50%)",

                pointerEvents: "none"
              }}
            />


            {/* HEADER */}

            <div
              style={{
                position: "relative",
                zIndex: 2,

                textAlign: "center"
              }}
            >

              {/* LOGO */}

              <img
                src="/assets/logo.png"
                alt="Onet Learning Management System"
                style={{
                  width: 95,
                  height: 95,

                  objectFit: "contain",

                  marginBottom: 8
                }}
              />


              {/* ORGANIZATION */}

              <div
                style={{
                  fontSize: 15,
                  letterSpacing: 3,
                  fontWeight: 700,
                  color: "#374151",

                  textTransform: "uppercase"
                }}
              >
                ONET LEARNING MANAGEMENT SYSTEM
              </div>


              {/* SMALL LINE */}

              <div
                style={{
                  width: 90,
                  height: 3,

                  background: "#d4af37",

                  margin:
                    "12px auto 20px auto"
                }}
              />


              {/* TITLE */}

              <h1
                style={{
                  margin: 0,

                  fontSize: 43,

                  letterSpacing: 2,

                  color: "#111827",

                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontWeight: 700
                }}
              >
                CERTIFICATE
              </h1>


              <h2
                style={{
                  margin:
                    "5px 0 0 0",

                  fontSize: 22,

                  letterSpacing: 5,

                  color: "#2563eb",

                  fontWeight: 600
                }}
              >
                OF COMPLETION
              </h2>


              <p
                style={{
                  marginTop: 22,

                  marginBottom: 8,

                  color: "#6b7280",

                  fontSize: 17,

                  fontStyle: "italic"
                }}
              >
                This certificate is proudly presented to
              </p>

            </div>


            {/* STUDENT NAME */}

            <div
              style={{
                position: "relative",
                zIndex: 2,

                textAlign: "center",

                marginTop: 5
              }}
            >

              <h2
                style={{
                  margin: 0,

                  fontSize: 39,

                  color: "#2563eb",

                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontWeight: 700
                }}
              >
                {cert.student_name}
              </h2>


              <div
                style={{
                  width: 420,
                  maxWidth: "80%",

                  height: 2,

                  background: "#d4af37",

                  margin:
                    "10px auto 20px auto"
                }}
              />

            </div>


            {/* COURSE TEXT */}

            <div
              style={{
                position: "relative",
                zIndex: 2,

                textAlign: "center",

                maxWidth: 800,

                margin: "0 auto"
              }}
            >

              <p
                style={{
                  fontSize: 18,

                  lineHeight: 1.7,

                  color: "#374151",

                  margin: 0
                }}
              >
                has successfully completed the course
              </p>


              <h3
                style={{
                  fontSize: 26,

                  margin:
                    "8px 0 10px 0",

                  color: "#111827",

                  fontWeight: 700
                }}
              >
                {cert.course_title}
              </h3>


              <p
                style={{
                  fontSize: 15,

                  lineHeight: 1.6,

                  color: "#6b7280",

                  margin: 0
                }}
              >
                through the Onet Learning Management System
                and Physical Classes.
              </p>

            </div>


            {/* OFFICIAL SEAL */}

            <div
              style={{
                position: "absolute",

                right: 70,
                top: 300,

                width: 100,
                height: 100,

                border:
                  "3px solid #d4af37",

                borderRadius: "50%",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                textAlign: "center",

                color: "#b08d1c",

                fontWeight: 700,

                fontSize: 11,

                letterSpacing: 1,

                transform: "rotate(-10deg)",

                zIndex: 2
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: 25,
                    marginBottom: 2
                  }}
                >
                  ★
                </div>

                OFFICIAL
                <br />
                CERTIFICATE

              </div>

            </div>


            {/* CERTIFICATE DETAILS */}

            <div
              style={{
                position: "relative",
                zIndex: 2,

                display: "flex",

                justifyContent:
                  "center",

                gap: 100,

                marginTop: 28,

                textAlign: "center"
              }}
            >

              {/* CERTIFICATE NUMBER */}

              <div>

                <div
                  style={{
                    fontSize: 11,

                    color: "#9ca3af",

                    textTransform:
                      "uppercase",

                    letterSpacing: 1,

                    marginBottom: 5
                  }}
                >
                  Certificate Number
                </div>

                <strong
                  style={{
                    fontSize: 13,

                    color: "#111827"
                  }}
                >
                  {cert.certificate_number}
                </strong>

              </div>


              {/* ISSUE DATE */}

              <div>

                <div
                  style={{
                    fontSize: 11,

                    color: "#9ca3af",

                    textTransform:
                      "uppercase",

                    letterSpacing: 1,

                    marginBottom: 5
                  }}
                >
                  Date Issued
                </div>

                <strong
                  style={{
                    fontSize: 13,

                    color: "#111827"
                  }}
                >
                  {new Date(
                    cert.issued_at
                  ).toLocaleDateString()}
                </strong>

              </div>

            </div>


            {/* FOOTER / SIGNATURE */}

            <div
              style={{
                position: "relative",
                zIndex: 2,

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "flex-end",

                marginTop: 45,

                padding:
                  "0 45px"
              }}
            >


              {/* INSTRUCTOR SIGNATURE */}

              <div
                style={{
                  width: 220,

                  textAlign: "center"
                }}
              >

                <div
                  style={{
                    height: 35,

                    borderBottom:
                      "2px solid #111827",

                    marginBottom: 7
                  }}
                />

                <strong
                  style={{
                    fontSize: 14,

                    color: "#111827"
                  }}
                >
                  Instructor
                </strong>

                <p
                  style={{
                    margin: "3px 0 0 0",

                    color: "#6b7280",

                    fontSize: 12
                  }}
                >
                  Authorized Signature
                </p>

              </div>


              {/* CENTER BRAND */}

              <div
                style={{
                  textAlign: "center",

                  fontSize: 13,

                  fontWeight: 700,

                  color: "#374151",

                  letterSpacing: 2
                }}
              >
                OLMS

                <div
                  style={{
                    fontSize: 10,

                    letterSpacing: 1,

                    color: "#9ca3af",

                    marginTop: 4
                  }}
                >
                  LEARNING • SKILLS • EXCELLENCE
                </div>

              </div>


              {/* AUTHORIZATION */}

              <div
                style={{
                  width: 220,

                  textAlign: "center"
                }}
              >

                <div
                  style={{
                    height: 35,

                    borderBottom:
                      "2px solid #111827",

                    marginBottom: 7
                  }}
                />

                <strong
                  style={{
                    fontSize: 14,

                    color: "#111827"
                  }}
                >
                  Authorized Officer
                </strong>

                <p
                  style={{
                    margin: "3px 0 0 0",

                    color: "#6b7280",

                    fontSize: 12
                  }}
                >
                  Onet Learning Management System
                </p>

              </div>

            </div>

          </div>


          {/* DOWNLOAD BUTTON */}

          <div
            style={{
              textAlign: "center",

              marginTop: 22
            }}
          >

            <button
              onClick={() =>
                downloadPDF(
                  cert.certificate_id
                )
              }
              style={{
                padding:
                  "13px 28px",

                border: "none",

                borderRadius: 8,

                background:
                  "#111827",

                color: "white",

                fontSize: 15,

                fontWeight: 600,

                cursor: "pointer",

                boxShadow:
                  "0 3px 8px rgba(0,0,0,0.15)"
              }}
            >
              📄 Download Certificate PDF
            </button>

          </div>

        </div>

      ))}

    </div>

  );
}

