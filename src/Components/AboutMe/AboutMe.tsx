import { FC, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Cloud } from '@react-three/drei';
import { useInView } from 'framer-motion';

import SamuraiModel from '../CanvaObjects/SamuraiModel';
import './AboutMe.scss';
import ConnectionList from './ConnectionList';

interface AboutMeProps {}

const AboutMe: FC<AboutMeProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  return (
    <section className='about-me' id='about-me' ref={ref}>
      <div
        className='about-me__description'
        style={{
          transform: isInView ? 'none' : 'translateX(-200px)',
          opacity: isInView ? 1 : 0,
          transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
        }}
      >
        <h2 className='about-me__description__title'>
          Hi There{' '}
          <span className='about-me__description__title__wave'>👋</span>, I am
          Mhamad
        </h2>
        <p className='about-me__description__me'>
          I am a Software Engineer Graduate, that is very passionate about
          learning new technologies, making new connections, and make a career
          in front end development, of course in this field only tech skills
          wont be enough, thoughout my experience and journey I have also
          improved my time management, and communications, but also I have
          recieved a lot of feedback from my colleagues and friends, such as I
          am highly adaptive, dedicated, and hard working, like a Samurai which
          is a great honor toward both work and my surroundings, interested in
          learning more?
        </p>

        <div className='about-me__description__connection'>
          <h3 className='about-me__description__connection__title'>Let's Connect</h3>
          <div className='about-me__description__connection__social'>
            <ConnectionList />
          </div>
        </div>
      </div>
      <div
        className='about-me__samurai'
        style={{
          transform: isInView ? 'none' : 'translateX(200px)',
          opacity: isInView ? 1 : 0,
          transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
        }}
      >
        <Canvas
          shadows
          camera={{ fov: 100, near: 0.1, far: 1000, position: [1.5, 1, 1.5] }}
          style={{
            borderRadius: '10px',
          }}
        >
          <OrbitControls />
          <directionalLight
            visible
            intensity={1}
            position={[0, 10, 5]}
            castShadow
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
          <Cloud
            opacity={0.75}
            position={[-3, 1, -5]}
            scale={[0.5, 0.5, 0.5]}
          />
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
