import { lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Loader from './Components/CanvaObjects/Loader/ScreenLoader';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 6500);
    }
    // eslint-disable-next-line
    () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loader />}

      <motion.main className={`app-page ${loading && 'disable-scroll'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 6 }}
      >
        <NavBar />
        <Background />
        <AboutMe />
        <WorkExperience />
        <Skills />
        <Projects />
        <Recommentations />
        <ContactMe />
      </motion.main>
    </>
  );
};

export default App;
