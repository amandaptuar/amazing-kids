import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Program from './pages/Program';
import Auth from './pages/Auth';
import RegisterStudent from './pages/RegisterStudent';
import RegisterSchool from './pages/RegisterSchool';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import SchoolDashboard from './pages/dashboards/SchoolDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import Events from './pages/Events';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Certificate from './pages/Certificate';
import Store from './pages/Store';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/program/:category" element={<Program />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/school" element={<RegisterSchool />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/school" element={<SchoolDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/certificate/:eventId/:studentId" element={<Certificate />} />
          <Route path="/store" element={<Store />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
