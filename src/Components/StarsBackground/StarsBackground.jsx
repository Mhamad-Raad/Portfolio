import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, OrbitControls } from '@react-three/drei';

import Stars from '../CanvaObjects/Stars';
import Satalite from '../CanvaObjects/Satalite';
import MovingMeteor from '../CanvaObjects/MovingMeteor';
import FloatingTesla from '../CanvaObjects/FloatingTesla';

import './StarsBackground.scss';

const StarsCanvas = () => {
  return (
    <section className='stars-bg'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls />
        <Suspense fallback={null}>
          <Stars />
          <MovingMeteor />
          <FloatingTesla />
          <Satalite />
        </Suspense>
        <Preload all />
      </Canvas>
      <div className='stars-bg__name-position-bg'>
        <h1 className='stars-bg__name-position-bg__name'>Mhamad Raad</h1>
        <h2 className='stars-bg__name-position-bg__position'>
          Front-end Developer
        </h2>
      </div>
      <div className='stars-bg__scroll'>
        <a href="#about-me">
          <span className='stars-bg__scroll__title'>Scroll</span>
          <span className='stars-bg__scroll__scroll'></span>
        </a>
      </div>
    </section>
  );
};

export default StarsCanvas;
