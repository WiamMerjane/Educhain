import React, { useState } from 'react';
import SidebarProf from './SidebarEtud';
import Web3 from 'web3';
import CertificateContract from '../contracts/Certificate.json'; // ABI du contrat

function ScanCertif() {
  const [certificateFile, setCertificateFile] = useState(null);
  const [studentName, setStudentName] = useState(''); // Champ pour le nom de l'étudiant
  const [certificateTitle, setCertificateTitle] = useState(''); // Champ pour le titre du certificat
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hash, setHash] = useState('');

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

      // Vérification du certificat via le backend
      const response = await fetch('http://localhost:5000/verify-certificate', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed');
      }

      setMessage(result.message); // Affiche le message de validation
      setIsVerified(result.message.includes('Authentic'));
      if (result.message.includes('Authentic')) {
        // Si le certificat est authentique, calculer le hachage
        const fileHash = await calculateFileHash(certificateFile);
        setHash(fileHash);
      }
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

  // Calculer le hachage du fichier
  const calculateFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return toHexString(new Uint8Array(hashBuffer));
  };

  // Convertir Uint8Array en string hexadécimal
  const toHexString = (byteArray) => {
    return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Enregistrer le certificat dans le smart contract
  const registerCertificate = async () => {
    if (!isVerified || !hash || !studentName || !certificateTitle) {
      alert('Certificat non valide, informations manquantes ou hachage manquant.');
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(CertificateContract.abi, '0x0E7070351C7E42F3185aEaFD24907DF57504FAD4'); // Adresse du contrat

    try {
      await contract.methods
        .registerCertificate(studentName, certificateTitle, hash) // Passer le nom et le titre
        .send({ from: accounts[0] });
      alert('Certificat enregistré avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du certificat:', error);
      alert('Échec de l\'enregistrement du certificat.');
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
              <label>Student Name:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student's name"
                required
              />
            </div>

            <div className="form-group">
              <label>Certificate Title:</label>
              <input
                type="text"
                value={certificateTitle}
                onChange={(e) => setCertificateTitle(e.target.value)}
                placeholder="Enter certificate title"
                required
              />
            </div>

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
              disabled={loading || !certificateFile || !studentName || !certificateTitle}
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

          {isVerified && hash && (
            <div className="register-section">
              <button onClick={registerCertificate} className="submit-button">
                Save the Certificate on the Blockchain
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScanCertif;
