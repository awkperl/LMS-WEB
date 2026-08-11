import CertificateStudents from "../components/CertificateStudents";

export default function CertificateManagement({
    courseId,
    token
}) {

    return (
        <div style={{ padding: 30 }}>

            <h1>Certificate Management</h1>

            <p>
                Review student eligibility and generate certificates.
            </p>

            <CertificateStudents
                courseId={courseId}
                token={token}
            />

        </div>
    );

}