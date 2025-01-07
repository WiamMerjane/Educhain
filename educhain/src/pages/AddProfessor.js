import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ProfessorJSON from '../contracts/Professor.json'; // Assurez-vous que ce chemin est correct pour votre fichier ABI
import SidebarAdmin from './SidebarAdmin';

const AddProfessor = () => {
  const [accounts, setAccounts] = useState([]);
  const [professorContract, setProfessorContract] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [cin, setCin] = useState('');
  const [filiere, setFiliere] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3 = new Web3(window.ethereum);
          const userAccounts = await web3.eth.getAccounts();
          setAccounts(userAccounts);

          const professorContractInstance = new web3.eth.Contract(
            ProfessorJSON.abi,
            '0xb7EC93dd6bc60B60235192B712Ff4cD99F13dE76' // Remplacez par l'adresse de votre contrat déployé
          );

          setProfessorContract(professorContractInstance);
        } else {
          alert('Ethereum provider not found. Please install MetaMask.');
        }
      } catch (error) {
        console.error('Error initializing web3 or contract:', error);
        alert('Failed to load Web3 or contract.');
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (professorContract && accounts.length > 0) {
      console.log({
        _firstName: firstName,
        _lastName: lastName,
        _dateOfBirth: dateOfBirth,
        _email: email,
        _cin: cin,
        _filiere: filiere,
      });  // Log the parameters to ensure they are all populated

      try {
        await professorContract.methods
          .addProfessor(
            cin,                  // _cin
            firstName,            // _firstName
            lastName,             // _lastName
            dateOfBirth,          // _dateOfBirth
            email,                // _email
            filiere               // _filiere
          )
          .send({ from: accounts[0], gas: 3000000 });

        alert('Professor added successfully!');
      } catch (error) {
        console.error('Error adding professor:', error);
        alert('Failed to add professor.');
      }
    } else {
      alert('Contract not initialized or no accounts found!');
    }
  };

  return (
    <div className="profile-container">
      <SidebarAdmin />
      <div className="profile-content">
        <h2 className="profile-title">Add a Teacher</h2>
        <div className="form-group">
          <label>First Name:</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter the First name"
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter the Last name"
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input 
            type="date" 
            value={dateOfBirth} 
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez l'email"
          />
        </div>
        <div className="form-group">
          <label>CIN:</label>
          <input 
            type="text" 
            value={cin} 
            onChange={(e) => setCin(e.target.value)}
            placeholder="Entrez le CIN"
          />
        </div>
        <div className="form-group">
          <label>Specialization:</label>
          <input 
            type="text" 
            value={filiere} 
            onChange={(e) => setFiliere(e.target.value)}
            placeholder="Entrez la filière"
          />
        </div>
        <button onClick={handleSubmit} className="btn-add">Add the Professor</button>
      </div>
    </div>
  );
};

export default AddProfessor;
