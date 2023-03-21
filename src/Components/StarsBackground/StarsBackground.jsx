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
    <div className='stars-bg'>
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
      <div className='name-position-bg'>
        <h1 className='name-position-bg__name'>Mhamad Raad</h1>
        <h2 className='name-position-bg__position'>Front-end Developer</h2>
      </div>
    </div>
  );
};

export default StarsCanvas;
