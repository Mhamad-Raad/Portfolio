import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const FloatingTesla = () => {
  const ref = useRef();
  const { scene } = useGLTF('./models/tesla.glb');

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = (1 + Math.sin(t / 10)) / 10;
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 5;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group
      position={[1.5, -0.1, 0]}
      scale={0.071}
      rotation={[1, -1, 0]}
      ref={ref}
    >
      <primitive object={scene} />;
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
