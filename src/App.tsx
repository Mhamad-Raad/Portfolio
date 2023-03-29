import NavBar from './Components/Navbar/NavBar';
import Background from './Components/StarsBackground/StarsBackground';
import AboutMe from './Components/AboutMe/AboutMe';
import WorkExperience from './Components/WorkExperience/WorkExperience';
import Skills from './Components/Skills/Skills';
import './App.scss';

const App = () => {
  return (
    <main className='app-page'>
      <NavBar />
      <Background />
      <AboutMe />
      <WorkExperience />
      <Skills />
    </main>
  );
};

export default App;
