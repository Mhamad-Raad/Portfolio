import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import useWindowSize from '../../CustomHooks/UseScreenSize';

const Satalite = () => {
  const ref = useRef();
  const { width } = useWindowSize();
  const { scene } = useGLTF('./models/satalite.glb');

  useFrame((_, delta) => {
    ref.current.rotation.y -= delta / 15;
  });

  let position = [-1, -0.3, 0];
  let scale = 0.01;

  if (width < 1100 && width > 1000) {
    position = [-0.6, -0.3, 0];
  } else if (width < 1000 && width > 850) {
    position = [-0.5, -0.3, 0];
  } else if (width < 850 && width > 700) {
    position = [-0.4, -0.3, 0];
  } else if (width < 700 && width > 500) {
    position = [-0.3, -0.3, 0];
    scale = 0.009;
  } else if (width < 500) {
    position = [-0.2, -0.25, 0];
    scale = 0.008;
  } else {
    position = [-1, -0.3, 0];
  }

  return (
    <group position={position} scale={scale} ref={ref}>
      <primitive object={scene} />;
      <ambientLight />
    </group>
  );
};

export default Satalite;
