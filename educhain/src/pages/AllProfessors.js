import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import ProfessorJSON from '../contracts/Professor.json'; // Assurez-vous que ce chemin est correct
import SidebarAdmin from './SidebarAdmin';

const AllProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          const professorContract = new web3.eth.Contract(
            ProfessorJSON.abi,
            '0xb7EC93dd6bc60B60235192B712Ff4cD99F13dE76' // Adresse du contrat
          );

          // Récupérer tous les professeurs
          const allProfessors = await professorContract.methods.getAllProfessors().call();

          // Vérifier si les professeurs existent
          if (allProfessors.length > 0) {
            setProfessors(allProfessors);
          } else {
            setError('Aucun professeur trouvé.');
          }

          setLoading(false);
        } else {
          alert('Ethereum provider not found. Please install MetaMask.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des professeurs:', error);
        setError('Erreur lors de la récupération des professeurs.');
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  return (
    <div className="profile-container">
      <SidebarAdmin />
      <div className="profile-content">
        <h2 className="profile-title">List of Professors</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : professors.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>CIN</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Specialization</th>
              </tr>
            </thead>
            <tbody>
              {professors.map((professor, index) => (
                <tr key={index}>
                  <td>{professor.cin}</td>
                  <td>{professor.firstName}</td>
                  <td>{professor.lastName}</td>
                  <td>{professor.dateOfBirth}</td>
                  <td>{professor.email}</td>
                  <td>{professor.filiere}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun professeur trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default AllProfessors;
