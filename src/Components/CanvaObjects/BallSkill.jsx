import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture, Float } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Suspense } from 'react';

import Img from '../../assets/Frontend.jpg';

const Howit = () => {
  const [decal] = useTexture([Img]);
  return (
    <Float speed={3} floatIntensity={5}>
      <mesh castShadow receiveShadow scale={2}>
        <ambientLight intensity={0.38} />
        <sphereBufferGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallSkill = () => {
  const texture = useLoader(TextureLoader, Img);
  return (
    <Canvas
      style={{
        width: '15%',
      }}
    >
      <OrbitControls enableZoom={false} enablePan={false} />
      <directionalLight position={[0, 0, 0.05]} />
      <Suspense fallback={null}>
        <Howit />
      </Suspense>
    </Canvas>
  );
};

export default BallSkill;
