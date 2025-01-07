import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import StudentJSON from '../contracts/Student.json'; // Assurez-vous que ce chemin est correct pour votre fichier ABI
import SidebarAdmin from './SidebarAdmin';

const AddStudent = () => {
  const [accounts, setAccounts] = useState([]);
  const [studentContract, setStudentContract] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [cne, setCne] = useState('');
  const [filiere, setFiliere] = useState('');
  const [anneeUniv, setAnneeUniv] = useState('');
  const [transcript, setTranscript] = useState(''); // Nouveau champ
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3 = new Web3(window.ethereum);
          const userAccounts = await web3.eth.getAccounts();
          setAccounts(userAccounts);

          const studentContractInstance = new web3.eth.Contract(
            StudentJSON.abi,
            '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363' // Remplacez par l'adresse de votre contrat
          );

          setStudentContract(studentContractInstance);
          fetchStudents(studentContractInstance);
        } else {
          alert('Ethereum provider non trouvé. Veuillez installer MetaMask.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de Web3 ou du contrat :', error);
        alert('Impossible de charger Web3 ou le contrat.');
      }
    };

    initWeb3();
  }, []);

  const fetchStudents = async (contract) => {
    try {
      if (contract) {
        const allStudents = await studentContract.methods.getAllStudents().call();
        setStudents(allStudents);


      }
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants :', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (studentContract && accounts.length > 0) {
      try {
        await studentContract.methods
              .addStudent(cne, // Utiliser le CNE comme identifiant
                firstName,
                lastName,
                dateOfBirth,
                email,
                filiere,
                anneeUniv,
                transcript)
              .send({ from: accounts[0], gas: 3000000 });


        alert('Étudiant ajouté avec succès !');
        fetchStudents(studentContract); // Actualiser la liste des étudiants
        resetForm();
        setError('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'étudiant :', error);

        if (error.message.includes('Student already exists')) {
          setError('Cet étudiant est déjà enregistré.');
        } else {
          setError('Une erreur est survenue lors de l\'ajout.');
        }
      }
    } else {
      alert('Contrat non initialisé ou aucun compte trouvé !');
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setEmail('');
    setCne('');
    setFiliere('');
    setAnneeUniv('');
    setTranscript('');
  };

  return (
    <div className="profile-container">
      <SidebarAdmin />
      <div className="profile-content">
        <h2 className="profile-title">Add a Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Student ID:</label>
            <input
              type="text"
              value={cne}
              onChange={(e) => setCne(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Specialization:</label>
            <input
              type="text"
              value={filiere}
              onChange={(e) => setFiliere(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
  <label>Academic Year:</label>
  <input
    type="text"
    value={anneeUniv}
    onChange={(e) => setAnneeUniv(e.target.value)}
    placeholder="Ex: 2023-2024"
    required
  />
</div>
          <div className="form-group">
            <label>Transcript:</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Entrez le relevé de notes"
              rows="5"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn-add">Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
