import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { useGLTF } from '@react-three/drei';
import Ship from './Ship'

const MovingMeteor = () => {
  const ref = useRef();

  // const { scene } = useGLTF('./models/ship.glb');

  useFrame((state, delta) => {
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group ref={ref} scale={0.05}>
      {/* <primitive object={scene} />; */}
      <Ship />
    </group>
  );
};

export default MovingMeteor;
