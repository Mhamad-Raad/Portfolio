import NavBar from './Components/Navbar/NavBar';
import Background from './Components/StarsBackground/StarsBackground';
import AboutMe from './Components/AboutMe/AboutMe';
import WorkExperience from './Components/WorkExperience/WorkExperience';
import './App.scss';

const App = () => {
  return (
    <div className='app-page'>
      <NavBar />
      <Background />
      <AboutMe />
      <WorkExperience />
    </div>
  );
};

export default App;
