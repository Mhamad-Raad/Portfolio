import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import useWindowSize from '../../CustomHooks/UseScreenSize';

import Ship from './Ship';

const DestinyShip = () => {
  const { width } = useWindowSize();
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.y -= delta / 10;
  });

  let position = [-0.8, 0.4, 0];
  let scale = 0.02;

  if (width < 1000 && width > 850) {
    position = [-0.45, 0.4, 0];
    scale = 0.018;
  } else if (width < 850 && width > 700) {
    position = [-0.4, 0.45, 0];
    scale = 0.015;
  } else if (width < 700 && width > 500) {
    position = [-0.3, 0.4, 0];
    scale = 0.015;
  } else if (width < 500) {
    position = [-0.18, 0.43, 0];
    scale = 0.01;
  } else {
    position = [-0.8, 0.4, 0];
    scale = 0.02;
  }


  return (
    <group ref={ref} scale={scale} position={position} rotation={[-5.5, 0, 0]}>
      <Ship />
    </group>
  );
};

export default DestinyShip;
