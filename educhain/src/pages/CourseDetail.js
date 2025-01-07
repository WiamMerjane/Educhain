import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./SidebarEtud";
import "./CourseDetail.css";

function CourseDetail() {
  const { courseId } = useParams(); // Utilise useParams pour obtenir l'ID du cours
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);

  // Simulation de récupération des détails du cours et des vidéos
  useEffect(() => {
    // Simulation de l'API pour obtenir les détails du cours et ses vidéos
    const fetchCourseDetail = () => {
      // Remplacez cela par une requête réelle à votre backend
      const courseData = {
        id: courseId,
        title: "React pour débutants",
        description: "Un cours pour apprendre React.js de manière pratique.",
      };
      const videosData = [
        { id: 1, title: "Introduction à React", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: 2, title: "Composants en React", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: 3, title: "State et Props", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      ];

      setCourse(courseData);
      setVideos(videosData);
    };

    fetchCourseDetail();
  }, [courseId]);

  if (!course) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="course-detail-container">
      <Sidebar />
      <div className="course-detail-content">
        <h2 className="course-detail-title">{course.title}</h2>
        <p className="course-description">{course.description}</p>

        <h3 className="video-title">Vidéos du Cours</h3>
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <h4>{video.title}</h4>
                <p>Regarder</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
