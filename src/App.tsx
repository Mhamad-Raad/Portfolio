import { lazy } from 'react';
import Loader from './Components/CanvaObjects/Loader/Loader';

import WorkExperience from './Components/WorkExperience/WorkExperience';
import Skills from './Components/Skills/Skills';
import Projects from './Components/Projects/Projects';
import Recommentations from './Components/Recommendations/Recommnendations';
import NavBar from './Components/Navbar/NavBar';

import './App.scss';

const Background = lazy(
  () => import('./Components/StarsBackground/StarsBackground')
);

const AboutMe = lazy(() => import('./Components/AboutMe/AboutMe'));
const ContactMe = lazy(() => import('./Components/ContactMe/ContactMe'));

const App = () => {
  return (
    <>
    <Loader />
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
    </>
  );
};

export default App;
