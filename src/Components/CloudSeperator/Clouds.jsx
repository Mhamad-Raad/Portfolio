import { Canvas } from '@react-three/fiber';
import { Cloud, OrbitControls } from '@react-three/drei';
import './Clouds.scss';

const HorizantalClouds = () => {
  return (
    <div className='clouds-seperator'>
      <Canvas
        camera={{ position: [0, 10, 10], fov: 75 }}
        style={{ height: '100%', width: '100%' }}
      >
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cloud
          position={[0, 0, 0]}
          scale={[100, 100, 100]}
          color='#ffffff'
          speed={0.5}
        />
        <Cloud
          position={[0, 5, 0]}
          scale={[100, 100, 100]}
          color='#ffffff'
          speed={0.5}
        />
        <Cloud position={[40, 7, 0]} speed={0.5} scale={[100, 100, 100]} />
        <Cloud position={[0, 40, 7]} speed={0.5} scale={[100, 100, 100]} />
      </Canvas>
    </div>
  );
};

export default HorizantalClouds;
