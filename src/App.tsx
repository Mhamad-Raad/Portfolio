import NavBar from './Components/Navbar/NavBar';
import Background from './Components/StarsBackground/StarsBackground';
import AboutMe from './Components/AboutMe/AboutMe';
import WorkExperience from './Components/WorkExperience/WorkExperience';
import Skills from './Components/Skills/Skills';
import Projects from './Components/Projects/Projects';
import Recommentations from './Components/Recommendations/Recommnendations';
import ContactMe from './Components/ContactMe/ContactMe';
import './App.scss';

const App = () => {
  return (
    <main className='app-page'>
      <NavBar />
      <Background />
      <AboutMe />
      <WorkExperience />
      <Skills />
      <Projects />
      <Recommentations />
      <ContactMe />
    </main>
  );
};

export default App;
