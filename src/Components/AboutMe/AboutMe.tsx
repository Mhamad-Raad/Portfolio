import { FC } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import SamuraiModel from '../CanvaObjects/SamuraiModel'
import './AboutMe.scss'

interface AboutMeProps {}

const AboutMe: FC<AboutMeProps> = () => {
  return (
    <section className="about-me">
      <div className="about-me__description">
      </div>
      <div className="about-me__samurai">
        <Canvas shadows>
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <SamuraiModel />
        </Canvas>
      </div>
    </section>
  )
}

export default AboutMe;