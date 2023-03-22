import NavBar from './Components/Navbar/NavBar';
import Background from './Components/StarsBackground/StarsBackground';
import AboutMe from './Components/AboutMe/AboutMe';
import Clouds from './Components/CloudSeperator/Clouds';

import './App.scss';

const App = () => {
  return (
    <div className='app-page'>
      <NavBar />
      <Background />
      <Clouds />
      <AboutMe />
    </div>
  );
};

export default App;
