import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Samurai from './Samurai';

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
