import React, { useState } from 'react';
import SidebarProf from './SidebarProf';

function ScanCertNote() {
  const [certificateFile, setCertificateFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCertificateFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')) {
      setCertificateFile(file);
      setMessage('');
    } else {
      setMessage('Please select a valid image file (JPEG, PNG) or PDF');
      setCertificateFile(null);
    }
  };

  const handleCertificateSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
  
    try {
      if (!certificateFile) {
        throw new Error('Please provide a certificate file');
      }
  
      const formData = new FormData();
      formData.append('certificateFile', certificateFile);
  
      const response = await fetch('http://localhost:5000/verify-certificate', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Verification failed');
      }
  
      setMessage(result.message); // Display the message from the backend
  
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
      setCertificateFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };
  
  return (
    <div className="profile-container">
      <SidebarProf />
      <div className="profile-content">
        <h2 className="profile-title">Certificates Scan</h2>
        
        <div className="scan-section">
          <h3>Certificate Scan</h3>
          <form onSubmit={handleCertificateSubmit}>
            <div className="form-group">
              <label>Certificate File:</label>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleCertificateFileChange}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !certificateFile}
              className="submit-button"
            >
              {loading ? 'Verification in progress...' : 'Check the Certificate'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('Authentic') ? 'success' : message.includes('Fake') ? 'error' : ''}`}>
              <span className="icon">
                {message.includes('Authentic') ? '✔️' : message.includes('Fake') ? '❌' : ''}
              </span>
              {message}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .submit-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .message {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 4px;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .icon {
          margin-right: 10px;
          font-size: 1.5rem;
        }

        .success {
          background-color: #dff0d8;
          color: #3c763d;
          border: 1px solid #d6e9c6;
        }

        .error {
          background-color: #f2dede;
          color: #a94442;
          border: 1px solid #ebccd1;
        }
      `}</style>
    </div>
  );
}

export default ScanCertNote;
