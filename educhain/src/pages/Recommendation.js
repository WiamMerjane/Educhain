import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import StudentJSON from '../contracts/Student.json'; // ABI du contrat
import { useNavigate } from 'react-router-dom';
import Sidebar from './SidebarEtud';
import './Courses.css'; // Styles CSS

const Recommendation = () => {
  const [students, setStudents] = useState([]);
  const [userFiliere, setUserFiliere] = useState('');
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const youtubeApiKey = 'AIzaSyCZ_jzZbHfzJECSHOWWZnGcLPBwssY9qYc'; // Remplacez par votre clé API YouTube

  const userEmail = localStorage.getItem('email'); // Récupérer l'email utilisateur

  useEffect(() => {
    const initWeb3 = async () => {
      if (!userEmail) {
        setError("Utilisateur non connecté ou email introuvable.");
        setLoading(false);
        return;
      }

      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const studentContractInstance = new web3.eth.Contract(
            StudentJSON.abi,
            '0x1f11EE6027486c7294e90D1c3A0094efA8cAf363' // Adresse de votre contrat
          );

          const studentList = await studentContractInstance.methods.getAllStudents().call();

          if (!studentList || studentList.length === 0) {
            setError("Aucun étudiant trouvé.");
            setLoading(false);
            return;
          }

          const matchingStudents = studentList.filter(
            (student) => student.email === userEmail
          );

          if (matchingStudents.length > 0) {
            const latestStudent = matchingStudents.reduce((latest, current) => {
              const currentYear = parseInt(current.anneeUniv.split('-')[0], 10);
              const latestYear = parseInt(latest.anneeUniv.split('-')[0], 10);
              return currentYear > latestYear ? current : latest;
            });

            setUserName(`${latestStudent.lastName} ${latestStudent.firstName}`);
            setUserFiliere(latestStudent.filiere);
            recommendVideos(latestStudent.transcript);
          } else {
            setError("Aucun étudiant correspondant à cet email.");
          }

          setStudents(studentList);
          setLoading(false);
        } else {
          alert('Ethereum provider not found. Please install MetaMask.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing Web3 or contract:', err);
        setError('Erreur lors de la connexion à MetaMask ou au contrat.');
        setLoading(false);
      }
    };

    initWeb3();
  }, [userEmail]);

  const recommendVideos = async (transcript) => {
    try {
      const lowGradeSubjects = [];
      const regex = /([^:]+)\s*:\s*(\d+(\.\d+)?)/g;
      let match;

      while ((match = regex.exec(transcript)) !== null) {
        const subjectName = match[1].trim();
        const grade = parseFloat(match[2].trim());
        if (grade <= 12) lowGradeSubjects.push(subjectName);
      }

      if (lowGradeSubjects.length === 0) {
        setRecommendedVideos([]);
        return;
      }

      const allRecommendedVideos = [];

      for (let subject of lowGradeSubjects) {
        const query = `${subject} tutorials`;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
          query
        )}&key=${youtubeApiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`Failed to fetch videos for ${subject}`);
          continue;
        }

        const data = await response.json();
        const videos = data.items.map((item) => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

        allRecommendedVideos.push(...videos);
      }

      setRecommendedVideos(allRecommendedVideos);
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Erreur lors du chargement des vidéos recommandées.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="courses-container">
      <Sidebar />
      <div className="courses-content">
        <h2>Hello {userName}</h2>
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

export default Recommendation;
