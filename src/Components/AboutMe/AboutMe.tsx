import { FC } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Plane, Cloud } from '@react-three/drei';

import SamuraiModel from '../CanvaObjects/SamuraiModel';
import './AboutMe.scss';

interface AboutMeProps {}

const AboutMe: FC<AboutMeProps> = () => {
  return (
    <section className='about-me'>
      <div className='about-me__description'>
        <h2 className='about-me__description__title'>About Me</h2>
      </div>
      <div className='about-me__samurai'>
        <Canvas
          shadows
          camera={{ fov: 100, near: 0.1, far: 1000, position: [1.5, 1, 1.5] }}
        >
          <OrbitControls />
          <directionalLight
            visible
            intensity={1}
            position={[0, 10, 5]}
            castShadow // highlight-line
          />
          <ambientLight intensity={0.3} />
          <SamuraiModel />
          <Plane
            receiveShadow // highlight-line
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.245, 0]}
            args={[1000, 1000]}
          >
            <meshStandardMaterial attach='material' color='grey' />
          </Plane>
          <Cloud opacity={0.75} position={[-3, 1, -5]} scale={[0.5, 0.5, 0.5]} />
          <Cloud
            opacity={0.75}
            position={[-6, 0, -1]}
            scale={[0.5, 0.5, 0.5]}
          />
          <Cloud opacity={0.75} position={[3, 1, -6]} scale={[0.5, 0.5, 0.5]} />
        </Canvas>
      </div>
    </section>
  );
};

export default AboutMe;
