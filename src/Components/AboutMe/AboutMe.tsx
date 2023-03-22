import { FC } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';

import SamuraiModel from '../CanvaObjects/SamuraiModel'
import './AboutMe.scss'

interface AboutMeProps {}

const AboutMe: FC<AboutMeProps> = () => {
  return (
    <section className='about-me'>
      <div className='about-me__description'></div>
      <div className='about-me__samurai'>
        <Canvas shadows>
          <OrbitControls />
          {/* <pointLight position={[10, 10, 10]} castShadow />
           */}
          <directionalLight
            visible
            intensity={1}
            position={[0, 10, 5]}
            castShadow // highlight-line
          />
          <SamuraiModel />
          <Plane
            receiveShadow // highlight-line
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -5, 0]}
            args={[1000, 1000]}
          >
            <meshStandardMaterial attach='material' color='white' />
          </Plane>
        </Canvas>
      </div>
    </section>
  );
}

export default AboutMe;