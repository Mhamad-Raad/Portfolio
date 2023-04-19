import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import useWindowSize from '../../CustomHooks/UseScreenSize';

import Astr from './Astr';

const FloatingTesla = () => {
  const { width } = useWindowSize();

  const ref = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = (1 + Math.sin(t / 10)) / 10;
    ref.current.position.y = Math.sin(t / 1.5) / 2.5;
    ref.current.rotation.y -= delta / 15;
  });

  let position = [0.75, 0, 0];
  let scale = 0.071;

  if (width < 1000 && width > 650) {
    position = [0.5, 0, 0];
    scale = 0.06;
  } else if (width < 650 && width > 550) {
    position = [0.4, 0, 0];
    scale = 0.05;
  } else if (width < 550 && width > 400) {
    position = [0.3, 0, 0];
    scale = 0.04;
  } else if (width < 400) {
    position = [0.25, 0, 0];
    scale = 0.04;
  } else {
    position = [0.75, 0, 0];
    scale = 0.071;
  }

  return (
    <group position={position} scale={scale} rotation={[1, -1, 0]} ref={ref}>
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
