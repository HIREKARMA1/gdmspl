import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';
import GdmSplatLanding from './pages/Home/GdmSplatLanding';
import Projects from './pages/Home/Projects';
import About from './pages/Home/About';
import Services from './pages/Home/Services';
import Team from './pages/Home/Team';
import Careers from './pages/Careers/Careers';
import Categories from './pages/Categories/Categories';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import Contact from './pages/Home/Contact';
import TeamPage from './pages/Team/TeamPage';
import ScrollToHashElement from './components/ScrollToHashElement';

function Home() {
  return (
    <>
      <GdmSplatLanding />
      <Projects />
      <About />
      <Services />
      <Team />
      <Careers embedded />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToHashElement />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
