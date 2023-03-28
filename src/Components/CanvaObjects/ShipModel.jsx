import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { useGLTF } from '@react-three/drei';
import Ship from './Ship';

const MovingMeteor = () => {
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.y -= delta / 10;
  });

  return (
    <group ref={ref} scale={0.02} position={[-0.8, 0.4, 0]} rotation={[-5.5, 0, 0]}>
      <Ship />
    </group>
  );
};

export default MovingMeteor;
