import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

import './StarsBackground.scss';

export default function Background() {
  return (
    <div className='stars-bg'>
      <Canvas
        camera={{
          position: [0, 1, 0],
        }}
      >
        <OrbitControls enableZoom={false} />
        <Stars
          radius={100}
          depth={100}
          count={5000}
          factor={5}
          saturation={1}
          fade
          speed={1.25}
        />
      </Canvas>

      <div className='name-position-bg'>
        <h1 className='name-position-bg__name'>Mhamad Raad</h1>
        <h2 className='name-position-bg__position'>Front-end Developer</h2>
      </div>
    </div>
  );
}
