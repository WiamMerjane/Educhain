import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SidebarProf from "./SidebarProf"; // Assurez-vous que le chemin est correct
import "./ProfileProf.css"; // Ajoutez ce fichier CSS pour le style
import ProfessorJSON from "../contracts/Professor.json"; // ABI du contrat
import profImage from "./prof.png";
function ProfileProf() {
  const [profInfo, setProfInfo] = useState(null); // Informations du professeur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const professorContract = new web3.eth.Contract(
          ProfessorJSON.abi,
          "0xb7EC93dd6bc60B60235192B712Ff4cD99F13dE76" // Adresse du contrat déployé
        );

        const email = localStorage.getItem("email");
        if (!email) {
          setError("Email non trouvé dans localStorage");
          setLoading(false);
          return;
        }

        const professorData = await professorContract.methods
          .getProfessorByEmail(email)
          .call();

        if (!professorData) {
          setError("Aucun professeur trouvé pour cet email");
          setLoading(false);
          return;
        }

        setProfInfo({
          name: `${professorData.firstName} ${professorData.lastName}`,
          email: professorData.emailAddress,
          subject: professorData.filiere,
          profileImage: profImage, // Chemin local pour l'image par défaut
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  return (
    <div className="profile-page">
      <SidebarProf />
      <div className="profile-container">
        <h2 className="profile-title">Professor Profile</h2>

        {loading ? (
          <div className="loading">Chargement des données...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : profInfo ? (
          <div className="profile-card">
            <div className="profile-image">
              <img
                src={profInfo.profileImage}
                alt="Photo de profil"
                className="profile-img"
              />
            </div>
            <div className="profile-info">
              <p><strong>Name :</strong> {profInfo.name}</p>
              <p><strong>Email :</strong> {profInfo.email}</p>
              <p><strong>Subject :</strong> {profInfo.subject}</p>
            </div>
          </div>
        ) : (
          <p className="no-data">No data found for this professor.</p>
        )}
      </div>
    </div>
  );
}

export default ProfileProf;
