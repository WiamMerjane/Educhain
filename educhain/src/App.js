import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import AddStudent from './pages/AddStudent';
import AddGrade from './pages/AddGrade';
import VerifyGrade from './pages/VerifyGrade';
import LandingPage from './pages/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './pages/UserContext';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Certificate from "./pages/Certificate";
import logo from './logo.svg';
import Professor from './pages/Professor';
import ProfileProf from './pages/ProfileProf';
import ParcoursEtud from './pages/ParcoursEtud';
import ScanCertNote from './pages/ScanCertNote';
import AddProfessor from './pages/AddProfessor';
import ProfileAdmin from './pages/ProfileAdmin';
import AllStudents from './pages/AllStudents';
import ScanCertif from './pages/ScanCertif';
import Recommendation from './pages/Recommendation';
import AllProfessors from './pages/AllProfessors';
import Verifiy from './pages/Verifiy'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/profile-prof" element={<ProfileProf />} />
          <Route path="/espace-prof" element={<Professor />} />
          <Route path="/parcours-etud" element={<ParcoursEtud />} />
          <Route path="/scan-certif-note" element={<ScanCertNote />} />
          <Route path="/ajouter-etud" element={<AddStudent />} />
          <Route path="/ajouter-prof" element={<AddProfessor />} />
          <Route path="/espace-admin" element={<ProfileAdmin />} />
          <Route path="/all-students" element={<AllStudents />} />
          <Route path="/all-professors" element={<AllProfessors />} />
          <Route path="/scan-certif" element={<ScanCertif />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/verifiy" element={<Verifiy />} />



        </Routes>
      </Router>
    </UserProvider>
  );
};
export default App;
