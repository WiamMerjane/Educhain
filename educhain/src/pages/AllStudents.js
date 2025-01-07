import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Container, Card } from 'react-bootstrap';
import SidebarProf from "./SidebarAdmin";
import StudentJSON from '../contracts/Student.json';

const Progress = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const userAccounts = await web3Instance.eth.getAccounts();
          setAccounts(userAccounts);

          const contractInstance = new web3Instance.eth.Contract(
            StudentJSON.abi,
            '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363'
          );
          setContract(contractInstance);
        } else {
          alert('Veuillez installer MetaMask pour accéder à cette fonctionnalité.');
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de Web3:', err);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchAllStudents = async () => {
      if (!contract) {
        setError('Le contrat n\'est pas initialisé.');
        return;
      }

      try {
        const allStudents = await contract.methods.getAllStudents().call();
        const groupedStudents = [];
        allStudents.forEach((student) => {
          const existingStudent = groupedStudents.find((s) => s.cne === student.cne);
          if (existingStudent) {
            existingStudent.annees.push({
              anneeUniv: student.anneeUniv,
              transcript: student.transcript,
            });
          } else {
            groupedStudents.push({
              ...student,
              annees: [{
                anneeUniv: student.anneeUniv,
                transcript: student.transcript,
              }],
            });
          }
        });

        setStudents(groupedStudents);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de récupérer les données des étudiants.');
      }
    };

    fetchAllStudents();
  }, [contract]);

  const parseTranscript = (transcript) => {
    const lines = transcript.split('\n');
    return lines.map(line => {
      const [subject, grade] = line.split(':').map(item => item.trim());
      return { subject, grade };
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Sidebar */}
      <SidebarProf /> {/* Composant Sidebar auto-fermante */}
  
      {/* Student Data */}
      <Container style={{ marginTop: '2rem', maxWidth: '1600px' }}>
        <h4 className="text-center mb-4" style={{ color: '#343a40', fontSize: '2rem' }}>
        Educational Background
        </h4>
        {students.length > 0 ? (
          students.map((student, idx) => (
            <Card
  key={idx}
  className="mb-5 shadow-lg"
  style={{
    borderRadius: '15px',
    padding: '30px',
    backgroundColor: '#fdfdfd',
    width: '90%',
    maxWidth: '800px',
    margin: 'auto',
  }}
>
  <Card.Body>
    <Card.Title
      className="text-primary"
      style={{ fontSize: '1.8rem', marginBottom: '20px' }}
    >
      Student {idx + 1}: {student.firstName} {student.lastName}
    </Card.Title>
    <Card.Text style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
      <strong>Student ID:</strong> {student.cne} <br />
      <strong>Specialization:</strong> {student.filiere} <br />
      <strong>Email:</strong> {student.email}
    </Card.Text>

    <h5 style={{ fontSize: '1.5rem', marginTop: '20px' }}>
      
    </h5>
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
  </Card.Body>
</Card>

          ))
        ) : (
          <p className="text-center" style={{ fontSize: '1.5rem' }}>
            {error ? error : 'Chargement des données...'}
          </p>
        )}
      </Container>
    </div>
  );
  
};

export default Progress;
