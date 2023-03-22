import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const SamuraiModel = () => {
  const group = useRef();
  const { scene } = useGLTF('./models/samurai.glb');

  useFrame(() => {
    // group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
};

export default SamuraiModel;
