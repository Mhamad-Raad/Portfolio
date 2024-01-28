import { Canvas } from '@react-three/fiber';
import { Preload, OrbitControls } from '@react-three/drei';
import { Link } from 'react-scroll';
import { Suspense } from 'react';
import ComponentLoader from '../CanvaObjects/Loader/ComponentLoader/ComponentLoader';

import Stars from '../CanvaObjects/Stars';
import Satalite from '../CanvaObjects/Satalite';
import Astrounount from '../CanvaObjects/Astronount';

import Modal from '../Modal/Modal';

import './StarsBackground.scss';

const StarsCanvas = () => {
  return (
    <section className='stars-bg'>
      <Modal
        text='want to explore the space? hold click on the background and drag in any direction you want.'
        delay={9}
      />
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <Suspense fallback={<ComponentLoader />}>
          <Stars />
          <Astrounount />
          <Satalite />
        </Suspense>
        <Preload all />
      </Canvas>
      <div className='animated-title row'>
        <div className='text-top'>
          <div>
            <span>Mhamad Raad</span>
          </div>
        </div>
        <div className='text-bottom'>
          <span>Front-end Developer</span>
        </div>
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
