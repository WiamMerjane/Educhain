import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import StudentJSON from '../contracts/Student.json'; // Assurez-vous que ce chemin est correct pour votre fichier ABI
import { useNavigate } from 'react-router-dom';
import Sidebar from "./SidebarEtud";
import './Courses.css'; // Assurez-vous que le fichier CSS est bien importé

const Courses = () => {
  const [students, setStudents] = useState([]);
  const [userFiliere, setUserFiliere] = useState('');
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Clé API YouTube (remplacez-la par votre propre clé API)
  const youtubeApiKey = 'AIzaSyCZ_jzZbHfzJECSHOWWZnGcLPBwssY9qYc';

  // Récupérer l'email de l'utilisateur depuis le localStorage
  const userEmail = localStorage.getItem('email'); // Utiliser 'email' comme clé ici

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          // Initialiser Web3 et le contrat
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const studentContractInstance = new web3.eth.Contract(
            StudentJSON.abi,
            '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363' // Remplacez par l'adresse de votre contrat déployé
          );

          // Appeler la fonction pour récupérer tous les étudiants
          const studentList = await studentContractInstance.methods.getAllStudents().call();

          // Filtrer l'étudiant avec l'email correspondant
          const currentStudent = studentList.find(student => student.email === userEmail);

          if (currentStudent) {
            setUserName(`${currentStudent.lastName} ${currentStudent.firstName}`);  // Afficher le nom complet de l'étudiant
            setUserFiliere(currentStudent.filiere);
            recommendVideos(currentStudent.filiere);
          } else {
            console.log('Aucun étudiant trouvé avec cet email:', userEmail);
          }

          setStudents(studentList);
          setLoading(false);
        } else {
          alert('Ethereum provider not found. Please install MetaMask.');
        }
      } catch (error) {
        console.error('Error initializing Web3 or contract:', error);
        alert('Failed to load Web3 or contract.');
      }
    };

    initWeb3();
  }, [userEmail]);

  // Fonction pour recommander des vidéos en utilisant l'API YouTube avec fetch
  const recommendVideos = async (filiere) => {
    try {
      let query = '';

      // Déterminer la requête YouTube selon la filière
      switch (filiere) {
        case 'Informatique':
            query = 'programming tutorials';
            break;
        case 'Mathematics':
            query = 'calculus tutorials';
            break;
        case 'Physique':
            query = 'physics tutorials';
            break;
        case 'Civil':
            query = 'civil engineering tutorials';
            break;
        case 'Industrie':
            query = 'industrial engineering tutorials';
            break;
        case 'Électrique':
            query = 'electrical engineering tutorials';
            break;
        case 'Cyber Sécurité':
            query = 'cyber security tutorials';
            break;
        case 'Réseau':
            query = 'networking tutorials';
            break;
        case 'Mécanique':
            query = 'mechanical engineering tutorials';
            break;
        case 'Chimie':
            query = 'chemistry tutorials';
            break;
        case 'Biologie':
            query = 'biology tutorials';
            break;
        case 'Architecture':
            query = 'architecture tutorials';
            break;
        case 'Commerce':
            query = 'business tutorials';
            break;
        case 'Droit':
            query = 'law tutorials';
            break;
        case 'Psychologie':
            query = 'psychology tutorials';
            break;
        case 'Médecine':
            query = 'medical tutorials';
            break;
        case 'Finance':
            query = 'finance tutorials';
            break;
        case 'Marketing':
            query = 'marketing tutorials';
            break;
        case 'Design':
            query = 'design tutorials';
            break;
        default:
            query = 'educational videos';
            break;
    }
    

      // Construction de l'URL de la requête pour l'API YouTube
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${youtubeApiKey}`;

      // Appel API YouTube avec fetch
      const response = await fetch(url);

      // Vérifier si la réponse est réussie
      if (!response.ok) {
        throw new Error('Failed to fetch data from YouTube API');
      }

      const data = await response.json();

      // Extraire les vidéos de la réponse API
      const videos = data.items.map((item) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.high.url,
      }));

      // Mettre à jour l'état des vidéos recommandées
      setRecommendedVideos(videos);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      setError('Failed to load recommended videos.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="courses-container">
      <Sidebar />
      <div className="courses-content">
        <h2>Hello {userName}</h2> {/* Affiche le prénom et le nom de l'utilisateur */}
        
        <h3>Video Recommendations for You</h3>
        {recommendedVideos.length > 0 ? (
          <div className="video-recommendations">
            {recommendedVideos.map((video, index) => (
              <div className="video-card" key={index}>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <img src={video.thumbnail} alt={video.title} width="120" />
                  <h3>{video.title}</h3>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No recommended videos for your field or no subjects to improve.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
