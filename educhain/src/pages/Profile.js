import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Sidebar from "./SidebarEtud"; // Assurez-vous que le chemin est correct
import "./Profile.css";

// Importez l'ABI du contrat ici si ce n'est pas déjà fait
import StudentJSON from '../contracts/Student.json'; // Assurez-vous que ce chemin est correct pour votre fichier ABI

import StudentImage from './student.png'; // Ajoutez votre image par défaut ici

function Profile() {
  const [students, setStudents] = useState([]); // Liste des étudiants correspondants
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const studentContract = new web3.eth.Contract(
          StudentJSON.abi,
          '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363' // Adresse du contrat déployé
        );

        const email = localStorage.getItem('email');
        if (!email) {
          setError("Email non trouvé dans localStorage");
          setLoading(false);
          return;
        }

        console.log("Email stocké dans localStorage:", email);

        // Appel pour récupérer tous les étudiants
        const allStudents = await studentContract.methods.getAllStudents().call();
        console.log("Tous les étudiants :", allStudents);

        // Filtrer les étudiants par email
        const filteredStudents = allStudents.filter(student => student[3] === email); // Assurez-vous que l'email est le bon index dans le tableau
        console.log("filtered:", filteredStudents);

        if (filteredStudents.length === 0) {
          setError("Aucun étudiant trouvé pour cet email");
          setLoading(false);
          return;
        }

        setStudents(filteredStudents);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h2 className="profile-title">My Profile</h2>

        {loading ? (
          <p>Chargement des données...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : students.length > 0 ? (
          <div className="profile-info">
            <div className="profile-image">
              <img
                src={StudentImage}
                alt="Photo de profil"
                className="profile-img"
              />
            </div>
            <p><strong>Last Name :</strong> {students[0][0]} {students[0][1]}</p> {/* Nom et prénom */}
            <p><strong>Email :</strong> {students[0][3]}</p> {/* Email */}
            <p><strong>Student ID :</strong> {students[0][4]}</p> {/* CNE */}
            <p><strong>Specialization :</strong> {students[0][5]}</p> {/* Filière */}
          </div>
        ) : (
          <p>Aucune donnée trouvée pour cet étudiant.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
