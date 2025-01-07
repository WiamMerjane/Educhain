import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUser, FaChartLine, FaCertificate, FaSignOutAlt, FaRegFileAlt, FaLightbulb } from 'react-icons/fa'; // Importation des icônes
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Student Area</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/courses" className="sidebar-link">
            <FaBook /> {/* Icône pour les cours */}
            General Course
          </Link>
        </li>
        <li>
          <Link to="/recommendation" className="sidebar-link">
            <FaLightbulb /> {/* Icône pour les recommandations */}
            Recommendations
          </Link>
        </li>
        <li>
          <Link to="/profile" className="sidebar-link">
            <FaUser /> {/* Icône pour le profil */}
            Profile
          </Link>
        </li>
        
        
        <li>
          <Link to="/scan-certif" className="sidebar-link">
            <FaRegFileAlt /> {/* Icône pour le scan de documents */}
            Certificate Scan
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

export default Sidebar;
