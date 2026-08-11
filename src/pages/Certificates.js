import { useEffect, useState } from "react";
import { api } from "../services/api";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Certificates({
  token
}) {

  const [certificates,
    setCertificates] =
    useState([]);

  // LOAD CERTIFICATES
  useEffect(() => {

    loadCertificates();

  }, []);

  const loadCertificates =
  async ()=>{

    try{

      const data =
      await api(
        "/certificates",
        "GET",
        null,
        token
      );

      console.log(
        "CERTIFICATES:",
        data
      );

      setCertificates(data);

    }catch(err){

      console.error(err);

    }

  };

  // PDF DOWNLOAD
  const downloadPDF =
  async(id)=>{

    const input =
    document.getElementById(
      `certificate-${id}`
    );

    const canvas = await html2canvas(input,{
   scale:2,
   useCORS:true
});
    const imgData =
    canvas.toDataURL(
      "image/png"
    );

    const pdf =
    new jsPDF(
      "landscape",
      "px",
      "a4"
    );

    const width=
    pdf.internal.pageSize.getWidth();

    const height=
    pdf.internal.pageSize.getHeight();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      width,
      height
    );

    pdf.save(
      "certificate.pdf"
    );

  };

  return (

    <div>

      {/* PAGE HEADER */}

      <div
        style={{
          marginBottom:30
        }}
      >

        <h1
          style={{
            margin:0
          }}
        >
          Certifications
        </h1>

        <p
          style={{
            color:"gray"
          }}
        >
          Download and manage
          course certificates
        </p>

      </div>

      {
      certificates.length===0
      &&
      <p>
        No certificates available
      </p>
      }

      {certificates.map(cert=>(

        <div
          key={
            cert.certificate_id
          }
        >

          {/* CERTIFICATE */}

          <div
            id={`certificate-${cert.certificate_id}`}

            style={{

              background:"white",

              borderRadius:16,

              padding:40,

              marginBottom:20,

              boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)",

              border:
              "6px solid #111827",

              position:"relative"

            }}
          >

            {/* LOGO */}

            <div
           
            >
              <img
  src="/assets/logo.png"
  alt="Institution Logo"
  style={{
    position: "absolute",
    top: 30,
    right: 40,
    width: 100,
    height: 100,
    objectFit: "contain"
  }}
/>

              OLMS

            </div>

            {/* TITLE */}

            <div
              style={{
                textAlign:"center",
                marginBottom:30
              }}
            >

             <h1
  style={{
    fontSize:38,
    marginBottom:10,
    color:"#111827"
  }}
>
Certificate of Completion
</h1>

<h3
  style={{
    color:"#2563eb",
    marginBottom:20
  }}
>
Onet Learning Management System
</h3>
              <p
                style={{
                  color:"#6b7280",
                  fontSize:18
                }}
              >

                This certificate
                is proudly
                presented to

              </p>

            </div>


            {/* STUDENT */}

            <h2
              style={{
                textAlign:"center",
                fontSize:34,
                marginBottom:10,
                color:"#2563eb"
              }}
            >

              {
                cert.student_name
              }

            </h2>


            {/* COURSE */}

            <p
              style={{

                textAlign:"center",

                fontSize:18,

                lineHeight:1.8,

                maxWidth:700,

                margin:
                "0 auto",

                color:"#374151"

              }}
            >

              for successfully
              completing

              <strong>

                {" "}
                {
                  cert.course_title
                }

              </strong>

              through the
              Onet Learning
              Management System and 
              Physical classes.

            </p>


            {/* SCORE */}

            <div
              style={{
                textAlign:"center",
                marginTop:20
              }}
            >

              <h3>

                Final Score:
                {" "}
                {
                  cert.final_score
                }
                %

              </h3>

            </div>


            {/* DETAILS */}

            <div
              style={{
                display:"flex",
                justifyContent:
                "space-between",

                marginTop:50,

                flexWrap:"wrap",

                gap:20
              }}
            >

              <div>

                <p
                  style={{
                    margin:0,
                    color:"gray"
                  }}
                >

                  Certificate ID

                </p>

                <strong>

                  {
                    cert.certificate_id
                  }

                </strong>

              </div>
              <img
  src="/assets/logo.png"
  alt=""
  style={{
    position:"absolute",
    width:300,
    opacity:0.05,
    top:"50%",
    left:"50%",
    transform:"translate(-50%,-50%)"
  }}
/>


              <div>

                <p
                  style={{
                    margin:0,
                    color:"gray"
                  }}
                >

                  Completion Date

                </p>

                <strong>

                  {
                    new Date(
                    cert.completion_date
                    )
                    .toLocaleDateString()
                  }

                </strong>

              </div>

            </div>


            {/* SIGNATURE */}

            <div
              style={{

                marginTop:70,

                display:"flex",

                justifyContent:
                "space-between",

                alignItems:"center"

              }}
            >

              <div>

                <div
                  style={{
                    width:220,
                    borderBottom:
                    "2px solid #111827",
                    marginBottom:8
                  }}
                />

                <p>
                  Instructor
                </p>

              </div>


              <div
                style={{
                  fontSize:50,
                  opacity:.1,
                  fontWeight:"bold"
                }}
              >

                OLMS

              </div>

            </div>

          </div>



          {/* DOWNLOAD */}

          <div
            style={{
              textAlign:"center",
              marginBottom:40
            }}
          >

            <button

              onClick={()=>
                downloadPDF(
                  cert.certificate_id
                )
              }

              style={{

                padding:
                "12px 24px",

                border:"none",

                borderRadius:8,

                background:"#111827",

                color:"white",

                cursor:"pointer"

              }}

            >

              Download PDF

            </button>

          </div>

        </div>

      ))}

    </div>

  );

}