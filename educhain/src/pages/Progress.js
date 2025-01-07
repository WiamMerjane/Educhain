import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import StudentJSON from '../contracts/Student.json';
import CertificateContract from '../contracts/Certificate.json'; // Importer le contrat des certificats

const Progress = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [certificateContract, setCertificateContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [cne, setCne] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const userAccounts = await web3Instance.eth.getAccounts();
          setAccounts(userAccounts);

          const studentContractInstance = new web3Instance.eth.Contract(
            StudentJSON.abi,
            '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363'
          );
          setContract(studentContractInstance);

          const certificateContractInstance = new web3Instance.eth.Contract(
            CertificateContract.abi,
            '0x0E7070351C7E42F3185aEaFD24907DF57504FAD4' // L'adresse du contrat des certificats
          );
          setCertificateContract(certificateContractInstance);
        } else {
          alert('Veuillez installer MetaMask pour accéder à cette fonctionnalité.');
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de Web3:', err);
      }
    };

    initWeb3();
  }, []);

  const fetchStudentData = async (e) => {
    e.preventDefault();
    if (!contract || !certificateContract) {
      setError('Les contrats ne sont pas initialisés.');
      return;
    }

    setError('');
    setStudents([]);
    setCertificates([]);
    
    try {
      // Récupérer les étudiants par CNE
      const allStudents = await contract.methods.getAllStudents().call();
      const filteredStudents = allStudents.filter(s => s.cne === cne || (s.firstName.toLowerCase().includes(firstName.toLowerCase()) && s.lastName.toLowerCase().includes(lastName.toLowerCase())));

      // Organiser les étudiants
      const groupedStudents = [];
      filteredStudents.forEach(student => {
        const existingStudent = groupedStudents.find(s => s.cne === student.cne);
        if (existingStudent) {
          existingStudent.annees.push({
            anneeUniv: student.anneeUniv,
            transcript: student.transcript
          });
        } else {
          groupedStudents.push({
            ...student,
            annees: [{
              anneeUniv: student.anneeUniv,
              transcript: student.transcript
            }]
          });
        }
      });

      setStudents(groupedStudents);
      console.log(groupedStudents);

      // Chercher les certificats pour cet étudiant
const allCertificates = await certificateContract.methods.getAllCertificates().call();
const filteredCertificates = allCertificates.filter(cert =>
  cert.studentName.toLowerCase().includes(lastName.toLowerCase()) 
);

// Organiser les certificats par étudiant
const certificatesByStudent = {};
filteredCertificates.forEach(cert => {
  if (!certificatesByStudent[cert.studentName]) {
    certificatesByStudent[cert.studentName] = [];
  }
  certificatesByStudent[cert.studentName].push(cert.certificateTitle);
});

if (Object.keys(certificatesByStudent).length > 0) {
  setCertificates(certificatesByStudent);
} else {
  setError('Aucun certificat trouvé pour cet étudiant.');
}

      if (groupedStudents.length === 0) {
        setError('Aucun étudiant trouvé.');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de récupérer les données.');
    }
  };

  const parseTranscript = (transcript) => {
    const lines = transcript.split('\n');
    return lines.map(line => {
      const [subject, grade] = line.split(':').map(item => item.trim());
      return { subject, grade };
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar expand="lg" fixed={scrolled ? "top" : ""} className={scrolled ? "navbar-scroll" : "navbar"}>
        <Container>
          <Navbar.Brand href="/" className="brand-text">Educhain</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/progress" className="nav-link">Educational Background</Nav.Link>
              <Nav.Link as={Link} to="/verifiy" className="nav-link">Verify Document</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Form */}
      <Container style={{ marginTop: '2rem', maxWidth: '600px' }}>
        <div className="p-4 shadow-sm rounded bg-white">
          <h3 className="text-center mb-4" style={{ color: '#343a40' }}>Search for a student</h3>
          <form onSubmit={fetchStudentData}>
            <div className="mb-3">
              <label>Student ID</label>
              <input
                type="text"
                className="form-control"
                value={cne}
                onChange={(e) => setCne(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>First name</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Last name</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Search</button>
          </form>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </Container>

      {/* Student Data */}
      {students.length > 0 && (
        <Container style={{ marginTop: '2rem', maxWidth: '800px' }}>
          <div className="p-4 shadow-sm rounded bg-white">
            <h4 className="text-center mb-4" style={{ color: '#343a40' }}>Student Information</h4>
            {students.map((student, idx) => (
              <div key={idx}>
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th>First name</th>
                      <td>{student.firstName}</td>
                    </tr>
                    <tr>
                      <th>Last name</th>
                      <td>{student.lastName}</td>
                    </tr>
                    <tr>
                      <th>Student ID</th>
                      <td>{student.cne}</td>
                    </tr>
                    <tr>
                      <th>Specialization</th>
                      <td>{student.filiere}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{student.email}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Display Year and Transcript for each year */}
                {student.annees && student.annees.length > 0 && (
                  <table
                  className="table table-bordered"
                  style={{ fontSize: '1.1rem', marginTop: '15px', width: '90%', margin: '0 auto' }}
                >
                  <thead>
                    <tr>
                      <th>Academic Year</th>
                      <th>Transcript</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.annees.map((annee, index) => (
                      <tr key={index}>
                        <td>{annee.anneeUniv}</td>
                        <td>
                          <table
                            className="table table-bordered"
                            style={{
                              fontSize: '0.9rem',
                              width: '100%',
                              margin: '0 auto',
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Subject</th>
                                <th>Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parseTranscript(annee.transcript).map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.subject}</td>
                                  <td>{item.grade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            ))}
          </div>
        </Container>
      )}

      {/* Display certificates */}
      {Object.keys(certificates).length > 0 && (
  <Container style={{ marginTop: '2rem', maxWidth: '800px' }}>
    <div className="p-5 shadow-lg rounded-lg bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <h4 className="text-center mb-6" style={{ color: '#1d3c6a', fontWeight: '600', fontSize: '1.8rem', textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
        Certificates
      </h4>
      <div className="overflow-hidden">
        {Object.entries(certificates).map(([studentName, certTitles]) => (
          <div key={studentName}>
            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
              {certTitles.map((title, index) => (
                <li key={index} className="mb-4">
                  <div className="p-4 bg-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#2c3e50' }}>{title}</h5>
                      <div className="badge bg-info text-white" style={{ fontSize: '0.9rem' }}>Valid</div>
                    </div>
                    <p className="mt-2" style={{ color: '#7f8c8d', fontSize: '1rem' }}>
                      This certificate is issued for completion of a course or academic achievement.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </Container>
)}


    </div>
  );
};

export default Progress;
