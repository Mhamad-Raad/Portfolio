import { FC, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Cloud } from '@react-three/drei';
import { useInView } from 'framer-motion';
import Modal from '../Modal/Modal';

import SamuraiModel from '../CanvaObjects/SamuraiModel';
import ConnectThrough from './ConnectThrough';

import './AboutMe.scss';
import ComponentLoader from '../CanvaObjects/Loader/ComponentLoader/ComponentLoader';

interface AboutMeProps {}

const AboutMe: FC<AboutMeProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className='about-me' id='about-me' ref={ref}>
      {isInView && (
        <Modal
          text='Keep in mind that any 3D module can be click and dragged to control the camera angle or hovered to see them change ;)'
          delay={2}
        />
      )}
      <div
        className={`about-me__description ${
          isInView ? '' : 'description__framer'
        }`}
      >
        <h2 className='about-me__description__title'>
          Hi There{' '}
          <span className='about-me__description__title__wave'>👋</span>, I am
          Mhamad
        </h2>
        <p className='about-me__description__me'>
          I’m a passionate Software Engineering graduate with a strong interest
          in front-end development. I thrive on learning new technologies,
          building meaningful connections, and growing both technically and
          personally. Throughout my journey, I’ve developed solid time
          management and communication skills, and I’ve consistently received
          feedback highlighting my adaptability, dedication, and strong work
          ethic. Like a samurai, I approach every challenge with honor, focus,
          and commitment—always striving to improve and contribute in meaningful
          ways. Curious to know more?
        </p>
        <div className='about-me__description__connection row'>
          <div className='column about-me__description__connection__connect'>
            <h3 className='about-me__description__connection__connect__title'>
              Let's Connect
            </h3>

            <ConnectThrough />
          </div>
          <div className='column about-me__description__connection__resume'>
            <h3 className='about-me__description__connection__resume__title'>
              Resume
            </h3>
            <a
              className='about-me__description__connection__resume__download'
              href='./Mhamad-Raad-Software-Engineer.pdf'
              target='_blank'
            >
              Download
            </a>
          </div>
        </div>
      </div>
      <div className={`about-me__samurai ${isInView ? '' : 'samurai__framer'}`}>
        <Canvas
          shadows
          camera={{ fov: 100, near: 0.1, far: 1000, position: [1.5, 1, 1.5] }}
          style={{
            borderRadius: '10px',
          }}
        >
          <Suspense fallback={<ComponentLoader />}>
            <OrbitControls enablePan={false} enableZoom={false} />
            <directionalLight
              visible
              intensity={1}
              position={[0, 10, 5]}
              castShadow
            />
            <ambientLight intensity={0.3} />
            <SamuraiModel />
            <Plane
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1.245, 0]}
              args={[1000, 1000]}
            >
              <meshStandardMaterial attach='material' color='#172335' />
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
            <Cloud
              opacity={0.75}
              position={[3, 1, -6]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default AboutMe;
