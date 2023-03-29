import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Decal,
  useTexture,
  Float,
  Preload,
} from '@react-three/drei';
import { Suspense } from 'react';

import Loader from './Loader';

const Ball = ({ img }) => {
  const [decal] = useTexture([img]);
  return (
    <Float speed={3} floatIntensity={5}>
      <mesh castShadow receiveShadow scale={2}>
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

const BallCanvas = ({ img }) => {
  return (
    <Canvas>
      <OrbitControls enableZoom={false} enablePan={false} />
      <directionalLight position={[0, 0, 0.05]} />
      <Suspense fallback={Loader}>
        <Ball img={img} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
