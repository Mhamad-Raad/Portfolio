import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { useRef, Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';

import img1 from '../../assets/LinkedIn.jpg';

const Item = ({ img }) => {
  const ref = useRef(null);

  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} onClick={(e) => console.log('click')}>
      <boxBufferGeometry
        attach='geometry'
        position={[-2, 0, 0]}
        radius={0}
        args={[2, 2, 2]}
      />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
    </mesh>
  );
};

const Connection = () => {
  const texture_1 = useLoader(TextureLoader, img1);
  return (
    <Canvas style={{ width: '75px' }}>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.38} />
      <Suspense fallback={null}>
        <Item img={texture_1} />
      </Suspense>
    </Canvas>
  );
};

export default Connection;