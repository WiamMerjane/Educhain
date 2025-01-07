import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Verifiy.css'; // Assurez-vous d'avoir ce fichier CSS

function Verifiy() {
  const [certificateFile, setCertificateFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCertificateFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')) {
      setCertificateFile(file);
    } else {
      alert('Please select a valid file (JPEG, PNG, or PDF)');
      setCertificateFile(null);
    }
  };

  const handleCertificateSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('certificateFile', certificateFile);

      const response = await fetch('http://localhost:5000/verify-certificate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult({ message: 'Verification failed', success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-cert-container">
      <Navbar expand="lg" className="verification-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            Educhain
          </Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/progress">Educational Background</Nav.Link>
            <Nav.Link as={Link} to="/verify">Verify Document</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="verification-portal">
        <h2>Verification Portal</h2>
        <p>Get started by uploading the file you want to verify.</p>

        <div className="upload-section">
          <form onSubmit={handleCertificateSubmit} className="upload-form">
            <div className="file-upload-frame">
              <label htmlFor="fileInput" className="file-upload-label">
                <span className="upload-text">Click to Choose a File</span>
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleCertificateFileChange}
                required
              />
            </div>
            <button type="submit" disabled={!certificateFile || loading}>
              {loading ? 'Verifying...' : 'Verify Document'}
            </button>
          </form>

          {verificationResult && (
  <div className={`message ${verificationResult.message.includes("Authentic") ? 'success' : 'error'}`}>
    <span className="icon">
      {verificationResult.message.includes("Authentic") ? '✔️' : '❌'}
    </span>
    <div className="message-text">
      <h4>{verificationResult.message.includes("Authentic") ? 'Certificate is Authentic!' : 'Certificate is Fake!'}</h4>
      <p>{verificationResult.message}</p>
    </div>
  </div>
)}


        </div>
      </Container>
    </div>
  );
}

export default Verifiy;
