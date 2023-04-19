import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Ship from './Ship';

const DestinyShip = () => {
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.y -= delta / 10;
  });

  return (
    <group
      ref={ref}
      scale={0.02}
      position={[-0.8, 0.4, 0]}
      rotation={[-5.5, 0, 0]}
    >
      <Ship />
    </group>
  );
};

export default DestinyShip;
