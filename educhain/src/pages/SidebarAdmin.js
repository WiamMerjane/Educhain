import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaUserGraduate, FaBook, FaChalkboardTeacher, FaSignOutAlt, FaUsers } from 'react-icons/fa'; // Importation des icônes
import "./SidebarAdmin.css";

function SidebarAdmin() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Area</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/espace-admin" className="sidebar-link">
            <FaUser /> {/* Icône pour le tableau de bord */}
            Profile
          </Link>
        </li>
        <li>
          <Link to="/ajouter-etud" className="sidebar-link">
            <FaUserGraduate /> {/* Icône pour les étudiants */}
            Add Student
          </Link>
        </li>
        <li>
          <Link to="/all-students" className="sidebar-link">
            <FaUsers /> {/* Nouvelle icône pour la liste des étudiants */}
            List of Students
          </Link>
        </li>
        <li>
          <Link to="/ajouter-prof" className="sidebar-link">
            <FaChalkboardTeacher /> {/* Icône pour les professeurs */}
            Add Professor
          </Link>
        </li>
        <li>
          <Link to="/all-professors" className="sidebar-link">
            <FaUsers /> {/* Nouvelle icône pour la liste des étudiants */}
            List of Professors
          </Link>
        </li>
      </ul>
      
      {/* Ajout du bouton Logout en bas */}
      <div className="sidebar-logout">
        <Link to="/" className="sidebar-link">
          <FaSignOutAlt /> {/* Icône de déconnexion */}
          Logout
        </Link>
      </div>
    </div>
  );
}

export default SidebarAdmin;
