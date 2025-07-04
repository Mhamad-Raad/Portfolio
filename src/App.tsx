import { lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Loader from './Components/CanvaObjects/Loader/ScreenLoader';
import WorkExperience from './Components/WorkExperience/WorkExperience';
import Skills from './Components/Skills/Skills';
import Projects from './Components/Projects/Projects';
import Recommentations from './Components/Recommendations/Recommnendations';
import NavBar from './Components/Navbar/NavBar';
import Footer from './Components/Footer/Footer';
import Seperator from './Components/Seperator/Seperator';

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
      }, 5500);
    }
    // eslint-disable-next-line
    () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loader />}

      <motion.main
        className={`app-page ${loading && 'disable-scroll'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 7 }}
      >
        <NavBar />
        <Background />
        <AboutMe />
        <WorkExperience />
        <Skills />
        <Projects />
        <Seperator
          text='To see more projects checkout my '
          type='GitHub'
          link='https://github.com/Mhamad-Raad'
        />
        <Recommentations />
        <Seperator
          text='To see more Recommendations checkout my '
          type='LinkedIn'
          link='https://www.linkedin.com/in/mhamad-raad'
        />
        {!loading && <ContactMe />}
        <Footer />
      </motion.main>
    </>
  );
};

export default App;
