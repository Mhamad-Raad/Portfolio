import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import Astr from './Astr';

const FloatingTesla = () => {
  const ref = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = (1 + Math.sin(t / 10)) / 10;
    ref.current.position.y = ( Math.sin(t / 1.5)) / 2.5;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group
      position={[0.75, 0, 0]}
      scale={0.071}
      rotation={[1, -1, 0]}
      ref={ref}
    >
      <Astr />
      <pointLight
        position={[10, 10, 10]}
        intensity={1}
        color='white'
        castShadow
      />
    </group>
  );
};

export default FloatingTesla;
