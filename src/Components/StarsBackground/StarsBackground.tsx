import { Canvas } from '@react-three/fiber';
import { Preload, OrbitControls } from '@react-three/drei';
import { Link } from 'react-scroll';

import Stars from '../CanvaObjects/Stars';
import Satalite from '../CanvaObjects/Satalite';
import MovingMeteor from '../CanvaObjects/MovingMeteor';
import Astrounount from '../CanvaObjects/Astronount';
import Ship from '../CanvaObjects/ShipModel';

import './StarsBackground.scss';

const StarsCanvas = () => {
  return (
    <section className='stars-bg'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <Stars />
        <MovingMeteor />
        <Astrounount />
        <Satalite />
        <Ship />
        <Preload all />
      </Canvas>
      <div className='stars-bg__name-position-bg'>
        <h1 className='stars-bg__name-position-bg__name'>Mhamad Raad</h1>
        <h2 className='stars-bg__name-position-bg__position'>
          Front-end Developer
        </h2>
      </div>
      <div className='stars-bg__scroll'>
        <Link
          to='about-me'
          ignoreCancelEvents={true}
          smooth={true}
          offset={-160}
          duration={500}
        >
          <span className='stars-bg__scroll__title'>Scroll</span>
          <span className='stars-bg__scroll__scroll'></span>
        </Link>
      </div>
    </section>
  );
};

export default StarsCanvas;