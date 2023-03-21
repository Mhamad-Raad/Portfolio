import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const Satalite = () => {
  const ref = useRef();
  const { scene } = useGLTF('./models/satalite.glb');

  useFrame((state, delta) => {
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group position={[-1.4, -0.5, 0]} scale={0.01} ref={ref}>
      <primitive object={scene} />;
      <ambientLight />
    </group>
  );
};

export default Satalite;
