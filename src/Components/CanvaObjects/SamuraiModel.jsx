import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Samurai from './Scene';

const SamuraiModel = () => {
  const group = useRef();


  useFrame(() => {
    // group.current.rotation.y += 0.01;
  });

  return (
    <Samurai />
  );
};

export default SamuraiModel;
